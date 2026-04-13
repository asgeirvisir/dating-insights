"use client";

import type { GuessaryQuestion } from "@/types";
import GuessaryCard from "./GuessaryCard";

interface InsightChartsProps {
  questions: GuessaryQuestion[];
}

export default function InsightCharts({ questions }: InsightChartsProps) {
  return (
    <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
      {questions.map((q) => (
        <GuessaryCard
          key={q.id}
          question={q}
          dataA={q.slices["all"] ?? {}}
          labelA="All"
          shortA="ALL"
          isComparing={false}
        />
      ))}
    </div>
  );
}
