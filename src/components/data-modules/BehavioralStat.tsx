"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { BehavioralData } from "@/types/modules";
import ModuleShell from "./ModuleShell";
import BigNumber from "./BigNumber";

type BehavioralStatProps = BehavioralData;

function parseComparison(comparison: string): {
  direction: "up" | "down" | "neutral";
  text: string;
} {
  const lower = comparison.toLowerCase();
  if (lower.startsWith("up ") || lower.includes("increase") || lower.includes("+")) {
    return { direction: "up", text: comparison };
  }
  if (lower.startsWith("down ") || lower.includes("decrease") || lower.includes("-")) {
    return { direction: "down", text: comparison };
  }
  return { direction: "neutral", text: comparison };
}

const directionConfig = {
  up: {
    icon: TrendingUp,
    className: "text-brand-cyan",
  },
  down: {
    icon: TrendingDown,
    className: "text-brand-pink",
  },
  neutral: {
    icon: Minus,
    className: "text-content-muted",
  },
} as const;

export default function BehavioralStat({
  title,
  subtitle,
  stat,
  statLabel,
  context,
  comparison,
  category,
  source,
}: BehavioralStatProps) {
  const parsed = comparison ? parseComparison(comparison) : null;
  const dirConfig = parsed ? directionConfig[parsed.direction] : null;

  return (
    <ModuleShell title={title} category={category} source={source}>
      {subtitle && (
        <p className="mb-6 font-body text-sm text-content-muted">{subtitle}</p>
      )}

      {/* Main Stat */}
      <BigNumber value={stat} label={statLabel} variant="data" />

      {/* Context */}
      <p className="mt-5 text-center font-body text-base text-content-secondary leading-relaxed">
        {context}
      </p>

      {/* Comparison */}
      {parsed && dirConfig && (
        <div
          className={`mt-4 flex items-center justify-center gap-2 ${dirConfig.className}`}
        >
          <dirConfig.icon className="h-4 w-4" />
          <span className="font-heading text-sm font-medium">
            {parsed.text}
          </span>
        </div>
      )}
    </ModuleShell>
  );
}
