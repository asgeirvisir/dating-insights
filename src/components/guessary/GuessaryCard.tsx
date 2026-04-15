"use client";

import { useRef, memo } from "react";
import type { GuessaryQuestion } from "@/types";
import { SmittenBrandMark } from "@/components/ui/SmittenBrand";
import ChartExportButton from "@/components/ui/ChartExportButton";
import AgeBreakdownChart, { ChartLegend } from "./AgeBreakdownChart";
import { useInView } from "@/hooks/useInView";

interface GuessaryCardProps {
  question: GuessaryQuestion;
  dataA: Record<string, number>;
  dataB?: Record<string, number>;
  labelA: string;
  labelB?: string;
  shortA: string;
  shortB?: string;
  isComparing: boolean;
}

const GuessaryCard = memo(function GuessaryCard({
  question,
  dataA,
  dataB,
  labelA,
  labelB,
  shortA,
  shortB,
  isComparing,
}: GuessaryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { inView } = useInView("300px", cardRef);
  const hasData = Object.keys(dataA).length > 0;

  // Featured cards span 2 columns on tablet+ (full-width on tablet, 2-of-3 on desktop)
  const featuredClasses = question.featured ? "sm:col-span-2" : "";

  return (
    <div
      ref={cardRef}
      className={`relative flex flex-col rounded-xl border border-white/[0.08] bg-[#1F1F1F] p-5 sm:p-6 ${featuredClasses} ${!hasData ? "opacity-40" : ""}`}
    >
      {/* Top row: emoji left, badge + export right — vertically aligned */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-2xl leading-none" role="img" aria-hidden="true">
          {question.emoji}
        </span>
        <div className="flex items-center gap-2">
          <ChartExportButton
            targetRef={cardRef}
            filename={`guessary-${question.id}`}
          />
        </div>
      </div>

      <h3 className="mb-1 font-heading text-lg font-bold leading-snug text-white sm:text-xl">
        {question.statement}
      </h3>

      {question.headline && (
        <p className="mb-3 font-body text-[13px] leading-snug text-white/60">
          {question.headline}
        </p>
      )}

      {!question.headline && <div className="mb-3" />}

      <div className="mt-auto">
        {isComparing && labelB && (
          <div className="mb-2">
            <ChartLegend labels={[labelA, labelB]} />
          </div>
        )}
        {!inView ? (
          <div className="h-[200px]" />
        ) : hasData ? (
          <AgeBreakdownChart
            dataA={dataA}
            dataB={dataB}
            labelA={labelA}
            labelB={labelB}
            shortA={shortA}
            shortB={shortB}
            isComparing={isComparing}
          />
        ) : (
          <div className="flex h-[200px] items-center justify-center">
            <p className="font-body text-sm text-content-muted">
              No data for this filter
            </p>
          </div>
        )}
      </div>

      {/* Brand */}
      <div className="mt-3 pt-3 border-t border-white/[0.06] flex justify-center">
        <SmittenBrandMark />
      </div>
    </div>
  );
});

export default GuessaryCard;
