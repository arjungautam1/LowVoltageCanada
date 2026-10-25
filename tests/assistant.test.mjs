import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createContext, runInContext } from "node:vm";
import ts from "typescript";

function setup(
  key = "test-key",
  upstream = Response.json({
    status: "completed",
    output: [
      { content: [{ type: "output_text", text: "Training coverage." }] },
    ],
  }),
) {
  const calls = [];
  const article = {
    title: "Training",
    slug: "training",
    excerpt: "Technician education",
    topic: "Networking",
    publishedAt: "2026-10-01",
    body: [],
    isDemo: false,
  };
  const exports = {};
  const context = createContext({
    exports,
    Request,
    Response,
    URL,
    AbortSignal,
    Map,
    Date,
    process: { env: { OPENAI_API_KEY: key } },
    require: (name) =>
      name.includes("queries")
        ? {
            getArticles: async () => [article],
            getArticle: async (slug) =>
              slug === article.slug ? article : null,
          }
        : { toPlainText: () => "Full story content" },
    fetch: async (...args) => {
      calls.push(args);
      return upstream;
    },
  });
  const source = readFileSync(
    new URL("../src/app/api/assistant/route.ts", import.meta.url),
    "utf8",
  );
  runInContext(
    ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
    context,
  );
  return { post: exports.POST, calls };
}
function request(
  body = { question: "Find training stories" },
  origin = "https://example.com",
) {
  return new Request("https://example.com/api/assistant", {
    method: "POST",
    headers: { origin, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
test("answers use server-held credentials, bounded output, and catalog links", async () => {
  const { post, calls } = setup();
  const response = await post(request());
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.answer, "Training coverage.");
  assert.equal(data.sources[0].href, "/stories/training");
  const payload = JSON.parse(calls[0][1].body);
  assert.equal(payload.store, false);
  assert.equal(payload.max_output_tokens, 650);
  assert.equal(calls[0][1].headers.Authorization, "Bearer test-key");
  assert.ok(!JSON.stringify(data).includes("test-key"));
});
test("cross-origin and malformed questions never reach OpenAI", async () => {
  const { post, calls } = setup();
  assert.equal(
    (await post(request(undefined, "https://other.com"))).status,
    403,
  );
  assert.equal((await post(request({ question: " " }))).status, 400);
  assert.equal(
    (await post(request({ question: "x".repeat(1001) }))).status,
    400,
  );
  assert.equal(calls.length, 0);
});
test("missing keys and provider failures produce useful errors", async () => {
  assert.equal((await setup("").post(request())).status, 503);
  const result = await setup(
    "test-key",
    Response.json({ error: "private details" }, { status: 401 }),
  ).post(request());
  assert.equal(result.status, 502);
  assert.ok(!(await result.text()).includes("private details"));
});
test("story questions include body; unknown stories do not call OpenAI", async () => {
  const { post, calls } = setup();
  assert.equal(
    (await post(request({ question: "Summarize", slug: "missing" }))).status,
    404,
  );
  assert.equal(calls.length, 0);
  assert.equal(
    (await post(request({ question: "Summarize", slug: "training" }))).status,
    200,
  );
  assert.match(calls[0][1].body, /Full story content/);
});
test("repeated requests are rate limited before reaching provider", async () => {
  const { post, calls } = setup();
  for (let i = 0; i < 8; i++) await post(request({ question: " " }));
  assert.equal((await post(request())).status, 429);
  assert.equal(calls.length, 0);
});
