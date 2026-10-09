import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { ArrowLeft } from "lucide-react";
import { getArticle, getArticles } from "@/sanity/lib/queries";
import { ShareButton } from "@/components/share-button";
import { SectionHeading } from "@/components/section-heading";
import { StoryCard } from "@/components/story-card";
import { absoluteUrl, breadcrumbs, buildMetadata, siteConfig } from "@/lib/seo";
import { StructuredData } from "@/components/structured-data";
import { topics } from "@/lib/types";
import { decodeRouteSlug } from "@/lib/route-slug";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();
  const path = `/stories/${encodeURIComponent(article.slug)}`;
  const metadata = buildMetadata({
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    path,
    image: article.seoImage || article.image,
    noIndex: article.isDemo || article.noIndex,
  });
  return {
    ...metadata,
    authors: [
      {
        name: article.author,
        ...(article.authorSlug
          ? {
              url: absoluteUrl(
                `/authors/${encodeURIComponent(article.authorSlug)}`,
              ),
            }
          : {}),
      },
    ],
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      ...(article.authorSlug
        ? {
            authors: [
              absoluteUrl(`/authors/${encodeURIComponent(article.authorSlug)}`),
            ],
          }
        : {}),
      section: article.topic,
      tags: [article.topic, article.kind, "Canada"],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(decodeRouteSlug(slug));
  if (!article) notFound();
  const topic = topics.find((item) => item.name === article.topic);
  const path = `/stories/${encodeURIComponent(article.slug)}`;
  const authorPath = article.authorSlug
    ? `/authors/${encodeURIComponent(article.authorSlug)}`
    : undefined;
  const related = (await getArticles())
    .filter((item) => item.id !== article.id)
    .sort(
      (a, b) =>
        Number(b.topic === article.topic) - Number(a.topic === article.topic),
    )
    .slice(0, 3);
  return (
    <main id="main" className="article-main">
      {!article.isDemo && !article.noIndex && (
        <StructuredData
          data={[
            {
              "@context": "https://schema.org",
              "@type": "NewsArticle",
              "@id": absoluteUrl(`${path}#article`),
              headline: article.title,
              description: article.excerpt,
              image: [absoluteUrl(article.image)],
              datePublished: article.publishedAt,
              dateModified: article.updatedAt || article.publishedAt,
              author: {
                "@type":
                  article.author === siteConfig.name
                    ? "Organization"
                    : "Person",
                name: article.author,
                ...(authorPath ? { url: absoluteUrl(authorPath) } : {}),
              },
              publisher: {
                "@id": absoluteUrl("/#publisher"),
                "@type": "NewsMediaOrganization",
                name: "Low Voltage Canada",
                url: absoluteUrl("/"),
                logo: {
                  "@type": "ImageObject",
                  url: absoluteUrl("/brand/low-voltage-canada.png"),
                  width: 1254,
                  height: 1254,
                },
              },
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": absoluteUrl(path),
              },
              articleSection: [article.topic, article.kind],
              inLanguage: "en-CA",
              isAccessibleForFree: true,
              ...(article.province
                ? {
                    contentLocation: {
                      "@type": "Place",
                      name: `${article.province}, Canada`,
                    },
                  }
                : {}),
            },
            breadcrumbs([
              { name: "Home", path: "/" },
              { name: "Stories", path: "/stories" },
              { name: article.title, path },
            ]),
          ]}
        />
      )}
      <article>
        <header className="article-header container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/stories">Stories</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{article.title}</span>
          </nav>
          <Link className="back-link" href="/stories">
            <ArrowLeft size={15} /> Back to the stories
          </Link>
          <div className="story-meta">
            <Link
              href={`/stories?kind=${article.kind}`}
              className="category-label"
            >
              {article.kind}
            </Link>
            {topic ? (
              <Link href={`/topics/${topic.slug}`}>{article.topic}</Link>
            ) : (
              <span>{article.topic}</span>
            )}
          </div>
          <h1>{article.title}</h1>
          <p className="article-deck">{article.excerpt}</p>
          <div className="article-byline">
            <div>
              <span className="author-avatar">LV</span>
              <div>
                <strong>
                  {authorPath ? (
                    <Link href={authorPath}>{article.author}</Link>
                  ) : (
                    article.author
                  )}
                </strong>
                <span>
                  {article.isDemo ? (
                    "Sample story · Preview edition"
                  ) : (
                    <time dateTime={article.publishedAt}>
                      {new Date(article.publishedAt).toLocaleDateString(
                        "en-CA",
                        { dateStyle: "long", timeZone: "America/Toronto" },
                      )}
                    </time>
                  )}{" "}
                  <span className="tiny-dot" /> {article.readTime} min read
                </span>
                {article.updatedAt &&
                  article.updatedAt !== article.publishedAt && (
                    <span>
                      Updated{" "}
                      <time dateTime={article.updatedAt}>
                        {new Date(article.updatedAt).toLocaleDateString(
                          "en-CA",
                          { dateStyle: "long", timeZone: "America/Toronto" },
                        )}
                      </time>
                    </span>
                  )}
              </div>
            </div>
            <ShareButton />
          </div>
        </header>
        <figure className="article-figure container">
          <div>
            <Image
              src={article.image}
              alt={article.imageAlt}
              fill
              preload
              sizes="100vw"
            />
          </div>
          <figcaption>
            {article.imageAlt}
            {article.isDemo ? " · Illustrative photography" : ""}
          </figcaption>
        </figure>
        <div className="article-body-wrap">
          {article.isDemo && (
            <aside className="demo-note">
              <span className="signal-dot red-dot" /> PREVIEW EDITION — THIS IS
              A SAMPLE STORY
            </aside>
          )}
          <div className="article-body">
            <PortableText
              value={article.body}
              components={{
                marks: {
                  link: ({ children, value }) => {
                    const href =
                      typeof value?.href === "string" &&
                      /^(https?:\/\/|mailto:|\/)/i.test(value.href)
                        ? value.href
                        : "#";
                    return (
                      <a href={href} rel="noopener noreferrer">
                        {children}
                      </a>
                    );
                  },
                },
              }}
            />
          </div>
          <div className="article-end">
            <span className="end-mark" /> A CANADIAN PERSPECTIVE. A CONNECTED
            INDUSTRY.
          </div>
        </div>
      </article>
      {related.length > 0 && (
        <section className="container related-section">
          <SectionHeading
            number="NEXT"
            title="Keep the signal going"
            link="/stories"
          />
          <div className="story-grid">
            {related.map((item) => (
              <StoryCard key={item.id} article={item} compact />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
