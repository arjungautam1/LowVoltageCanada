import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  CircuitBoard,
  Radio,
  ShieldCheck,
} from "lucide-react";
import { getArticles } from "@/sanity/lib/queries";
import { StoryCard } from "@/components/story-card";
import { SectionHeading } from "@/components/section-heading";
import { MapleMark } from "@/components/brand";
import { topics } from "@/lib/types";
import { absoluteUrl, buildMetadata, siteConfig } from "@/lib/seo";
import { StructuredData } from "@/components/structured-data";

export const metadata = buildMetadata({
  title: "Canadian Low-Voltage Industry News",
  description: siteConfig.description,
  path: "/",
});

export default async function HomePage() {
  const articles = await getArticles();
  const lead = articles.find((article) => article.featured) ?? articles[0];
  const remaining = articles.filter((article) => article.id !== lead?.id);
  const dispatches = remaining.slice(0, 3);
  const latest = remaining.slice(3, 6).length
    ? remaining.slice(3, 6)
    : remaining.slice(0, 3);
  const people = articles.find((article) => article.kind === "People");
  const topicIcons = [AudioLines, ShieldCheck, Radio, CircuitBoard];
  return (
    <main id="main" className="home-main">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "NewsMediaOrganization",
              "@id": absoluteUrl("/#publisher"),
              name: siteConfig.name,
              alternateName: "LVC",
              url: absoluteUrl("/"),
              logo: {
                "@type": "ImageObject",
                url: absoluteUrl("/brand/low-voltage-canada.png"),
                width: 1254,
                height: 1254,
              },
              description: siteConfig.description,
              areaServed: { "@type": "Country", name: "Canada" },
              publishingPrinciples: absoluteUrl("/about#editorial"),
            },
            {
              "@type": "WebSite",
              "@id": absoluteUrl("/#website"),
              name: siteConfig.name,
              alternateName: "LVC",
              url: absoluteUrl("/"),
              inLanguage: "en-CA",
              publisher: { "@id": absoluteUrl("/#publisher") },
            },
          ],
        }}
      />
      <div className="container">
        <div className="edition-row">
          <span>
            <span className="signal-dot red-dot" /> A CANADIAN PERSPECTIVE
          </span>
          <span>
            {articles.some((article) => article.isDemo)
              ? "PREVIEW EDITION · SAMPLE STORIES"
              : "THE INDEPENDENT INDUSTRY PUBLICATION"}
          </span>
        </div>
        <div className="home-intro">
          <h1>
            Canada, <span>connected.</span>
          </h1>
          <p>
            Canadian news and perspectives on AV, security, networking, and
            smart buildings.
          </p>
        </div>
        {lead ? (
          <section className="lead-grid" aria-label="Top stories">
            <Link
              href={`/stories/${encodeURIComponent(lead.slug)}`}
              className="hero-story"
            >
              <Image
                src={lead.image}
                alt={lead.imageAlt}
                fill
                preload
                sizes="(max-width: 900px) 100vw, 70vw"
              />
              <div className="hero-overlay" />
              <div className="hero-topline">
                <span className="hero-badge">THE BIG PICTURE</span>
                <span className="hero-location">
                  <span className="signal-dot" /> {lead.province || "CANADA"}
                </span>
              </div>
              <div className="hero-content">
                <div className="hero-category">
                  {lead.topic} <span>/</span> {lead.kind}
                </div>
                <h2>{lead.title}</h2>
                <p>{lead.excerpt}</p>
                <div className="hero-bottom">
                  <span>
                    {lead.isDemo ? "Sample story" : lead.author}{" "}
                    <span className="tiny-dot" /> {lead.readTime} min read
                  </span>
                  <span className="hero-read">
                    Read the story <ArrowUpRight size={20} />
                  </span>
                </div>
              </div>
            </Link>
            <aside className="dispatch-panel">
              <div className="dispatch-heading">
                <h2>On the wire</h2>
                <span className="live-dot" />
              </div>
              <p className="dispatch-subtitle">Your industry, in focus.</p>
              <div className="dispatch-list">
                {dispatches.map((article, index) => (
                  <article key={article.id} className="dispatch-item">
                    <div className="dispatch-number">0{index + 1}</div>
                    <div>
                      <span className="category-label">{article.kind}</span>
                      <h3>
                        <Link
                          href={`/stories/${encodeURIComponent(article.slug)}`}
                        >
                          {article.title}
                        </Link>
                      </h3>
                      <span className="dispatch-readtime">
                        {article.readTime} MIN READ <ArrowUpRight size={13} />
                      </span>
                    </div>
                    <Link
                      href={`/stories/${encodeURIComponent(article.slug)}`}
                      className="dispatch-image"
                      aria-label={article.title}
                    >
                      <Image
                        src={article.image}
                        alt={article.imageAlt}
                        fill
                        sizes="90px"
                      />
                    </Link>
                  </article>
                ))}
              </div>
              <Link className="dispatch-all" href="/stories">
                Catch up on all stories <ArrowRight size={17} />
              </Link>
            </aside>
          </section>
        ) : (
          <div className="empty-state">
            <h2>The next story starts here.</h2>
            <p>
              Our coverage is on its way. Check back for the latest from
              Canada’s connected industry.
            </p>
          </div>
        )}
        <div className="radar-strip">
          <span className="eyebrow">
            <span className="radar-icon" /> ON OUR RADAR
          </span>
          <div>
            {topics.map((topic) => (
              <Link key={topic.slug} href={`/topics/${topic.slug}`}>
                {topic.name} <ArrowUpRight size={12} />
              </Link>
            ))}
          </div>
        </div>
        {latest.length > 0 && (
          <section className="latest-section">
            <SectionHeading
              number="01"
              title="In the spotlight"
              link="/stories"
            />
            <div className="story-grid">
              {latest.map((article) => (
                <StoryCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}
        {people && (
          <section className="people-feature">
            <div className="people-image">
              <Image
                src={people.image}
                alt={people.imageAlt}
                fill
                sizes="(max-width: 680px) 100vw, 50vw"
              />
              <span className="image-caption">
                THE HUMAN SIDE OF TECHNOLOGY
              </span>
            </div>
            <div className="people-content">
              <span className="eyebrow">
                <span className="signal-dot red-dot" /> PEOPLE & PERSPECTIVES
              </span>
              <h2>
                Great technology.
                <br />
                <span>Even better people.</span>
              </h2>
              <p>
                Behind every system is someone with a vision. Meet the minds
                making connections that matter.
              </p>
              <Link
                href={`/stories/${encodeURIComponent(people.slug)}`}
                className="button button-dark"
              >
                Meet the people behind it <ArrowUpRight size={17} />
              </Link>
              <div className="people-footnote">
                LOCAL EXPERTISE. NATIONAL IMPACT.
              </div>
            </div>
          </section>
        )}
        <section className="coverage-section">
          <SectionHeading number="02" title="Every angle. One industry." />
          <div className="coverage-grid">
            {topics.map((topic, index) => {
              const Icon = topicIcons[index];
              return (
                <Link
                  key={topic.slug}
                  href={`/topics/${topic.slug}`}
                  className="coverage-card"
                >
                  <div className="coverage-card-top">
                    <Icon size={25} strokeWidth={1.4} />
                    <ArrowUpRight size={21} />
                  </div>
                  <h3>{topic.name}</h3>
                  <p>{topic.description}</p>
                  <span className="coverage-card-index">
                    0{index + 1} / EXPLORE THE SECTOR
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
        <section className="manifesto-band">
          <MapleMark />
          <div>
            <span className="eyebrow">ROOTED HERE. LOOKING AHEAD.</span>
            <h2>
              Less noise. <span>More signal.</span>
            </h2>
            <p>
              Independent stories. Meaningful connections. A distinctly Canadian
              point of view.
            </p>
          </div>
          <Link href="/about" className="button button-white">
            Meet Low Voltage Canada <ArrowUpRight size={18} />
          </Link>
        </section>
      </div>
    </main>
  );
}
