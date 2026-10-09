import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="container empty-state error-state">
      <span className="eyebrow">404 / SIGNAL NOT FOUND</span>
      <h1>This connection leads nowhere.</h1>
      <p>The page may have moved. There are more stories to explore.</p>
      <Link href="/" className="button button-red">
        Back to Low Voltage Canada
      </Link>
    </main>
  );
}
