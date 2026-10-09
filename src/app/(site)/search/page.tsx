import type { Metadata } from "next";
import { Search } from "lucide-react";
import { getArticles } from "@/sanity/lib/queries";
import { StoryCard } from "@/components/story-card";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q = "" } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q).trim().slice(0, 200);
  const articles = query
    ? (await getArticles()).filter((article) =>
        `${article.title} ${article.excerpt} ${article.kind} ${article.topic} ${article.author} ${article.province ?? ""}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      )
    : [];
  return (
    <main id="main" className="container directory-main">
      <span className="eyebrow">FIND YOUR SIGNAL</span>
      <div className="directory-intro">
        <h1>Search the stories.</h1>
        <p>A new idea is only a connection away.</p>
      </div>
      <form action="/search">
        <label htmlFor="search-page" className="sr-only">
          Search stories
        </label>
        <div className="search-input-wrap search-page-input">
          <Search size={23} />
          <input
            id="search-page"
            name="q"
            defaultValue={query}
            placeholder="Search stories, people, ideas…"
            required
            maxLength={200}
          />
          <button className="button button-red" type="submit">
            Search
          </button>
        </div>
      </form>
      <div className="results-label">
        {query
          ? `${articles.length} ${articles.length === 1 ? "RESULT" : "RESULTS"} FOR “${query}”`
          : "ENTER A SEARCH TO GET STARTED"}
      </div>
      {articles.length ? (
        <div className="story-grid directory-grid">
          {articles.map((article, index) => (
            <StoryCard key={article.id} article={article} eager={index < 3} />
          ))}
        </div>
      ) : query ? (
        <div className="empty-state">
          <h2>No signal just yet.</h2>
          <p>
            Try a broader search, such as security, networking, or buildings.
          </p>
        </div>
      ) : null}
    </main>
  );
}
