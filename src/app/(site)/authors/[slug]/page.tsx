import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthor } from "@/sanity/lib/queries";
import { StoryCard } from "@/components/story-card";
import { SectionHeading } from "@/components/section-heading";
import { StructuredData } from "@/components/structured-data";
import { absoluteUrl, breadcrumbs, buildMetadata, siteConfig } from "@/lib/seo";
import { decodeRouteSlug } from "@/lib/route-slug";

type AuthorPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthor(slug);
  if (!author) notFound();
  const biography = author.bio?.trim();
  return buildMetadata({
    title: `${author.name} — Contributor`,
    description:
      biography?.replace(/\s+/g, " ").slice(0, 180) ||
      `Read ${author.name}'s reporting on Canada's AV, security, networking and smart-building industries for ${siteConfig.name}.`,
    path: `/authors/${encodeURIComponent(author.slug)}`,
    noIndex:
      !biography ||
      !author.articles.some((article) => !article.noIndex && !article.isDemo),
  });
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = await getAuthor(decodeRouteSlug(slug));
  if (!author) notFound();
  const path = `/authors/${encodeURIComponent(author.slug)}`;
  const biography = author.bio?.trim();
  const profile = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": absoluteUrl(path),
    url: absoluteUrl(path),
    name: `${author.name} — ${siteConfig.name}`,
    inLanguage: "en-CA",
    mainEntity: {
      "@type": author.name === siteConfig.name ? "Organization" : "Person",
      "@id": absoluteUrl(`${path}#author`),
      name: author.name,
      url: absoluteUrl(path),
      ...(biography ? { description: biography } : {}),
      ...(author.role && author.name !== siteConfig.name
        ? { jobTitle: author.role }
        : {}),
      ...(author.image ? { image: author.image } : {}),
    },
  };

  return (
    <main id="main" className="container directory-main">
      <StructuredData
        data={[
          profile,
          breadcrumbs([
            { name: "Home", path: "/" },
            { name: author.name, path },
          ]),
        ]}
      />
      <nav aria-label="Breadcrumb" className="back-link">
        <Link href="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{author.name}</span>
      </nav>
      <div className="page-kicker">OUR CONTRIBUTORS</div>
      <div className="directory-intro">
        <h1>{author.name}</h1>
        {author.role && <p>{author.role}</p>}
      </div>
      {author.image && (
        <Image
          src={author.image}
          alt={author.imageAlt || author.name}
          width={160}
          height={160}
          sizes="160px"
          style={{ borderRadius: "50%", objectFit: "cover" }}
        />
      )}
      {biography && (
        <section aria-label={`About ${author.name}`} className="about-intro">
          {biography.split(/\n\s*\n/).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </section>
      )}
      <SectionHeading number="BY" title={`Stories by ${author.name}`} />
      {author.articles.length ? (
        <div className="story-grid directory-grid">
          {author.articles.map((article) => (
            <StoryCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>Published reporting from this contributor will appear here.</p>
          <Link href="/stories" className="button button-dark">
            Explore all stories
          </Link>
        </div>
      )}
    </main>
  );
}
