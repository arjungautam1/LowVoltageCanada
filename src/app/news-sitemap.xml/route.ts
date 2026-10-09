import { getArticles } from "@/sanity/lib/queries";
import { absoluteUrl, canIndexSite, siteConfig } from "@/lib/seo";
import { escapeXml } from "@/lib/xml";

export const revalidate = 60;

export async function GET() {
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;
  const articles = canIndexSite
    ? (await getArticles())
        .filter(
          (article) =>
            !article.isDemo &&
            !article.noIndex &&
            Date.parse(article.publishedAt) >= cutoff,
        )
        .slice(0, 1000)
    : [];
  const entries = articles
    .map(
      (article) =>
        `<url><loc>${escapeXml(absoluteUrl(`/stories/${encodeURIComponent(article.slug)}`))}</loc><news:news><news:publication><news:name>${escapeXml(siteConfig.name)}</news:name><news:language>en</news:language></news:publication><news:publication_date>${escapeXml(article.publishedAt)}</news:publication_date><news:title>${escapeXml(article.title)}</news:title></news:news></url>`,
    )
    .join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${entries}</urlset>`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
}
