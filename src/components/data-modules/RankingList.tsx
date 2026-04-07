"use client";

import type { RankingData } from "@/types/modules";
import ModuleShell from "./ModuleShell";

type RankingListProps = RankingData;

export default function RankingList({
  title,
  subtitle,
  category,
  items,
  source,
}: RankingListProps) {
  const sorted = [...items].sort((a, b) => a.rank - b.rank);
  const topThree = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  return (
    <ModuleShell title={title} category={category} source={source}>
      {subtitle && (
        <p className="mb-6 font-body text-sm text-content-muted">{subtitle}</p>
      )}

      {/* Top 3 */}
      <div className="space-y-3 mb-4">
        {topThree.map((item) => (
          <div
            key={item.rank}
            className="group flex items-center gap-4 rounded-lg bg-surface-elevated p-4 transition-all duration-200 hover:bg-surface-elevated/80 cursor-pointer"
          >
            {/* Rank number */}
            <span className="shrink-0 font-display text-4xl leading-none gradient-text sm:text-5xl">
              {item.rank}
            </span>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <h4 className="font-heading text-base font-semibold text-content-primary sm:text-lg">
                  {item.name}
                </h4>
                <span className="shrink-0 font-heading text-sm font-bold gradient-text-data">
                  {item.value}
                </span>
              </div>
              {item.description && (
                <p className="mt-0.5 font-body text-sm text-content-muted truncate">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Remaining items */}
      {rest.length > 0 && (
        <div className="space-y-0 divide-y divide-neutral-900">
          {rest.map((item) => (
            <div
              key={item.rank}
              className="flex items-center gap-4 py-3 transition-colors duration-200 hover:bg-surface-elevated/40 cursor-pointer"
            >
              {/* Rank number */}
              <span className="shrink-0 w-8 font-display text-xl text-content-muted text-center">
                {item.rank}
              </span>

              {/* Content */}
              <div className="min-w-0 flex-1 flex items-baseline justify-between gap-3">
                <span className="font-heading text-sm font-medium text-content-secondary">
                  {item.name}
                </span>
                <span className="shrink-0 font-heading text-sm text-content-muted">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </ModuleShell>
  );
}
