"use client";

import type { ProfileInsightData } from "@/types/modules";
import ModuleShell from "./ModuleShell";

type ProfileTraitCardProps = ProfileInsightData;

export default function ProfileTraitCard({
  title,
  subtitle,
  category,
  traits,
  source,
}: ProfileTraitCardProps) {
  return (
    <ModuleShell title={title} category={category} source={source}>
      {subtitle && (
        <p className="mb-6 font-body text-sm text-content-muted">{subtitle}</p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {traits.map((t) => (
          <div
            key={t.trait}
            className="group rounded-lg bg-surface-elevated p-5 transition-all duration-200 hover:bg-surface-elevated/80 cursor-pointer"
          >
            <h4 className="font-heading text-base font-semibold text-content-primary">
              {t.trait}
            </h4>
            <span className="mt-1 block font-heading text-lg font-bold gradient-text sm:text-xl">
              {t.impact}
            </span>
            <p className="mt-2 font-body text-sm text-content-muted leading-relaxed">
              {t.description}
            </p>
          </div>
        ))}
      </div>
    </ModuleShell>
  );
}
