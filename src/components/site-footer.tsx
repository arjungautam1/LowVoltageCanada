import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Brand, MapleMark } from "./brand";
import { topics } from "@/lib/types";
import { siteConfig } from "@/lib/seo";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Brand inverse />
            <p>
              A sharper signal for a connected Canada.
              <br />
              The industry. The people. What’s next.
            </p>
          </div>
          <div className="footer-links">
            <div>
              <span className="eyebrow">THE COVERAGE</span>
              {topics.map((topic) => (
                <Link key={topic.slug} href={`/topics/${topic.slug}`}>
                  {topic.name}
                </Link>
              ))}
            </div>
            <div>
              <span className="eyebrow">THE PUBLICATION</span>
              <Link href="/about">About Low Voltage Canada</Link>
              <Link href="/about#editorial">Our editorial approach</Link>
              <Link href="/stories">
                All stories <ArrowUpRight size={13} />
              </Link>
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              <a href="/feed.xml">RSS feed</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Low Voltage Canada</span>
          <span className="made-in-canada">
            <MapleMark /> CANADIAN BY PERSPECTIVE.
          </span>
          <span>Built for what’s next.</span>
        </div>
      </div>
    </footer>
  );
}
