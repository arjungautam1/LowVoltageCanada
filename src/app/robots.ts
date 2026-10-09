import type { MetadataRoute } from "next";
import { absoluteUrl, canIndexSite } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  if (!canIndexSite) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/studio", "/api/"] },
    sitemap: [absoluteUrl("/sitemap.xml"), absoluteUrl("/news-sitemap.xml")],
  };
}
