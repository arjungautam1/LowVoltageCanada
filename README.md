# Low Voltage Canada

A Canadian editorial publication covering AV, security, networking, and smart buildings. Built with Next.js App Router, TypeScript, React, and Sanity, ready for a serverless Next.js hosting provider.

## Step 1: the editorial foundation

- Responsive homepage with featured coverage, latest dispatches, industry sectors, and a people feature.
- Article pages with Portable Text, bylines, related stories, and link sharing.
- Story directory with combined story-type and sector filters.
- Search and an accessible search dialog.
- About page and embedded Sanity Studio at `/studio`.
- Sanity schemas for articles, authors, companies, people, and events.

The site is connected to the existing Sanity project **`via74ij9`**, dataset **`production`**. Published articles come from Sanity. The dataset was empty when connected, so the site shows an empty newsroom until the first article is published. The wordmark is a temporary design until the final logo arrives.

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

The project uses standard Next.js rendering and image optimization. Deploy to a provider supporting Next.js serverless functions and ISR, such as Vercel; no separately hosted CMS server or database is required. Set the same Sanity environment variables on the provider and add the deployed site origin to the project's CORS settings. No deployment has been created in this first step.

## Design

Dependency note: the current dependency tree reports transitive npm advisories in Sanity CLI dependencies and file parsing/globbing tools. A compatible `npm audit fix` was attempted; the remaining advisories need upstream fixes or a reviewed dependency change before deployment.

Canadian red `#CE272E`, ink `#202321`, and warm paper `#F9F9F6`. Manrope headlines and DM Sans interface text are bundled locally through Fontsource. Hero and preview photographs use [Unsplash](https://unsplash.com), served through Next.js image optimization; they are illustrative and do not represent people or projects discussed in the sample text. Replace them with licensed editorial assets in Sanity for launch.

Planned next steps: add the supplied logo, publish the first real stories, then configure the domain and deployment. Newsletter subscriptions, advertising, analytics, dedicated organization directories, and draft previews can follow when needed. Clearing the project ID explicitly restores the clearly labelled demo content for design review.
# LowVoltageCanada
