import { UsersRound } from "lucide-react";
import { communityLinks } from "@/lib/publication";
import styles from "./community-links.module.css";

function LinkedInMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.75H4.98V9.2h2.95v9.55ZM6.46 7.9a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.29 10.85H15.8v-4.64c0-1.1-.02-2.52-1.54-2.52-1.54 0-1.78 1.2-1.78 2.44v4.72H9.53V9.2h2.83v1.3h.04c.39-.74 1.36-1.52 2.79-1.52 2.98 0 3.56 1.96 3.56 4.5v5.27Z" />
    </svg>
  );
}

export function CommunityLinks({
  variant = "header",
}: {
  variant?: "header" | "footer";
}) {
  return (
    <nav
      className={`${styles.links} ${styles[variant]}`}
      aria-label="Low Voltage Canada on LinkedIn"
    >
      {communityLinks.map((link, index) => {
        const accessibleLabel =
          index === 0
            ? "Low Voltage Canada on LinkedIn"
            : "Low Voltage Canada LinkedIn group";
        return (
          <a
            key={link.href}
            className={styles.link}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={variant === "header" ? accessibleLabel : undefined}
            title={accessibleLabel}
          >
            {index === 0 ? (
              <LinkedInMark />
            ) : (
              <UsersRound aria-hidden="true" strokeWidth={1.8} />
            )}
            {variant === "footer" && <span>{link.label}</span>}
          </a>
        );
      })}
    </nav>
  );
}
