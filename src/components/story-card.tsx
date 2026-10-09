import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { topics, type Article } from "@/lib/types";

export function StoryCard({
  article,
  compact = false,
  eager = false,
}: {
  article: Article;
  compact?: boolean;
  eager?: boolean;
}) {
  const topic = topics.find((item) => item.name === article.topic);
  return (
    <article className={`story-card ${compact ? "story-card-compact" : ""}`}>
      <Link
        href={`/stories/${encodeURIComponent(article.slug)}`}
        className="story-image-link"
        aria-label={article.title}
      >
        <Image
          src={article.image}
          alt={article.imageAlt}
          fill
          loading={eager ? "eager" : "lazy"}
          sizes="(max-width: 680px) 100vw, (max-width: 1000px) 50vw, 33vw"
        />
        <span className="image-arrow">
          <ArrowUpRight size={21} />
        </span>
      </Link>
      <div className="story-card-content">
        <div className="story-meta">
          <Link
            href={`/stories?kind=${article.kind}`}
            className="category-label"
          >
            {article.kind}
          </Link>
          <span>
            {topic ? (
              <Link href={`/topics/${topic.slug}`}>{article.topic}</Link>
            ) : (
              article.topic
            )}
          </span>
        </div>
        <h3>
          <Link href={`/stories/${encodeURIComponent(article.slug)}`}>
            {article.title}
          </Link>
        </h3>
        {!compact && <p>{article.excerpt}</p>}
        <div className="story-byline">
          <span>
            {article.isDemo
              ? "Sample story"
              : new Date(article.publishedAt).toLocaleDateString("en-CA", {
                  month: "short",
                  day: "numeric",
                  timeZone: "America/Toronto",
                })}
          </span>
          <span className="tiny-dot" />
          <span>{article.readTime} min read</span>
        </div>
      </div>
    </article>
  );
}
