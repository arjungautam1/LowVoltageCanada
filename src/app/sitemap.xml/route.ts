import { getArticles, getAuthors } from "@/sanity/lib/queries";
import { absoluteUrl, canIndexSite } from "@/lib/seo";
import { topics } from "@/lib/types";
import { escapeXml } from "@/lib/xml";

export const revalidate = 60;

type SitemapEntry = {
  path: string;
  lastModified?: string;
  image?: string;
};

export async function GET() {
  const entries: SitemapEntry[] = [];
  if (canIndexSite) {
    const [stories, authors] = await Promise.all([getArticles(), getAuthors()]);
    const articles = stories.filter(
      (article) => !article.isDemo && !article.noIndex,
    );
    entries.push(
      ...["/", "/about", "/stories"].map((path) => ({ path })),
      ...topics
        .filter((topic) =>
          articles.some((article) => article.topic === topic.name),
        )
        .map((topic) => ({ path: `/topics/${topic.slug}` })),
      ...authors.map((author) => ({
        path: `/authors/${encodeURIComponent(author.slug)}`,
        lastModified: author.updatedAt,
      })),
      ...articles.map((article) => ({
        path: `/stories/${encodeURIComponent(article.slug)}`,
        lastModified: article.updatedAt || article.publishedAt,
        image: article.image.startsWith("https://") ? article.image : undefined,
      })),
    );
  }

  // Serialize explicitly: Sanity image transformation URLs contain ampersands.
  const urls = entries
    .map(
      ({ path, lastModified, image }) =>
        `<url><loc>${escapeXml(absoluteUrl(path))}</loc>${lastModified ? `<lastmod>${escapeXml(lastModified)}</lastmod>` : ""}${image ? `<image:image><image:loc>${escapeXml(image)}</image:loc></image:image>` : ""}</url>`,
    )
    .join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls}</urlset>`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
}
