import Link from "next/link";

export function MapleMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 44"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="m20 0 5 12 5-3-1 10 9-3-3 9 5 3-15 10 1 6h-5l1-6L0 28l5-3-3-9 9 3-1-10 5 3L20 0Z" />
    </svg>
  );
}

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link
      href="/"
      className={`brand ${inverse ? "brand-inverse" : ""}`}
      aria-label="Low Voltage Canada homepage"
    >
      {inverse ? (
        <svg
          className="brand-logo brand-logo-full"
          viewBox="70 200 1120 800"
          aria-hidden="true"
        >
          <image
            href="/brand/low-voltage-canada.png"
            width="1254"
            height="1254"
          />
        </svg>
      ) : (
        <svg className="brand-logo" viewBox="0 0 306 64" aria-hidden="true">
          <svg
            x="0"
            y="2.5"
            width="72"
            height="59"
            viewBox="320 210 720 590"
            overflow="hidden"
          >
            <image
              href="/brand/low-voltage-canada.png"
              width="1254"
              height="1254"
            />
          </svg>
          <svg
            x="78"
            y="16"
            width="228"
            height="40"
            viewBox="70 810 1120 180"
            overflow="hidden"
          >
            <image
              href="/brand/low-voltage-canada.png"
              width="1254"
              height="1254"
            />
          </svg>
        </svg>
      )}
    </Link>
  );
}
