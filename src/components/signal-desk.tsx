"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Bookmark,
  Check,
  Clock3,
  Radio,
  Sparkles,
} from "lucide-react";
import { topics, type Article } from "@/lib/types";
import styles from "./signal-desk.module.css";

type DeskStory = Pick<
  Article,
  | "id"
  | "slug"
  | "title"
  | "excerpt"
  | "topic"
  | "readTime"
  | "publishedAt"
  | "isDemo"
>;
const storageKey = "lvc-reading-list-v1";
function snapshot() {
  try {
    return localStorage.getItem(storageKey) || "[]";
  } catch {
    return "[]";
  }
}
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("lvc-reading-list", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("lvc-reading-list", callback);
  };
}
function parseSaved(raw: string): string[] {
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value)
      ? value.filter((item) => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

export function SignalDesk({ articles }: { articles: DeskStory[] }) {
  const [filter, setFilter] = useState("All signals");
  const [notice, setNotice] = useState("");
  const saved = parseSaved(
    useSyncExternalStore(subscribe, snapshot, () => "[]"),
  );
  const filtered = articles.filter((article) =>
    filter === "Saved"
      ? saved.includes(article.id)
      : filter === "Quick reads"
        ? article.readTime <= 5
        : filter === "All signals" || article.topic === filter,
  );
  const visible = filtered.slice(0, 4);
  function toggleSaved(article: DeskStory) {
    try {
      const current = parseSaved(snapshot());
      const exists = current.includes(article.id);
      localStorage.setItem(
        storageKey,
        JSON.stringify(
          exists
            ? current.filter((id) => id !== article.id)
            : [...current, article.id],
        ),
      );
      window.dispatchEvent(new Event("lvc-reading-list"));
      setNotice(
        exists
          ? "Story removed from your reading list."
          : "Story saved on this browser.",
      );
    } catch {
      setNotice(
        "Your browser could not save this story. Please enable local storage.",
      );
    }
  }
  return (
    <section className={styles.desk} aria-labelledby="signal-desk-title">
      <aside className={styles.brief}>
        <span className={styles.kicker}>
          <Radio size={16} /> THE SIGNAL DESK
        </span>
        <h2 id="signal-desk-title">
          Your industry.
          <br />
          <span>Your next move.</span>
        </h2>
        <p>
          A little context before your next connection. Find a story for the
          work you do.
        </p>
        <div className={styles.briefStat}>
          <span>{String(articles.length).padStart(2, "0")}</span>
          <div>
            stories to explore
            <br />
            <small>From the LVC editorial desk</small>
          </div>
        </div>
        <Link
          className={styles.aiLink}
          href="/search?q=Give%20me%20a%20briefing%20on%20the%20published%20coverage"
        >
          <Sparkles size={17} />
          <span>
            Ask for an AI briefing
            <small>Explore the coverage in your own words</small>
          </span>
          <ArrowUpRight size={18} />
        </Link>
        <p className={styles.privacy}>
          Your saved list stays in this browser. No account needed.
        </p>
      </aside>
      <div className={styles.feed}>
        <div className={styles.feedHeading}>
          <span className="eyebrow">MAKE TIME FOR WHAT MATTERS</span>
          <Link href="/stories">
            All stories <ArrowUpRight size={15} />
          </Link>
        </div>
        <div
          className={styles.filters}
          role="group"
          aria-label="Filter briefing stories"
        >
          {[
            "All signals",
            ...topics.map((topic) => topic.name),
            "Quick reads",
            "Saved",
          ].map((label) => (
            <button
              key={label}
              aria-pressed={filter === label}
              onClick={() => setFilter(label)}
            >
              {label === "Saved" && <Bookmark size={13} />}
              {label}
              {label === "Saved" && (
                <span>
                  {
                    saved.filter((id) =>
                      articles.some((article) => article.id === id),
                    ).length
                  }
                </span>
              )}
            </button>
          ))}
        </div>
        <div className={styles.rows}>
          {visible.map((article, index) => (
            <article key={article.id} className={styles.row}>
              <span className={styles.number}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <div className={styles.meta}>
                  <span>{article.topic}</span>
                  <span>
                    <Clock3 size={12} /> {article.readTime} min read
                  </span>
                  {article.isDemo && <span>Sample story</span>}
                </div>
                <h3>
                  <Link href={`/stories/${encodeURIComponent(article.slug)}`}>
                    {article.title}
                  </Link>
                </h3>
                <p>{article.excerpt}</p>
              </div>
              <button
                className={styles.save}
                onClick={() => toggleSaved(article)}
                aria-pressed={saved.includes(article.id)}
                aria-label={`${saved.includes(article.id) ? "Unsave" : "Save"} ${article.title}`}
              >
                {saved.includes(article.id) ? (
                  <Check size={18} />
                ) : (
                  <Bookmark size={18} />
                )}
              </button>
            </article>
          ))}
          {!visible.length && (
            <div className={styles.empty}>
              <Bookmark size={25} />
              <h3>
                {filter === "Saved"
                  ? "Keep a good story close."
                  : "More signals are on the way."}
              </h3>
              <p>
                {filter === "Saved"
                  ? "Tap the bookmark beside a story to build your reading list."
                  : "Explore another topic while we add more coverage here."}
              </p>
              <button onClick={() => setFilter("All signals")}>
                Explore all signals <ArrowUpRight size={15} />
              </button>
            </div>
          )}
        </div>
        <div className={styles.status} aria-live="polite">
          {notice ||
            `${filtered.length} ${filtered.length === 1 ? "story" : "stories"}${filtered.length > visible.length ? ` · Showing the first ${visible.length}` : ""} · Selected from our coverage`}
        </div>
      </div>
    </section>
  );
}
