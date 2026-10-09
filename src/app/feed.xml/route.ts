import { getArticles } from "@/sanity/lib/queries";
import { absoluteUrl, siteConfig } from "@/lib/seo";
import { escapeXml } from "@/lib/xml";

export const revalidate = 60;

export async function GET() {
  const articles = (await getArticles())
    .filter((article) => !article.isDemo && !article.noIndex)
    .slice(0, 50);
  const entries = articles
    .map((article) => {
      const url = escapeXml(
        absoluteUrl(`/stories/${encodeURIComponent(article.slug)}`),
      );
      return `<item><title>${escapeXml(article.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><description>${escapeXml(article.excerpt)}</description><pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate><category>${escapeXml(article.topic)}</category></item>`;
    })
    .join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${escapeXml(siteConfig.name)}</title><link>${escapeXml(absoluteUrl("/"))}</link><description>${escapeXml(siteConfig.description)}</description><language>en-ca</language><atom:link href="${escapeXml(absoluteUrl("/feed.xml"))}" rel="self" type="application/rss+xml"/>${entries}</channel></rss>`,
    { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } },
  );
}
