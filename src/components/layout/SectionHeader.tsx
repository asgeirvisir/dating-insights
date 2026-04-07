import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  className?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  href,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`flex items-end justify-between gap-4 ${className}`}>
      <div>
        <h2 className="font-display text-3xl uppercase tracking-wide text-content-primary sm:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 font-body text-base text-content-muted">
            {subtitle}
          </p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="group flex shrink-0 items-center gap-1 font-heading text-sm font-medium text-content-muted hover:text-brand-purple transition-colors duration-200"
        >
          See all
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
