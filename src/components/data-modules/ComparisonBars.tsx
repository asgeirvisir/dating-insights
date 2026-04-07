"use client";

import { useEffect, useState } from "react";
import type { ComparisonData } from "@/types/modules";
import ModuleShell from "./ModuleShell";

type ComparisonBarsProps = ComparisonData;

export default function ComparisonBars({
  title,
  subtitle,
  category,
  items,
  unit,
  source,
}: ComparisonBarsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  // Sort items descending by value
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const maxValue = sorted.length > 0 ? sorted[0].value : 1;

  return (
    <ModuleShell title={title} category={category} source={source}>
      {subtitle && (
        <p className="mb-6 font-body text-sm text-content-muted">{subtitle}</p>
      )}

      <div className="space-y-4">
        {sorted.map((item) => {
          const widthPercent = (item.value / maxValue) * 100;
          const displayLabel = item.label ?? `${item.value}${unit ? ` ${unit}` : ""}`;

          return (
            <div key={item.name} className="group">
              {/* Name and value labels */}
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <span className="font-heading text-sm font-medium text-content-secondary group-hover:text-content-primary transition-colors duration-200">
                  {item.name}
                </span>
                <span className="shrink-0 font-heading text-sm font-semibold text-content-primary">
                  {displayLabel}
                </span>
              </div>

              {/* Bar track */}
              <div className="h-3 w-full overflow-hidden rounded-full bg-surface-elevated">
                <div
                  className="h-full rounded-full gradient-data transition-all duration-700 ease-out"
                  style={{
                    width: mounted ? `${widthPercent}%` : "0%",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </ModuleShell>
  );
}
