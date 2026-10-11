import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Brand, MapleMark } from "./brand";
import { topics } from "@/lib/types";
import { siteConfig } from "@/lib/seo";
import { CommunityLinks } from "./community-links";

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
            <CommunityLinks variant="footer" />
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
              <Link href="/about#contact">Contact & submissions</Link>
              <Link href="/about#editorial">Our editorial approach</Link>
              <Link href="/stories">
                All stories <ArrowUpRight size={13} />
              </Link>
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              <Link href="/#sponsor">Sponsor the publication</Link>
              <a href="/feed.xml">RSS feed</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Low Voltage Canada</span>
          <span className="made-in-canada">
            <MapleMark /> CANADIAN BY PERSPECTIVE.
          </span>
          <a
            className="footer-venture"
            href="https://www.apdigitalhub.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="An AP Digital Hub venture — visit AP Digital Hub"
          >
            <Image
              src="/brand/ap-digital-hub.svg"
              alt=""
              width={40}
              height={40}
            />
            <span>
              <small>An AP Digital Hub venture</small>
              <strong>AP Digital Hub</strong>
            </span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
