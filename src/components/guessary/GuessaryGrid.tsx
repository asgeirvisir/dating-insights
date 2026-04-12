"use client";

import type { GuessaryQuestion } from "@/types";
import GuessaryCard from "./GuessaryCard";

interface ChartState {
  sliceKeyA: string;
  sliceKeyB?: string;
  labelA: string;
  labelB?: string;
  shortA: string;
  shortB?: string;
  isComparing: boolean;
}

interface GuessaryGridProps {
  questions: GuessaryQuestion[];
  chartState: ChartState;
}

export default function GuessaryGrid({
  questions,
  chartState,
}: GuessaryGridProps) {
  const { sliceKeyA, sliceKeyB, labelA, labelB, shortA, shortB, isComparing } =
    chartState;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" style={{ gridAutoFlow: "dense" }}>
      {questions.map((q) => {
        const dataA = q.slices[sliceKeyA] ?? q.slices.all ?? {};
        const dataB = sliceKeyB
          ? q.slices[sliceKeyB] ?? q.slices.all ?? {}
          : undefined;

        return (
          <GuessaryCard
            key={q.id}
            question={q}
            dataA={dataA}
            dataB={dataB}
            labelA={labelA}
            labelB={labelB}
            shortA={shortA}
            shortB={shortB}
            isComparing={isComparing}
          />
        );
      })}
    </div>
  );
}
