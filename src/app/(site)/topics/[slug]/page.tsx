import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StoryCard } from "@/components/story-card";
import { StructuredData } from "@/components/structured-data";
import { absoluteUrl, buildMetadata, siteConfig } from "@/lib/seo";
import { getTopicContent, topicContent } from "@/lib/topic-content";
import { getArticles } from "@/sanity/lib/queries";

export const revalidate = 60;

type TopicPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return topicContent.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({
  params,
}: TopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicContent(slug);
  if (!topic) notFound();
  const articles = await getArticles();
  const hasCoverage = articles.some(
    (article) =>
      article.topic === topic.name && !article.isDemo && !article.noIndex,
  );
  return buildMetadata({
    title: topic.title,
    description: topic.description,
    path: `/topics/${topic.slug}`,
    noIndex: !hasCoverage,
  });
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const topic = getTopicContent(slug);
  if (!topic) notFound();
  const articles = (await getArticles()).filter(
    (article) => article.topic === topic.name,
  );
  const indexableArticles = articles.filter(
    (article) => !article.isDemo && !article.noIndex,
  );
  const url = absoluteUrl(`/topics/${topic.slug}`);

  return (
    <main id="main" className="container directory-main">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": `${url}#webpage`,
              url,
              name: topic.title,
              description: topic.description,
              inLanguage: "en-CA",
              isPartOf: { "@id": absoluteUrl("/#website") },
              breadcrumb: { "@id": `${url}#breadcrumb` },
              about: { "@type": "Thing", name: topic.name },
              spatialCoverage: { "@type": "Country", name: "Canada" },
              ...(indexableArticles.length
                ? {
                    mainEntity: {
                      "@type": "ItemList",
                      itemListElement: indexableArticles.map(
                        (article, index) => ({
                          "@type": "ListItem",
                          position: index + 1,
                          item: {
                            "@type": "WebPage",
                            name: article.title,
                            url: absoluteUrl(
                              `/stories/${encodeURIComponent(article.slug)}`,
                            ),
                          },
                        }),
                      ),
                    },
                  }
                : {}),
            },
            {
              "@type": "BreadcrumbList",
              "@id": `${url}#breadcrumb`,
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: siteConfig.name,
                  item: absoluteUrl("/"),
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: topic.name,
                  item: url,
                },
              ],
            },
          ],
        }}
      />
      <nav className="back-link" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{topic.name}</span>
      </nav>
      <div className="page-kicker">
        <span className="signal-dot red-dot" /> CANADIAN INDUSTRY COVERAGE
      </div>
      <div className="directory-intro">
        <h1>{topic.title}</h1>
        <p>{topic.description}</p>
      </div>
      <p className="about-intro">{topic.introduction}</p>
      <nav className="filter-group" aria-label="Industry sectors">
        <span className="filter-label">YOUR SECTOR</span>
        <div className="filter-links">
          {topicContent.map((sector) => (
            <Link
              key={sector.slug}
              className={sector.slug === topic.slug ? "filter-active" : ""}
              aria-current={sector.slug === topic.slug ? "page" : undefined}
              href={`/topics/${sector.slug}`}
            >
              {sector.name}
            </Link>
          ))}
        </div>
      </nav>
      <section className="latest-section" aria-labelledby="topic-stories-title">
        <div className="section-heading">
          <div>
            <h2 id="topic-stories-title">Latest {topic.name} stories</h2>
          </div>
          <Link className="text-link" href="/stories">
            Explore all stories
          </Link>
        </div>
        <div className="results-label">
          {articles.length} {articles.length === 1 ? "STORY" : "STORIES"}
          {articles.some((article) => article.isDemo) && (
            <span>PREVIEW EDITION · SAMPLE CONTENT</span>
          )}
        </div>
        {articles.length ? (
          <div className="story-grid directory-grid">
            {articles.map((article, index) => (
              <StoryCard key={article.id} article={article} eager={index < 3} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>Our {topic.name} coverage is taking shape.</h3>
            <p>Published stories in this sector will appear here.</p>
            <Link className="button button-dark" href="/stories">
              Explore all stories
            </Link>
          </div>
        )}
      </section>
      <div className="about-columns">
        <section>
          <span className="eyebrow">THE COVERAGE</span>
          <h2>What this sector covers</h2>
          <p>{topic.scope}</p>
        </section>
        <section>
          <span className="eyebrow">THE PERSPECTIVE</span>
          <h2>A Canadian industry lens</h2>
          <p>{topic.perspective}</p>
        </section>
      </div>
    </main>
  );
}
