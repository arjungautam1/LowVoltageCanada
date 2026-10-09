# The connected editorial newsroom

The website is connected to your existing Sanity project **`via74ij9`**, dataset **`production`**, through `.env.local`. Public published reads have been verified. The dataset was empty when connected; no sample documents have been uploaded.

Your installed standalone Studio in `low-voltage-canada/` and the embedded `/studio` editor now share the canonical schemas in `src/sanity/schemaTypes/`. Both `http://localhost:3333` and `http://localhost:3000` are configured as CORS origins with credentials enabled.

## Publish your first story

1. Run `npm run studio` and open [the installed Studio](http://localhost:3333), or open [the embedded Studio](http://localhost:3000/studio) while the website is running.
2. Sign in using the Sanity account with access to Low Voltage Canada.
3. Create and publish an author.
4. Create an article with a headline, slug, standfirst, industry, story type, lead image with alt text, author, publication date, reading time, and body. Publish it.
5. A story with a publication date in the past appears on the website as its cache refreshes. The revalidation interval is 60 seconds. Drafts and future-dated stories remain hidden.

## Configure another machine or a deployment

1. Find your project ID and dataset name in [Sanity Manage](https://www.sanity.io/manage).
2. Copy `.env.example` to `.env.local` and set:

   ```dotenv
   NEXT_PUBLIC_SANITY_PROJECT_ID=via74ij9
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

   Use your actual dataset name if it is not `production`. The project ID and dataset name are public identifiers. Keep any future private tokens out of `NEXT_PUBLIC_` variables.

3. Use a **public dataset** for this initial version. Published public reads do not need an API token. Studio editing still requires signing in with a Sanity account that has access to your project.
4. In the project's API settings, add `http://localhost:3000` as a CORS origin and **allow credentials** so the embedded Studio can authenticate. Also add the exact deployed site origin with credentials when deploying. Avoid wildcard origins with credentials.
5. Restart `npm run dev`, then visit [the local Studio](http://localhost:3000/studio).
6. Create an author, then an article. Fill in its headline, slug, standfirst, industry, story type, lead image and alt text, author, publication date, reading time, and body. Publish the author and article. A future publication date hides the article until that time.

When you deploy, set the same two environment variables on the hosting provider and rebuild. Public environment values are included at build time. The Next.js app uses its standard serverless-compatible runtime; there is no separate CMS server to run.

## Content model

- **Articles**: Products, People, Companies, Integrators, Events, or Insights.
- **Industries**: AV & Collaboration, Security, Networking, and Smart Buildings.
- **Authors**: Byline profiles.
- **Organizations**: Manufacturers, integrators, and other companies.
- **People**: Industry profiles linked to an organization.
- **Events**: Dates, locations, websites, and organizers.

Articles can reference organizations, people, and events. The initial website renders article coverage; dedicated entity directories can be added as the newsroom grows.

## Delivery behaviour

Reads use a fixed API version (`2026-10-01`) and the published perspective. Next.js caches article queries with a 60-second revalidation interval; the Sanity CDN may add a short delay. Revalidation happens on subsequent requests. Drafts are never shown on the public site. This first version does not include draft preview or instant webhook revalidation.

Once configured, an empty dataset produces an empty newsroom. Fetch errors remain visible instead of silently substituting sample stories. Setting the project ID back to empty explicitly restores demo mode.

Reference: [Sanity client configuration](https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs) and [embedding Studio in Next.js](https://www.sanity.io/docs/nextjs/embedding-sanity-studio-in-nextjs).
