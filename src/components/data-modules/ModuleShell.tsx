import type { ReactNode } from "react";
import Badge from "@/components/ui/Badge";

interface ModuleShellProps {
  title: string;
  source?: string;
  category?: string;
  children: ReactNode;
  className?: string;
}

export default function ModuleShell({
  title,
  source,
  category,
  children,
  className = "",
}: ModuleShellProps) {
  return (
    <div
      className={`gradient-border bg-surface-card rounded-xl p-6 sm:p-8 ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <h3 className="font-heading text-lg font-semibold text-content-primary sm:text-xl">
          {title}
        </h3>
        {category && <Badge variant="purple">{category}</Badge>}
      </div>

      {/* Content */}
      <div>{children}</div>

      {/* Source */}
      {source && (
        <p className="mt-6 pt-4 border-t border-neutral-900 font-body text-xs text-content-muted">
          Source: {source}
        </p>
      )}
    </div>
  );
}
