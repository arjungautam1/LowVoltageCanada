import assert from "node:assert/strict";
import test from "node:test";
import { handleInquiry } from "../src/lib/inquiry-handler.ts";

const inquiry = {
  name: "Reader",
  email: "reader@example.com",
  company: "Example",
  inquiry: "Story or project",
  message: "Our latest project.",
};

function setup(t) {
  const variables = {
    RESEND_API_KEY: "test-api-key",
    CONTACT_TO_EMAIL: "owner@example.com",
    RESEND_FROM_EMAIL: "Publication <sender@example.com>",
    NODE_ENV: "production",
  };
  for (const [name, value] of Object.entries(variables)) {
    const previous = process.env[name];
    process.env[name] = value;
    t.after(() =>
      previous === undefined
        ? delete process.env[name]
        : (process.env[name] = previous),
    );
  }
  return t.mock.method(globalThis, "fetch", async () =>
    Response.json({ id: "test-email" }),
  );
}

function request(body = inquiry, headers = {}) {
  return new Request("https://example.com/api/inquiry", {
    method: "POST",
    headers: {
      origin: "https://example.com",
      "content-type": "application/json",
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

test("validated inquiries use server-controlled recipient and sender, with visitor reply-to", async (t) => {
  const transport = setup(t);
  const response = await handleInquiry(
    request({
      ...inquiry,
      to: "attacker@example.com",
      from: "attacker@example.com",
    }),
  );
  assert.equal(response.status, 200);
  const result = await response.text();
  assert.deepEqual(JSON.parse(result), { sent: true });
  assert.ok(!result.includes("test-api-key"));
  assert.equal(transport.mock.callCount(), 1);
  const [url, options] = transport.mock.calls[0].arguments;
  assert.equal(url, "https://api.resend.com/emails");
  const email = JSON.parse(options.body);
  assert.deepEqual(email.to, ["owner@example.com"]);
  assert.equal(email.from, "Publication <sender@example.com>");
  assert.equal(email.reply_to, inquiry.email);
  assert.match(email.text, /Our latest project/);
  assert.ok(options.signal instanceof AbortSignal);
});

test("cross-origin submissions never reach Resend", async (t) => {
  const transport = setup(t);
  assert.equal(
    (await handleInquiry(request(inquiry, { origin: "https://other.example" })))
      .status,
    403,
  );
  assert.equal(transport.mock.callCount(), 0);
});

test("invalid email and header injection are rejected before sending", async (t) => {
  const transport = setup(t);
  for (const fields of [
    { email: "bad-address" },
    { inquiry: "Hello\r\nBcc: other@example.com" },
    { message: "" },
    { name: 12 },
  ]) {
    assert.equal(
      (await handleInquiry(request({ ...inquiry, ...fields }))).status,
      400,
    );
  }
  assert.equal(transport.mock.callCount(), 0);
});

test("malformed JSON and oversized submissions never reach Resend", async (t) => {
  const transport = setup(t);
  assert.equal((await handleInquiry(request("{"))).status, 400);
  assert.equal(
    (await handleInquiry(request({ ...inquiry, message: "x".repeat(17000) })))
      .status,
    413,
  );
  assert.equal(transport.mock.callCount(), 0);
});

test("missing private configuration fails clearly without sending", async (t) => {
  const transport = setup(t);
  delete process.env.RESEND_API_KEY;
  assert.equal((await handleInquiry(request())).status, 503);
  assert.equal(transport.mock.callCount(), 0);
});

test("Resend rejections are sanitized and never reported as success", async (t) => {
  setup(t);
  t.mock.method(globalThis, "fetch", async () =>
    Response.json(
      { name: "validation_error", message: "private provider detail" },
      { status: 403 },
    ),
  );
  const response = await handleInquiry(request());
  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), {
    error: "Unable to send your message.",
  });
});
