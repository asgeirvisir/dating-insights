"use client";

import { useState, useMemo } from "react";
import type { GuessaryQuestion } from "@/types";
import GuessaryFilterBar from "./GuessaryFilterBar";
import GuessaryGrid from "./GuessaryGrid";

interface GuessaryExplorerProps {
  questions: GuessaryQuestion[];
}

export default function GuessaryExplorer({
  questions,
}: GuessaryExplorerProps) {
  const [activeSlice, setActiveSlice] = useState("all");

  // Derive available slices from the union of all slice keys across questions
  const availableSlices = useMemo(() => {
    const sliceSet = new Set<string>();
    for (const q of questions) {
      for (const key of Object.keys(q.slices)) {
        sliceSet.add(key);
      }
    }
    // Ensure "all" comes first
    const slices = Array.from(sliceSet);
    slices.sort((a, b) => {
      if (a === "all") return -1;
      if (b === "all") return 1;
      return a.localeCompare(b);
    });
    return slices;
  }, [questions]);

  return (
    <>
      <GuessaryFilterBar
        availableSlices={availableSlices}
        activeSlice={activeSlice}
        onSliceChange={setActiveSlice}
      />
      <div className="mt-8">
        <GuessaryGrid questions={questions} activeSlice={activeSlice} />
      </div>
    </>
  );
}
