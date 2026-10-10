"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { communityLinks } from "@/lib/publication";
import { siteConfig } from "@/lib/seo";
import { SponsorshipModal } from "./sponsorship-modal";
import styles from "./sponsorship-section.module.css";

const emailLink = (subject: string) =>
  `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}`;

export function SponsorshipSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("Bronze Sponsor");

  return (
    <section
      id="sponsor"
      className={styles.section}
      aria-labelledby="sponsorship-heading"
    >
      <div className={styles.inner}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>BUILD WITH US</p>
          <h2 id="sponsorship-heading">Support Low Voltage Canada.</h2>
          <p className={styles.description}>
            We’re just getting started. Help grow a publication that puts
            Canada’s low voltage people, projects, and ideas in the spotlight.
          </p>
        </div>

        <div className={styles.cards}>
          <article className={styles.card}>
            <h3>Bronze Sponsor</h3>
            <p className={styles.price}>Contact for pricing</p>
            <p>
              Support the publication as it grows. Let’s discuss logo
              recognition, a link to your company, and agreed sponsor
              placements.
            </p>
            <button
              type="button"
              className={styles.cardLink}
              onClick={() => {
                setSelectedPlan("Bronze Sponsor");
                setModalOpen(true);
              }}
            >
              Become a Bronze Sponsor{" "}
              <ArrowUpRight size={18} aria-hidden="true" />
            </button>
          </article>

          <article className={styles.card}>
            <h3>Publication Partner</h3>
            <p className={styles.price}>Contact for pricing</p>
            <p>
              Have a bigger idea? Explore a collaboration around your products,
              company, projects, or hiring campaign, with a scope built
              together.
            </p>
            <button
              type="button"
              className={styles.cardLink}
              onClick={() => {
                setSelectedPlan("Publication Partner");
                setModalOpen(true);
              }}
            >
              Discuss a partnership{" "}
              <ArrowUpRight size={18} aria-hidden="true" />
            </button>
          </article>
        </div>

        <p className={styles.disclosure}>
          Paid promotions will be clearly identified as sponsored.
        </p>

        <div className={styles.collaborate}>
          <div>
            <h3>Have something to share?</h3>
            <p>
              Send us your projects, products, company spotlight ideas, events,
              or job opportunities. We’d love to hear what you’re working on.
            </p>
          </div>
          <a
            className={styles.emailLink}
            href={emailLink("Collaborate with Low Voltage Canada")}
          >
            {siteConfig.email} <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>

        <nav
          className={styles.community}
          aria-label="Low Voltage Canada community"
        >
          <span>Stay in the loop</span>
          {communityLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label} <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          ))}
        </nav>
      </div>

      <SponsorshipModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        planName={selectedPlan}
        email={siteConfig.email}
      />
    </section>
  );
}
