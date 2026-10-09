import { defineQuery } from "next-sanity";
import { cache } from "react";
import {
  createImageUrlBuilder,
  type SanityImageObject,
} from "@sanity/image-url";
import { demoArticles } from "@/lib/demo-data";
import type { Article, Author } from "@/lib/types";
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
  ...(author->{ "author": name, "authorSlug": slug.current }),
  publishedAt,
  updatedAt,
  "seoTitle": coalesce(seoTitle, title),
  "seoDescription": coalesce(seoDescription, excerpt),
  "socialImage": coalesce(socialImage, mainImage),
  "noIndex": coalesce(noIndex, false),
  "readTime": coalesce(readTime, 4),
  "featured": coalesce(featured, false),
  province
`;

export const articlesQuery = defineQuery(`
  *[_type == "article" && defined(slug.current) && publishedAt <= now()]
    | order(publishedAt desc) {${articleFields}, "body": []}
`);

export const articleQuery = defineQuery(`
  *[_type == "article" && slug.current == $slug && publishedAt <= now()][0]
    {${articleFields}, "body": coalesce(body, [])}
`);

export const authorQuery = defineQuery(`
  *[_type == "author" && slug.current == $slug][0]{
    "id": _id,
    "slug": slug.current,
    name,
    role,
    bio,
    "portrait": image,
    "articles": *[
      _type == "article" &&
      author._ref == ^._id &&
      defined(slug.current) &&
      publishedAt <= now()
    ] | order(publishedAt desc) {${articleFields}, "body": []}
  }
`);

export const authorsQuery = defineQuery(`
  *[
    _type == "author" &&
    defined(slug.current) &&
    defined(bio) &&
    count(*[
      _type == "article" &&
      author._ref == ^._id &&
      defined(slug.current) &&
      publishedAt <= now() &&
      noIndex != true
    ]) > 0
  ]{
    "slug": slug.current,
    "updatedAt": _updatedAt,
    bio
  }
`);

const fetchOptions = { next: { revalidate: 60, tags: ["articles"] } };
const imageBuilder = client ? createImageUrlBuilder(client) : null;

type ArticleResult = Omit<Article, "image" | "seoImage"> & {
  mainImage?: SanityImageObject | null;
  socialImage?: SanityImageObject | null;
};

function normalizeArticle({
  mainImage,
  socialImage,
  ...article
}: ArticleResult): Article {
  const updateTime = article.updatedAt
    ? new Date(article.updatedAt).getTime()
    : NaN;
  const publicationTime = new Date(article.publishedAt).getTime();
  // API-created or legacy records can bypass Studio validation.
  const updatedAt =
    Number.isFinite(updateTime) &&
    updateTime >= publicationTime &&
    updateTime <= Date.now()
      ? article.updatedAt
      : undefined;
  return {
    ...article,
    updatedAt,
    author: article.author || "Low Voltage Canada",
    seoTitle: article.seoTitle?.trim() || article.title,
    seoDescription: article.seoDescription?.trim() || article.excerpt,
    seoImage:
      socialImage?.asset && imageBuilder
        ? imageBuilder
            .image(socialImage)
            .width(1200)
            .height(630)
            .fit("crop")
            .auto("format")
            .url()
        : undefined,
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
  if (!client) return demoArticles.map((article) => ({ ...article, body: [] }));
  const articles = await client.fetch<ArticleResult[]>(
    articlesQuery,
    {},
    fetchOptions,
  );
  return articles.map(normalizeArticle);
}

export const getArticle = cache(
  async (slug: string): Promise<Article | null> => {
    if (!client)
      return demoArticles.find((article) => article.slug === slug) ?? null;
    const article = await client.fetch<ArticleResult | null>(
      articleQuery,
      { slug },
      fetchOptions,
    );
    return article ? normalizeArticle(article) : null;
  },
);

type AuthorResult = Omit<Author, "image" | "imageAlt" | "articles"> & {
  portrait?: SanityImageObject | null;
  articles: ArticleResult[];
};

/** Published author profiles only: the client uses the published perspective. */
export const getAuthor = cache(async (slug: string): Promise<Author | null> => {
  if (!client) return null;
  const author = await client.fetch<AuthorResult | null>(
    authorQuery,
    { slug },
    fetchOptions,
  );
  if (!author) return null;
  const { portrait, articles, ...profile } = author;
  return {
    ...profile,
    image:
      portrait?.asset && imageBuilder
        ? imageBuilder
            .image(portrait)
            .width(320)
            .height(320)
            .fit("crop")
            .auto("format")
            .url()
        : undefined,
    imageAlt: `${profile.name}, Low Voltage Canada contributor`,
    articles: articles.map(normalizeArticle),
  };
});

export interface AuthorEntry {
  slug: string;
  updatedAt?: string;
  bio?: string;
}

/** Sitemap entries require a useful biography and at least one indexable story. */
export async function getAuthors(): Promise<AuthorEntry[]> {
  if (!client) return [];
  const authors = await client.fetch<AuthorEntry[]>(
    authorsQuery,
    {},
    fetchOptions,
  );
  return authors.filter((author) => Boolean(author.bio?.trim()));
}
