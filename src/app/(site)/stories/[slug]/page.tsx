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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Story not found" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      images: [{ url: article.image, alt: article.imageAlt }],
    },
    ...(article.isDemo ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();
  const related = (await getArticles())
    .filter((item) => item.id !== article.id)
    .sort(
      (a, b) =>
        Number(b.topic === article.topic) - Number(a.topic === article.topic),
    )
    .slice(0, 3);
  return (
    <main id="main" className="article-main">
      <article>
        <header className="article-header container">
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
            <span>{article.topic}</span>
          </div>
          <h1>{article.title}</h1>
          <p className="article-deck">{article.excerpt}</p>
          <div className="article-byline">
            <div>
              <span className="author-avatar">LV</span>
              <div>
                <strong>{article.author}</strong>
                <span>
                  {article.isDemo
                    ? "Sample story · Preview edition"
                    : new Date(article.publishedAt).toLocaleDateString(
                        "en-CA",
                        { dateStyle: "long", timeZone: "America/Toronto" },
                      )}{" "}
                  <span className="tiny-dot" /> {article.readTime} min read
                </span>
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
