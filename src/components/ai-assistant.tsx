"use client";

import { useSyncExternalStore, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  Sparkles,
  Mail,
  Zap,
  Building2,
  Ticket,
  Briefcase,
  CheckCircle2,
  Lock,
  ArrowRight,
} from "lucide-react";
import { sendInquiry } from "@/lib/send-inquiry";
import styles from "./ai-assistant.module.css";

const MAX_FREE_QUERIES = 3;
const STORAGE_USAGE_KEY = "lvc_ai_queries_used";
const STORAGE_SUBSCRIBER_KEY = "lvc_ai_subscriber";

function subscribeStorage(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("lvc_storage_change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("lvc_storage_change", callback);
  };
}

function notifyStorageChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("lvc_storage_change"));
  }
}

function getUsageSnapshot(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(STORAGE_USAGE_KEY);
    const count = parseInt(raw || "0", 10);
    return isNaN(count) ? 0 : count;
  } catch {
    return 0;
  }
}

function getSubscribedSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(STORAGE_SUBSCRIBER_KEY);
    return raw === "active" || raw === "pending";
  } catch {
    return false;
  }
}

export function AiAssistant({
  slug,
  initialQuestion = "",
}: {
  slug?: string;
  inline?: boolean;
  initialQuestion?: string;
}) {
  const queriesUsed = useSyncExternalStore(
    subscribeStorage,
    getUsageSnapshot,
    () => 0,
  );

  const isSubscribed = useSyncExternalStore(
    subscribeStorage,
    getSubscribedSnapshot,
    () => false,
  );

  const remainingQueries = isSubscribed
    ? Infinity
    : Math.max(0, MAX_FREE_QUERIES - queriesUsed);

  const [userSelectedTab, setUserSelectedTab] = useState<
    "ask" | "subscribe" | null
  >(null);

  const activeTab =
    userSelectedTab ??
    (!isSubscribed && remainingQueries <= 0 ? "subscribe" : "ask");

  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<{ title: string; href: string }[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Subscription form state
  const [subName, setSubName] = useState("");
  const [subEmail, setSubEmail] = useState("");
  const [subCompany, setSubCompany] = useState("");
  const [subPlan, setSubPlan] = useState("Monthly Membership ($19/mo)");
  const [submittingSub, setSubmittingSub] = useState(false);
  const [subSuccess, setSubSuccess] = useState(false);
  const [subError, setSubError] = useState("");

  async function handleAsk(event: FormEvent) {
    event.preventDefault();
    if (busy || !question.trim()) return;

    if (!isSubscribed && remainingQueries <= 0) {
      setUserSelectedTab("subscribe");
      return;
    }

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
      setSources(data.sources || []);

      // Record successful query use in localStorage
      if (!isSubscribed) {
        try {
          const current = getUsageSnapshot();
          localStorage.setItem(STORAGE_USAGE_KEY, String(current + 1));
          notifyStorageChange();
        } catch {
          // ignore localStorage error
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSubscribe(event: FormEvent) {
    event.preventDefault();
    if (submittingSub || !subName.trim() || !subEmail.trim()) return;

    setSubmittingSub(true);
    setSubError("");

    try {
      await sendInquiry({
        name: subName.trim(),
        company: subCompany.trim() || "Independent Subscriber",
        email: subEmail.trim(),
        inquiry: `Subscriber Application (${subPlan})`,
        message: `User requested ${subPlan} after using AI Assistant on ${
          slug ? `article: ${slug}` : "the site"
        }. Please send the monthly subscription payment link and newsletter welcome email.`,
      });

      setSubSuccess(true);
      try {
        localStorage.setItem(STORAGE_SUBSCRIBER_KEY, "pending");
        notifyStorageChange();
      } catch {
        // ignore
      }
    } catch (err) {
      setSubError(
        err instanceof Error
          ? err.message
          : "We could not submit your request. Please check your connection and try again.",
      );
    } finally {
      setSubmittingSub(false);
    }
  }

  return (
    <section
      className={styles.container}
      aria-label="Story Assistant and Subscriber Access"
    >
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.brandTitle}>
            <Sparkles size={20} />
            <h2>{slug ? "Explore this story" : "Find your next read"}</h2>
          </div>
          <div
            className={`${styles.quotaBadge} ${
              isSubscribed
                ? styles.quotaActive
                : remainingQueries === 0
                  ? styles.quotaExhausted
                  : remainingQueries === 1
                    ? styles.quotaWarning
                    : styles.quotaActive
            }`}
          >
            {isSubscribed ? (
              <>
                <Sparkles size={13} /> Member Access · Unlimited
              </>
            ) : remainingQueries === 0 ? (
              <>
                <Lock size={13} /> Free Limit Reached (0 left)
              </>
            ) : (
              <>
                <Zap size={13} /> {remainingQueries} of {MAX_FREE_QUERIES} free questions left
              </>
            )}
          </div>
        </div>

        <nav className={styles.tabs} aria-label="Assistant tabs">
          <button
            type="button"
            className={`${styles.tabButton} ${
              activeTab === "ask" ? styles.tabActive : ""
            }`}
            onClick={() => setUserSelectedTab("ask")}
          >
            Ask AI
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${
              activeTab === "subscribe" ? styles.tabActive : ""
            }`}
            onClick={() => setUserSelectedTab("subscribe")}
          >
            Member Perks & Subscribe
          </button>
        </nav>
      </div>

      <div className={styles.contentBody}>
        {activeTab === "ask" ? (
          <div>
            <p className={styles.description}>
              {slug
                ? "Get a quick summary or ask specific questions about this article."
                : "Ask a question to explore our published Canadian coverage."}
            </p>

            <div className={styles.suggestions}>
              {(slug
                ? [
                    "What are the key takeaways?",
                    "Summarize this story",
                    "Which equipment or brands are highlighted?",
                  ]
                : [
                    "Find stories about technician training",
                    "What security topics are covered?",
                    "Latest networking trends in Canada",
                  ]
              ).map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className={styles.suggestionButton}
                  disabled={busy}
                  onClick={() => setQuestion(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form onSubmit={handleAsk}>
              <label
                className={styles.label}
                htmlFor={slug ? `ai-${slug}` : "ai-question"}
              >
                Your question
              </label>
              <textarea
                id={slug ? `ai-${slug}` : "ai-question"}
                className={styles.textarea}
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                maxLength={1000}
                rows={3}
                required
                placeholder={
                  remainingQueries === 0 && !isSubscribed
                    ? "Free preview limit reached. Switch to 'Member Perks & Subscribe' to unlock unlimited access."
                    : "What would you like to know?"
                }
                disabled={busy || (remainingQueries === 0 && !isSubscribed)}
              />

              <div className={styles.formActions}>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={
                    busy ||
                    !question.trim() ||
                    (remainingQueries === 0 && !isSubscribed)
                  }
                >
                  {busy ? "Thinking…" : "Ask AI"}
                </button>

                {!isSubscribed && (
                  <button
                    type="button"
                    className={styles.upgradePromptLink}
                    onClick={() => setUserSelectedTab("subscribe")}
                  >
                    {remainingQueries === 0
                      ? "Limit reached — View subscription perks →"
                      : "Want unlimited questions? View member perks →"}
                  </button>
                )}
              </div>
            </form>

            <div aria-live="polite" aria-busy={busy}>
              {busy && (
                <p className={styles.description}>Reading the coverage…</p>
              )}
              {error && (
                <div role="alert" className={styles.errorBox}>
                  {error} <Link href="/search">Search stories</Link>
                </div>
              )}
              {answer && (
                <div className={styles.answerBox}>
                  <p className={styles.answerText}>{answer}</p>
                  {sources.length > 0 && (
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
                  )}
                </div>
              )}
            </div>

            <p className={styles.note}>
              Powered by OpenAI. AI can make mistakes; check original sources.
              Questions and story references are sent to OpenAI.
            </p>
          </div>
        ) : (
          <div>
            {!isSubscribed && remainingQueries === 0 && (
              <div className={styles.perksBanner}>
                <Lock size={20} className={styles.perksBannerTitle} />
                <div>
                  <h3 className={styles.perksBannerTitle}>
                    Free Preview Limit Reached (3 of 3 used)
                  </h3>
                  <p className={styles.perksBannerText}>
                    You’ve used your 3 free questions! Subscribe below to unlock
                    unlimited AI research access and receive full membership perks.
                  </p>
                </div>
              </div>
            )}

            <p className={styles.description}>
              Low Voltage Canada is Canada’s independent newsroom for network
              infrastructure, electronic security, AV, and smart building
              technologies. Subscribing gives you unlimited tools and direct industry
              briefings.
            </p>

            <div className={styles.perksGrid}>
              <div className={styles.perkItem}>
                <div className={styles.perkIcon}>
                  <Mail size={18} />
                </div>
                <div>
                  <h4 className={styles.perkTitle}>Weekly Newsletter Briefing</h4>
                  <p className={styles.perkText}>
                    Curated executive summary of product launches, mergers, code
                    updates, and Canadian project stories every Monday.
                  </p>
                </div>
              </div>

              <div className={styles.perkItem}>
                <div className={styles.perkIcon}>
                  <Zap size={18} />
                </div>
                <div>
                  <h4 className={styles.perkTitle}>Unlimited AI Research</h4>
                  <p className={styles.perkText}>
                    Zero question caps. Query technical specs, ask for comparisons,
                    and extract takeaways from all published articles.
                  </p>
                </div>
              </div>

              <div className={styles.perkItem}>
                <div className={styles.perkIcon}>
                  <Building2 size={18} />
                </div>
                <div>
                  <h4 className={styles.perkTitle}>Integrator & Vendor Network</h4>
                  <p className={styles.perkText}>
                    Access Canadian manufacturers, distributors, and certified
                    integrators by province and discipline.
                  </p>
                </div>
              </div>

              <div className={styles.perkItem}>
                <div className={styles.perkIcon}>
                  <Ticket size={18} />
                </div>
                <div>
                  <h4 className={styles.perkTitle}>Event Passes & Discounts</h4>
                  <p className={styles.perkText}>
                    Discount codes and VIP invitations to CANASA expos, Security
                    Canada Central, and vendor training sessions.
                  </p>
                </div>
              </div>

              <div className={styles.perkItem}>
                <div className={styles.perkIcon}>
                  <Briefcase size={18} />
                </div>
                <div>
                  <h4 className={styles.perkTitle}>Job Board & Project RFP Leads</h4>
                  <p className={styles.perkText}>
                    First look at open technician roles, commercial RFP tenders,
                    and subcontracting opportunities.
                  </p>
                </div>
              </div>
            </div>

            {subSuccess ? (
              <div className={styles.successBox}>
                <CheckCircle2 size={36} className={styles.successIcon} />
                <h3 className={styles.successTitle}>Subscription Request Received!</h3>
                <p className={styles.successText}>
                  Thank you, <strong>{subName}</strong>. We have registered your
                  email (<strong>{subEmail}</strong>). We will send your newsletter
                  briefing right away, and follow up shortly with your direct link
                  to set up your monthly subscription.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className={styles.subscriptionForm}>
                <h3 className={styles.perkTitle} style={{ marginBottom: "14px" }}>
                  Join the Subscriber Community
                </h3>

                <div className={styles.formGrid}>
                  <div className={styles.inputField}>
                    <label htmlFor="sub-name">Full Name *</label>
                    <input
                      id="sub-name"
                      type="text"
                      required
                      placeholder="e.g. David Miller"
                      value={subName}
                      onChange={(e) => setSubName(e.target.value)}
                      disabled={submittingSub}
                    />
                  </div>

                  <div className={styles.inputField}>
                    <label htmlFor="sub-email">Email Address *</label>
                    <input
                      id="sub-email"
                      type="email"
                      required
                      placeholder="e.g. name@company.ca"
                      value={subEmail}
                      onChange={(e) => setSubEmail(e.target.value)}
                      disabled={submittingSub}
                    />
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.inputField}>
                    <label htmlFor="sub-company">Company / Integrator</label>
                    <input
                      id="sub-company"
                      type="text"
                      placeholder="e.g. Apex Security Inc."
                      value={subCompany}
                      onChange={(e) => setSubCompany(e.target.value)}
                      disabled={submittingSub}
                    />
                  </div>

                  <div className={styles.inputField}>
                    <label htmlFor="sub-plan">Desired Membership</label>
                    <select
                      id="sub-plan"
                      value={subPlan}
                      onChange={(e) => setSubPlan(e.target.value)}
                      disabled={submittingSub}
                    >
                      <option value="Monthly Membership ($19/mo)">
                        Monthly Membership ($19/mo)
                      </option>
                      <option value="Annual Membership ($190/yr - Save 17%)">
                        Annual Membership ($190/yr - Save 17%)
                      </option>
                    </select>
                  </div>
                </div>

                {subError && (
                  <div className={styles.errorBox} style={{ marginBottom: "14px" }}>
                    {subError}
                  </div>
                )}

                <button
                  type="submit"
                  className={styles.subscribeButton}
                  disabled={submittingSub || !subName.trim() || !subEmail.trim()}
                >
                  {submittingSub ? (
                    "Sending Request…"
                  ) : (
                    <>
                      Subscribe & Receive Payment Link <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <p className={styles.subscribeSubtext}>
                  No payment required today. We will verify your email and send you
                  the direct link to finalize your monthly subscription.
                </p>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
