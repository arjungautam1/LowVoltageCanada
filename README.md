# Low Voltage Canada

A Canadian editorial publication covering AV, security, networking, and smart buildings. Built with Next.js App Router, TypeScript, React, and Sanity, ready for a serverless Next.js hosting provider.

## Step 1: the editorial foundation

- Responsive homepage with featured coverage, latest dispatches, industry sectors, and a people feature.
- Article pages with Portable Text, bylines, related stories, and link sharing.
- Story directory with combined story-type and sector filters.
- Search and an accessible search dialog.
- About page and embedded Sanity Studio at `/studio`.
- Sanity schemas for articles, authors, companies, people, and events.

The site is connected to the existing Sanity project **`via74ij9`**, dataset **`production`**. Published articles come from Sanity. The supplied Low Voltage Canada logo is used in the header, footer, sharing card, and publication metadata. The original PNG is preserved in `public/brand/low-voltage-canada.png`; SVG viewports arrange its artwork for the compact header.

## Run locally

Use Node.js 24 LTS (the version in `.nvmrc`).

```sh
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000).

Run the installed standalone editor in a second terminal:

```sh
npm install --prefix low-voltage-canada
npm run studio
```

Open [localhost:3333](http://localhost:3333) and sign in to your Sanity account. The same editor schemas are also available at [localhost:3000/studio](http://localhost:3000/studio).

```sh
npm run lint
npm run typecheck
npm run build
```

## Sanity connection

The existing `low-voltage-canada/` Sanity Studio now imports the same editorial schemas as the embedded editor. It is excluded from this Next.js project's TypeScript and lint checks and builds independently.

See [README-sanity.md](./README-sanity.md). `.env.local` contains the public project ID and dataset, and both local Studio origins allow credentials. A public dataset needs no read token; Studio editing requires an authorized Sanity account.

The app reads only published content and refreshes cached stories with a 60-second revalidation interval. When configured, an empty dataset shows an empty publication instead of demo stories. Content errors surface as an error screen with a retry control.

## Deployment

The project uses standard Next.js rendering and image optimization. `vercel.json` selects Next.js, builds with `npm run build`, and uses `.next` output. Set Vercel's Root Directory to the repository root, rather than the nested standalone Studio. The Sanity project ID and dataset must be set on the hosting provider; local `.env.local` is excluded from Git. Add the deployed editor origin to Sanity CORS settings with credentials if you use `/studio` there. No separately hosted CMS server or database is required.

## SEO and publishing

- Canonical URLs use `NEXT_PUBLIC_SITE_URL`, or Vercel's production domain automatically. Set the explicit origin when connecting a custom domain. Preview deployments, localhost, and demo mode are not indexable.
- Articles have optional search title, search description, social image, and search-indexing controls in Sanity. Defaults use the article headline, standfirst, and lead image. The editorial update date must describe a real, published update; unrelated CMS revisions do not change the article date.
- `/topics/av-collaboration`, `/topics/security`, `/topics/networking`, and `/topics/smart-buildings` provide Canadian coverage hubs. Hubs become indexable once they contain an indexable published story.
- `/authors/[slug]` displays contributor profiles and published stories. Add authentic biographies in Sanity; incomplete profiles stay out of search and the sitemap.
- `/sitemap.xml` includes indexable published stories, populated topic hubs, and complete author profiles. `/news-sitemap.xml` includes only articles published in the last 48 hours. `/feed.xml` provides the latest 50 indexable stories as RSS.
- Search, filtered listings, the editorial Studio, and demo stories are not indexed. Real stories can be individually excluded from search in Sanity without removing them from the website.
- Page and article metadata include Canadian English language, canonical links, social cards, publication dates, and structured data for the publication, website, articles, contributors, and breadcrumbs.

For launch, verify the final domain in Google Search Console and Bing Webmaster Tools, submit the sitemap URLs, and validate an article using Google's Rich Results Test. Optional verification codes can be configured through `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION`. Replace demo/test reporting with original articles, add real contributor biographies and editorial contact details, and keep test stories hidden from search until launch. These editorial and domain details must be authentic; technical SEO cannot guarantee rankings or Google News inclusion.

## Design

Dependency note: the current dependency tree reports transitive npm advisories in Sanity CLI dependencies and file parsing/globbing tools. A compatible `npm audit fix` was attempted; the remaining advisories need upstream fixes or a reviewed dependency change before deployment.

Canadian red `#CE272E`, ink `#202321`, and warm paper `#F9F9F6`. Manrope headlines and DM Sans interface text are bundled locally through Fontsource. Hero and preview photographs use [Unsplash](https://unsplash.com), served through Next.js image optimization; they are illustrative and do not represent people or projects discussed in the sample text. Replace them with licensed editorial assets in Sanity for launch.

Planned next steps: publish original reporting and configure the final custom domain. Newsletter subscriptions, advertising, analytics, dedicated organization directories, and draft previews can follow when needed. Clearing the project ID explicitly restores the clearly labelled demo content for design review.
# LowVoltageCanada
