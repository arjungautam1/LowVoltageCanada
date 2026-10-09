import Link from "next/link";
import { Studio } from "@/sanity/components/studio";
import { isSanityConfigured } from "@/sanity/env";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (isSanityConfigured) return <Studio />;

  return (
    <main
      style={{
        minHeight: "100svh",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr)",
        placeItems: "center",
        padding: "32px",
        background: "#f5f3ee",
        color: "#171916",
      }}
    >
      <div
        style={{
          width: "100%",
          minWidth: 0,
          maxWidth: "560px",
          background: "#fff",
          border: "1px solid #deddd7",
          borderTop: "4px solid #d7262c",
          padding: "40px",
        }}
      >
        <p
          style={{
            fontSize: "0.875rem",
            fontWeight: 700,
            letterSpacing: ".12em",
            color: "#d7262c",
            textTransform: "uppercase",
            marginBottom: "18px",
          }}
        >
          Low Voltage Canada / Editorial Studio
        </p>
        <h1
          style={{
            fontSize: "32px",
            lineHeight: 1.1,
            margin: "0 0 18px",
            letterSpacing: "-.04em",
          }}
        >
          Your newsroom is ready to connect.
        </h1>
        <p style={{ lineHeight: 1.6, color: "#55584f" }}>
          Add your existing Sanity project ID and dataset to{" "}
          <code>.env.local</code>, then restart the development server. The site
          currently shows clearly labelled sample stories.
        </p>
        <pre
          style={{
            padding: "18px",
            background: "#f5f3ee",
            overflowX: "auto",
            fontSize: "0.875rem",
            lineHeight: 1.8,
            margin: "24px 0",
          }}
        >
          NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id{"\n"}
          NEXT_PUBLIC_SANITY_DATASET=production
        </pre>
        <p style={{ lineHeight: 1.6, color: "#55584f" }}>
          The connection guide is in <code>README-sanity.md</code>. No API token
          is needed to read published content from a public dataset.
        </p>
        <Link
          href="/"
          style={{
            color: "#d7262c",
            fontWeight: 700,
            display: "inline-block",
            marginTop: "18px",
          }}
        >
          ← Back to Low Voltage Canada
        </Link>
      </div>
    </main>
  );
}
