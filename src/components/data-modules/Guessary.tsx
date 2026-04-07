"use client";

import type { GuessaryData } from "@/types/modules";
import ModuleShell from "./ModuleShell";

type GuessaryProps = GuessaryData;

export default function Guessary({
  question,
  yes,
  no,
  sampleSize,
  takeaway,
  category,
  source,
}: GuessaryProps) {
  const total = yes + no;
  const yesPercent = total > 0 ? Math.round((yes / total) * 100) : 0;
  const noPercent = total > 0 ? 100 - yesPercent : 0;

  return (
    <ModuleShell title="Guessary" category={category} source={source}>
      {/* Question */}
      <p className="font-heading text-xl font-bold text-content-primary sm:text-2xl mb-6">
        {question}
      </p>

      {/* Split Bar */}
      <div className="space-y-3">
        {/* Labels */}
        <div className="flex items-center justify-between font-heading text-sm font-medium">
          <span className="text-brand-pink">Yes {yesPercent}%</span>
          <span className="text-brand-purple">No {noPercent}%</span>
        </div>

        {/* Bar */}
        <div className="flex h-10 w-full overflow-hidden rounded-lg sm:h-12">
          <div
            className="flex items-center justify-center bg-brand-pink transition-all duration-700 ease-out"
            style={{ width: `${yesPercent}%` }}
          >
            {yesPercent >= 15 && (
              <span className="font-heading text-sm font-semibold text-white">
                {yesPercent}%
              </span>
            )}
          </div>
          <div
            className="flex items-center justify-center bg-brand-purple transition-all duration-700 ease-out"
            style={{ width: `${noPercent}%` }}
          >
            {noPercent >= 15 && (
              <span className="font-heading text-sm font-semibold text-white">
                {noPercent}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Takeaway */}
      <p className="mt-5 font-body text-base italic text-content-muted">
        &ldquo;{takeaway}&rdquo;
      </p>

      {/* Sample size */}
      <p className="mt-3 font-body text-xs text-content-muted">
        Based on {sampleSize.toLocaleString()} responses
      </p>
    </ModuleShell>
  );
}
