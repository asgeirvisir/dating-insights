"use client";

import type { GuessaryQuestion } from "@/types";
import GuessaryCard from "./GuessaryCard";

interface GuessaryGridProps {
  questions: GuessaryQuestion[];
  activeSlice: string;
}

export default function GuessaryGrid({
  questions,
  activeSlice,
}: GuessaryGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {questions.map((q) => (
        <GuessaryCard key={q.id} question={q} activeSlice={activeSlice} />
      ))}
    </div>
  );
}
