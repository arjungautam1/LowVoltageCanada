"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Sparkles, X } from "lucide-react";
import styles from "./ai-assistant.module.css";

export function AiAssistant({
  slug,
  inline = false,
  initialQuestion = "",
}: {
  slug?: string;
  inline?: boolean;
  initialQuestion?: string;
}) {
  const [open, setOpen] = useState(inline);
  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<{ title: string; href: string }[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function ask(event: FormEvent) {
    event.preventDefault();
    if (busy || !question.trim()) return;
    setBusy(true);
    setError("");
    setAnswer("");
    setSources([]);
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, slug }),
        signal: AbortSignal.timeout(30_000),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Please try again.");
      setAnswer(data.answer);
      setSources(data.sources);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className={inline ? styles.inline : styles.floating}>
      {!inline && (
        <button
          className={styles.launch}
          aria-expanded={open}
          aria-controls="site-ai-assistant"
          onClick={() => setOpen(!open)}
        >
          <Sparkles size={18} /> {open ? "Close assistant" : "Ask AI"}
        </button>
      )}
      {open && (
        <section
          id={inline ? undefined : "site-ai-assistant"}
          className={styles.panel}
          aria-label={slug ? "AI story assistant" : "AI reading assistant"}
        >
          <div className={styles.heading}>
            <Sparkles size={20} />
            <h2>{slug ? "Explore this story" : "Find your next read"}</h2>
            {!inline && (
              <button
                aria-label="Close assistant"
                onClick={() => setOpen(false)}
              >
                <X size={20} />
              </button>
            )}
          </div>
          <p className={styles.description}>
            {slug
              ? "Get a quick summary or ask about this article."
              : "Ask a question to explore our published coverage."}
          </p>
          <div className={styles.suggestions}>
            {(slug
              ? ["Summarize this story", "What are the key takeaways?"]
              : [
                  "Find stories about technician training",
                  "What security topics are covered?",
                ]
            ).map((prompt) => (
              <button
                key={prompt}
                disabled={busy}
                onClick={() => setQuestion(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
          <form onSubmit={ask}>
            <label
              className={styles.label}
              htmlFor={
                slug ? `ai-${slug}` : inline ? "ai-search" : "ai-question"
              }
            >
              Your question
            </label>
            <textarea
              id={slug ? `ai-${slug}` : inline ? "ai-search" : "ai-question"}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              maxLength={1000}
              rows={3}
              required
              placeholder="What would you like to know?"
              disabled={busy}
            />
            <button
              className="button button-red"
              disabled={busy || !question.trim()}
            >
              {busy ? "Thinking…" : "Ask AI"}
            </button>
          </form>
          <div aria-live="polite" aria-busy={busy}>
            {busy && (
              <p className={styles.description}>Reading the coverage…</p>
            )}
            {error && (
              <p role="alert" className={styles.error}>
                {error} <Link href="/search">Search stories</Link>
              </p>
            )}
            {answer && (
              <>
                <p className={styles.answer}>{answer}</p>
                <details className={styles.sources}>
                  <summary>
                    Editorial context ({sources.length}{" "}
                    {sources.length === 1 ? "story" : "stories"})
                  </summary>
                  {sources.map((source) => (
                    <Link key={source.href} href={source.href}>
                      {source.title}
                    </Link>
                  ))}
                </details>
              </>
            )}
          </div>
          <p className={styles.note}>
            Powered by OpenAI. AI can make mistakes; check the original stories.
            Your question and public story content are sent to OpenAI.
          </p>
        </section>
      )}
    </div>
  );
}
