"use client";

import type { MythData } from "@/types/modules";
import ModuleShell from "./ModuleShell";

type MythVerdictProps = MythData;

const verdictConfig: Record<
  MythData["verdict"],
  { label: string; className: string }
> = {
  confirmed: { label: "CONFIRMED", className: "gradient-data text-white" },
  busted: { label: "BUSTED", className: "bg-brand-pink text-white" },
  "partly-true": { label: "PARTLY TRUE", className: "bg-brand-purple text-white" },
};

export default function MythVerdict({
  title,
  subtitle,
  claim,
  verdict,
  explanation,
  category,
  supportingStats,
  source,
}: MythVerdictProps) {
  const config = verdictConfig[verdict];

  return (
    <ModuleShell title={title} category={category} source={source}>
      {subtitle && (
        <p className="mb-6 font-body text-sm text-content-muted">{subtitle}</p>
      )}

      {/* The Claim */}
      <div className="mb-8">
        <span className="font-display text-xs uppercase tracking-widest text-content-muted">
          The Claim
        </span>
        <p className="mt-2 font-heading text-xl font-bold text-content-primary sm:text-2xl">
          &ldquo;{claim}&rdquo;
        </p>
      </div>

      {/* Supporting Stats */}
      {supportingStats && supportingStats.length > 0 && (
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {supportingStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg bg-surface-elevated p-4 text-center"
            >
              <span className="block font-heading text-lg font-bold gradient-text-data sm:text-xl">
                {stat.value}
              </span>
              <span className="mt-1 block font-body text-xs text-content-muted">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* The Verdict */}
      <div>
        <span className="font-display text-xs uppercase tracking-widest text-content-muted">
          The Verdict
        </span>
        <div className="mt-3">
          <span
            className={`inline-block rounded-lg px-5 py-2.5 font-display text-2xl uppercase tracking-wide sm:text-3xl ${config.className}`}
          >
            {config.label}
          </span>
        </div>
        <p className="mt-4 font-body text-base text-content-secondary leading-relaxed">
          {explanation}
        </p>
      </div>
    </ModuleShell>
  );
}
