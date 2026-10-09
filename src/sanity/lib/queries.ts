import { defineQuery } from "next-sanity";
import {
  createImageUrlBuilder,
  type SanityImageObject,
} from "@sanity/image-url";
import { demoArticles } from "@/lib/demo-data";
import type { Article } from "@/lib/types";
import { client } from "./client";

const articleFields = `
  "id": _id,
  "slug": slug.current,
  title,
  excerpt,
  kind,
  topic,
  mainImage,
  "imageAlt": coalesce(mainImage.alt, title),
  "author": coalesce(author->name, "Low Voltage Canada"),
  publishedAt,
  "readTime": coalesce(readTime, 4),
  "featured": coalesce(featured, false),
  province,
  "body": coalesce(body, [])
`;

export const articlesQuery = defineQuery(`
  *[_type == "article" && defined(slug.current) && publishedAt <= now()]
    | order(publishedAt desc) {${articleFields}}
`);

export const articleQuery = defineQuery(`
  *[_type == "article" && slug.current == $slug && publishedAt <= now()][0]
    {${articleFields}}
`);

const fetchOptions = { next: { revalidate: 60, tags: ["articles"] } };
const imageBuilder = client ? createImageUrlBuilder(client) : null;

type ArticleResult = Omit<Article, "image"> & {
  mainImage?: SanityImageObject | null;
};

function normalizeArticle({ mainImage, ...article }: ArticleResult): Article {
  return {
    ...article,
    image:
      mainImage?.asset && imageBuilder
        ? imageBuilder
            .image(mainImage)
            .width(1600)
            .height(1000)
            .fit("crop")
            .auto("format")
            .url()
        : "/images/story-placeholder.svg",
  };
}

/** Fetch published stories on the server. Configuration errors stay visible. */
export async function getArticles(): Promise<Article[]> {
  if (!client) return demoArticles;
  const articles = await client.fetch<ArticleResult[]>(
    articlesQuery,
    {},
    fetchOptions,
  );
  return articles.map(normalizeArticle);
}

export async function getArticle(slug: string): Promise<Article | null> {
  if (!client)
    return demoArticles.find((article) => article.slug === slug) ?? null;
  const article = await client.fetch<ArticleResult | null>(
    articleQuery,
    { slug },
    fetchOptions,
  );
  return article ? normalizeArticle(article) : null;
}
