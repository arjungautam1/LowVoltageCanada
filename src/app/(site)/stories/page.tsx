import Link from "next/link";
import { getArticles } from "@/sanity/lib/queries";
import { StoryCard } from "@/components/story-card";
import { storyKinds, topics } from "@/lib/types";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = await searchParams;
  const kind = storyKinds.find((item) => item === filters.kind);
  const topic = topics.find((item) => item.slug === filters.topic);
  const canonical = topic && !kind ? `/topics/${topic.slug}` : "/stories";
  return buildMetadata({
    title: topic
      ? `${topic.name} News in Canada`
      : kind
        ? `${kind} in Canada's Low-Voltage Industry`
        : "Latest Canadian Industry Stories",
    description:
      "Browse Canadian AV, security, networking and smart-building coverage, from product news and people to integrators, companies and events.",
    path: canonical,
    noIndex: Object.keys(filters).length > 0,
  });
}

export default async function StoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string; topic?: string }>;
}) {
  const { kind, topic } = await searchParams;
  const activeKind = storyKinds.find((item) => item === kind);
  const activeTopic = topics.find((item) => item.slug === topic);
  const articles = (await getArticles()).filter(
    (article) =>
      (!activeKind || article.kind === activeKind) &&
      (!activeTopic || article.topic === activeTopic.name),
  );
  const filterHref = (nextKind?: string, nextTopic?: string) => {
    const query = new URLSearchParams();
    if (nextKind) query.set("kind", nextKind);
    if (nextTopic) query.set("topic", nextTopic);
    return `/stories${query.size ? `?${query}` : ""}`;
  };
  return (
    <main id="main" className="container directory-main stories-directory">
      <div className="page-kicker">
        <span className="signal-dot red-dot" /> THE LVC EDIT
      </div>
      <div className="directory-intro">
        <h1>{activeTopic?.name ?? activeKind ?? "The stories."}</h1>
        <p>
          {activeTopic?.description ??
            "The products, perspectives, and possibilities shaping Canada's connected industry."}
        </p>
      </div>
      <div className="filter-group">
        <span className="filter-label">STORY TYPE</span>
        <div className="filter-links">
          <Link
            className={!activeKind ? "filter-active" : ""}
            href={filterHref(undefined, activeTopic?.slug)}
          >
            All stories
          </Link>
          {storyKinds.map((item) => (
            <Link
              key={item}
              className={activeKind === item ? "filter-active" : ""}
              href={filterHref(item, activeTopic?.slug)}
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
      <div className="filter-group topic-filter">
        <span className="filter-label">YOUR SECTOR</span>
        <div className="filter-links">
          <Link
            className={!activeTopic ? "filter-active" : ""}
            href={filterHref(activeKind)}
          >
            All sectors
          </Link>
          {topics.map((item) => (
            <Link
              key={item.slug}
              className={activeTopic?.slug === item.slug ? "filter-active" : ""}
              href={filterHref(activeKind, item.slug)}
            >
              {item.name}
            </Link>
          ))}
        </div>
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
          <h2>A fresh perspective is on its way.</h2>
          <p>There are no stories in this combination yet.</p>
          <Link className="button button-dark" href="/stories">
            Explore all stories
          </Link>
        </div>
      )}
    </main>
  );
}
