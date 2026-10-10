import type { Metadata } from "next";
import { isSanityConfigured } from "@/sanity/env";

function getOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const candidate =
    configured ||
    (vercelDomain ? `https://${vercelDomain}` : "http://localhost:3000");
  const url = new URL(candidate);
  if (
    !/^https?:$/.test(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be a website origin, such as https://your-domain.ca, without a path or credentials.",
    );
  }
  return url.origin;
}

export const siteConfig = {
  name: "Low Voltage Canada",
  email: "arjun@lowvoltagecanada.com",
  url: getOrigin(),
  description:
    "Canadian low-voltage industry news covering AV, security, networking and smart buildings, plus products, companies, integrators, people and events.",
};

const origin = new URL(siteConfig.url);
export const canIndexSite =
  process.env.NODE_ENV === "production" &&
  process.env.VERCEL_ENV !== "preview" &&
  origin.protocol === "https:" &&
  !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(origin.hostname) &&
  isSanityConfigured;

export function absoluteUrl(path: string): string {
  return new URL(path, `${siteConfig.url}/`).toString();
}

export function indexableRobots(noIndex = false): Metadata["robots"] {
  return {
    index: canIndexSite && !noIndex,
    follow: true,
    googleBot: {
      index: canIndexSite && !noIndex,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

export function buildMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image || "/social");
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: indexableRobots(noIndex),
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: "en_CA",
      type: "website",
      images: [{ url: imageUrl, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: imageUrl, alt: title }],
    },
  };
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
