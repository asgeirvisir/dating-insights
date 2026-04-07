"use client";

import type { GuessaryQuestion } from "@/types";
import Badge from "@/components/ui/Badge";
import AgeBreakdownChart from "./AgeBreakdownChart";

interface GuessaryCardProps {
  question: GuessaryQuestion;
  activeSlice: string;
}

export default function GuessaryCard({
  question,
  activeSlice,
}: GuessaryCardProps) {
  const sliceData = question.slices[activeSlice];
  const isSpicy = question.tags.includes("spicy");

  return (
    <div
      className={`gradient-border flex flex-col p-5 sm:p-6 ${
        question.featured ? "col-span-1 sm:col-span-2" : ""
      } ${!sliceData ? "opacity-50" : ""}`}
    >
      {/* Top row: emoji + optional badge */}
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl" role="img" aria-hidden="true">
          {question.emoji}
        </span>
        {isSpicy && (
          <Badge variant="pink">
            🔥 Spicy
          </Badge>
        )}
      </div>

      {/* Optional clickbait headline */}
      {question.headline && (
        <p className="mb-2 font-heading text-base italic leading-snug gradient-text sm:text-lg">
          &ldquo;{question.headline}&rdquo;
        </p>
      )}

      {/* Display question */}
      <h3 className="mb-4 font-heading text-lg font-bold text-content-primary sm:text-xl">
        {question.displayQuestion}
      </h3>

      {/* Chart or fallback */}
      <div className="mt-auto">
        {sliceData ? (
          <AgeBreakdownChart data={sliceData} />
        ) : (
          <div className="flex h-[180px] items-center justify-center">
            <p className="font-body text-sm text-content-muted">
              No data for this view
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
