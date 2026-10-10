import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MapleMark } from "@/components/brand";
import { topics } from "@/lib/types";
import { isSanityConfigured } from "@/sanity/env";
import { buildMetadata, siteConfig } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About Our Canadian Industry Publication",
  description:
    "Learn about Low Voltage Canada's coverage of AV, security, networking and smart buildings, and our approach to Canadian industry reporting.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main id="main" className="container about-main">
      <div className="page-kicker">
        <span className="signal-dot red-dot" /> HELLO, WE’RE LOW VOLTAGE CANADA
      </div>
      <div className="about-hero">
        <h1>
          A Canadian lens.
          <br />
          <span>A connected future.</span>
        </h1>
        <MapleMark />
      </div>
      <p className="about-intro">
        Technology connects our spaces. Stories connect our industry. We’re
        building a place for both.
      </p>
      <div className="about-columns">
        <section>
          <h2>
            Rooted in Canada.
            <br />
            Open to what’s next.
          </h2>
          <p>
            Low Voltage Canada is an independent media project dedicated to the
            people and technology shaping Canada’s low voltage industry. From a
            product on the workbench to a project across the country, we look
            for the story that matters.
          </p>
          <p>
            Our focus spans AV and collaboration, security, networking, and
            smart buildings. Our perspective brings manufacturers, integrators,
            consultants, and the wider industry into the same conversation.
          </p>
        </section>
        <section id="editorial">
          <span className="eyebrow">OUR EDITORIAL APPROACH</span>
          <h2>Clarity over noise.</h2>
          <p>
            Useful context. Thoughtful questions. People at the centre. We’re
            building our coverage around product news, company developments,
            integrator projects, individual perspectives, events, and the ideas
            moving the industry forward.
          </p>
          <p>
            {isSanityConfigured
              ? "Our newsroom brings a Canadian perspective to a connected industry, with clear context and thoughtfully attributed reporting."
              : "This is our preview edition. Sample stories show the reading experience and the scope of the publication as we prepare for launch."}
          </p>
        </section>
      </div>
      <section className="about-coverage">
        <h2>Where we’re tuning in.</h2>
        <div>
          {topics.map((topic, index) => (
            <Link key={topic.slug} href={`/topics/${topic.slug}`}>
              <span>0{index + 1}</span>
              <strong>{topic.name}</strong>
              <ArrowUpRight size={24} />
            </Link>
          ))}
        </div>
      </section>
      <section className="contact-section" id="contact">
        <span className="eyebrow">LET’S MAKE CONNECTIONS</span>
        <h2>
          Every good story
          <br />
          starts with a conversation.
        </h2>
        <p>
          Have a product, project, person, or event on your radar? Reach out for
          story submissions, partnerships, or general inquiries.
        </p>
        <a href={`mailto:${siteConfig.email}`} className="button button-red">
          {siteConfig.email}
          <ArrowUpRight size={18} />
        </a>
      </section>
    </main>
  );
}
