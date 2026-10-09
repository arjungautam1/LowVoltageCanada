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
      <MapleMark className="brand-leaf" />
      <span className="brand-type">
        <span>LOW VOLTAGE</span>
        <span className="brand-country">
          CANADA
          <span className="brand-rule" />
        </span>
      </span>
    </Link>
  );
}
