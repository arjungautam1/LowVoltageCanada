import assert from "node:assert/strict";
import test from "node:test";
import { InquirySendError, sendInquiry } from "../src/lib/send-inquiry.ts";

const inquiry = {
  name: "A Test Reader",
  company: "Example Integrator",
  email: "reader@example.com",
  inquiry: "Story or project",
  message: "Please consider our project for a story.",
};

function expectErrorCode(code) {
  return (error) => {
    assert.ok(error instanceof InquirySendError);
    assert.equal(error.code, code);
    assert.ok(error.message.length > 0);
    return true;
  };
}

test("accepted responses send the expected payload once", async (t) => {
  const request = t.mock.method(
    globalThis,
    "fetch",
    async () => new Response("OK", { status: 202 }),
  );

  await sendInquiry(inquiry);

  assert.equal(request.mock.callCount(), 1);
  const [url, options] = request.mock.calls[0].arguments;
  assert.equal(url, "/api/inquiry");
  assert.equal(options.method, "POST");
  assert.equal(
    new Headers(options.headers).get("content-type"),
    "application/json",
  );
  assert.deepEqual(JSON.parse(options.body), inquiry);
  assert.ok(options.signal instanceof AbortSignal);
});

test("provider rejection is sanitized without reading its response body", async (t) => {
  const providerText = "PRIVATE_PROVIDER_ERROR: test-service test-public-key";
  const readText = t.mock.fn(() => new Promise(() => {}));
  const request = t.mock.method(globalThis, "fetch", async () => ({
    ok: false,
    status: 400,
    statusText: providerText,
    text: readText,
  }));

  await assert.rejects(sendInquiry(inquiry), (error) => {
    expectErrorCode("rejected")(error);
    assert.ok(!error.message.includes(providerText));
    return true;
  });

  assert.equal(request.mock.callCount(), 1);
  assert.equal(readText.mock.callCount(), 0);
});

test("network failures explain uncertain delivery without retrying", async (t) => {
  const networkDetail = "PRIVATE_NETWORK_ERROR";
  const request = t.mock.method(globalThis, "fetch", async () => {
    throw new TypeError(networkDetail);
  });

  await assert.rejects(sendInquiry(inquiry), (error) => {
    expectErrorCode("network")(error);
    assert.match(
      error.message,
      /confirm|unsure|uncertain|may have|might have/i,
    );
    assert.ok(!error.message.includes(networkDetail));
    return true;
  });
  assert.equal(request.mock.callCount(), 1);
});

test("a pending request reaches its 12-second deadline and aborts", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const request = t.mock.method(
    globalThis,
    "fetch",
    () => new Promise(() => {}),
  );
  const submission = sendInquiry(inquiry);
  const rejected = assert.rejects(submission, expectErrorCode("timeout"));
  const [, options] = request.mock.calls[0].arguments;

  t.mock.timers.tick(11_999);
  assert.equal(options.signal.aborted, false);
  t.mock.timers.tick(1);
  await rejected;

  assert.equal(options.signal.aborted, true);
  assert.equal(request.mock.callCount(), 1);
});

test("a fast success clears the deadline without later aborting", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const request = t.mock.method(
    globalThis,
    "fetch",
    async () => new Response("OK", { status: 200 }),
  );

  await sendInquiry(inquiry);
  const [, options] = request.mock.calls[0].arguments;
  t.mock.timers.tick(24_000);
  assert.equal(options.signal.aborted, false);
  assert.equal(request.mock.callCount(), 1);
});

test("a late accepted response cannot change a timed-out result", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let resolveRequest;
  const request = t.mock.method(
    globalThis,
    "fetch",
    () =>
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
  );
  const submission = sendInquiry(inquiry);
  const rejected = assert.rejects(submission, expectErrorCode("timeout"));

  t.mock.timers.tick(12_000);
  await rejected;
  resolveRequest(new Response("OK", { status: 200 }));
  await Promise.resolve();
  await assert.rejects(submission, expectErrorCode("timeout"));
  assert.equal(request.mock.callCount(), 1);
});

test("a late network rejection cannot replace the timeout or go unhandled", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let rejectRequest;
  const request = t.mock.method(
    globalThis,
    "fetch",
    () =>
      new Promise((_, reject) => {
        rejectRequest = reject;
      }),
  );
  const submission = sendInquiry(inquiry);
  const rejected = assert.rejects(submission, expectErrorCode("timeout"));

  t.mock.timers.tick(12_000);
  await rejected;
  rejectRequest(new TypeError("Late connection failure"));
  await Promise.resolve();
  await assert.rejects(submission, expectErrorCode("timeout"));
  assert.equal(request.mock.callCount(), 1);
});
