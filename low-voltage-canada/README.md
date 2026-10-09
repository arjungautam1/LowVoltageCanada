# Low Voltage Canada Studio

This standalone Sanity Studio connects to project `via74ij9`, dataset `production`.
It uses the same editorial schemas as the Next.js website and its embedded Studio:
`../src/sanity/schemaTypes`. Its `schemaTypes/index.ts` re-exports that source so
changes to articles, authors, organizations, people, and events stay consistent
across both editing interfaces.

From this directory:

```sh
npm install
npm run dev
```

Open the standalone editor at http://localhost:3333 and sign in with your Sanity
account. The Next.js website runs separately at http://localhost:3000 from the
repository root. The embedded editor remains available at
http://localhost:3000/studio.

Use `npm run build` to verify the standalone Studio before deployment. The
Structure and Vision plugins from the original installation are preserved.
Connection and schema registration do not create or publish content; publish
articles in Studio to make them available to the website.
