import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function SectionHeading({
  number,
  title,
  link,
  label = "View all stories",
}: {
  number: string;
  title: string;
  link?: string;
  label?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="section-number">{number}</span>
        <h2>{title}</h2>
      </div>
      {link && (
        <Link className="text-link" href={link}>
          {label} <ArrowUpRight size={16} />
        </Link>
      )}
    </div>
  );
}
