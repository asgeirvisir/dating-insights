"use client";

import { useState, useEffect, useCallback } from "react";
import type { GuessaryQuestion } from "@/types";

interface GuessaryGameProps {
  questions: GuessaryQuestion[];
}

const AGE_GROUPS = ["18-24", "25-34", "35-44", "45+"];
const MARKETS = ["Denmark", "Iceland", "Norway", "Sweden"];
const GENDERS = ["Male", "Female"];

const DIMENSIONS = [
  { key: "m" as const, label: "Market", options: MARKETS },
  { key: "g" as const, label: "Gender", options: GENDERS },
  { key: "ag" as const, label: "Age", options: AGE_GROUPS },
] as const;

type DimKey = "m" | "g" | "ag";

function randomIndices(questionsLen: number) {
  return {
    q: Math.floor(Math.random() * questionsLen),
    ag: Math.floor(Math.random() * AGE_GROUPS.length),
    m: Math.floor(Math.random() * MARKETS.length),
    g: Math.floor(Math.random() * GENDERS.length),
  };
}

export default function GuessaryGame({ questions }: GuessaryGameProps) {
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);
  const [indices, setIndices] = useState({ q: 0, ag: 0, m: 0, g: 0 });
  const [pinned, setPinned] = useState<{
    m: number | null;
    g: number | null;
    ag: number | null;
  }>({ m: null, g: null, ag: null });
  const [openPicker, setOpenPicker] = useState<DimKey | null>(null);

  // Pinned values override random indices
  const effective = {
    m: pinned.m ?? indices.m,
    g: pinned.g ?? indices.g,
    ag: pinned.ag ?? indices.ag,
  };

  const question = questions[indices.q] ?? questions[0];
  const market = MARKETS[effective.m];
  const gender = GENDERS[effective.g];
  const ageGroup = AGE_GROUPS[effective.ag];
  const answer = question.slices.all?.[ageGroup] ?? 0;

  // Randomize on mount (after hydration)
  useEffect(() => {
    setIndices(randomIndices(questions.length));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset animation state when answer is hidden
  const [prevRevealed, setPrevRevealed] = useState(false);
  if (revealed !== prevRevealed) {
    setPrevRevealed(revealed);
    if (!revealed) {
      setAnimatedValue(0);
      setFinished(false);
    }
  }

  // Animate from 0 to answer
  useEffect(() => {
    if (!revealed) return;

    const duration = 2000 + Math.random() * 3000;
    const startTime = performance.now();
    let raf: number;

    const easings = [
      (t: number) => 1 - Math.pow(1 - t, 3),
      (t: number) => t * t * t,
      (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
      (t: number) => 1 - Math.pow(1 - t, 4),
      (t: number) =>
        t < 0.4 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
    ];
    const ease = easings[Math.floor(Math.random() * easings.length)];

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = ease(progress);
      setAnimatedValue(Math.round(eased * answer));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setFinished(true);
      }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [revealed, answer]);

  const handleNext = useCallback(() => {
    setRevealed(false);
    setOpenPicker(null);
    setIndices(randomIndices(questions.length));
  }, [questions.length]);

  const selectDimension = (key: DimKey, value: number | null) => {
    setPinned((prev) => ({ ...prev, [key]: value }));
    setOpenPicker(null);
  };

  return (
    <div className="mx-auto w-full max-w-[480px] px-4 sm:px-0">
      <div
        className="relative flex h-[440px] sm:h-[480px] flex-col rounded-xl border border-white/[0.08]"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,80,155,0.08) 0%, rgba(155,0,255,0.08) 100%), #1F1F1F",
        }}
      >
        {/* Branded top bar */}
        <div
          className="h-[2px] shrink-0 rounded-t-xl"
          style={{
            backgroundImage: "linear-gradient(to right, #FF509B, #9B00FF)",
          }}
        />

        {/* Content */}
        <div className="flex flex-1 flex-col px-6 pt-7 pb-6 sm:px-8 sm:pt-9 sm:pb-8">
          {/* Header */}
          <p
            className="text-center font-body text-xs font-semibold uppercase tracking-[0.2em]"
            style={{
              backgroundImage: "linear-gradient(to right, #FF509B, #9B00FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Guess the percentage
          </p>

          {/* Question */}
          <div className="flex flex-1 items-center justify-center py-3 sm:py-4">
            <h3 className="text-center font-heading text-xl font-bold leading-snug text-white sm:text-2xl">
              {question.displayQuestion}
            </h3>
          </div>

          {/* Dimension pickers */}
          <div className="relative mx-auto grid w-full max-w-xs grid-cols-3 text-center font-body">
            {/* Backdrop to close open picker */}
            {openPicker && (
              <div
                className="fixed inset-0 z-10"
                onClick={() => setOpenPicker(null)}
              />
            )}

            {DIMENSIONS.map(({ key, label, options }, i) => {
              const isOpen = openPicker === key;
              const isPinned = pinned[key] !== null;
              const displayValue =
                key === "m"
                  ? market
                  : key === "g"
                    ? gender
                    : ageGroup;

              return (
                <div
                  key={key}
                  className={`relative ${i === 1 ? "border-x border-white/[0.06]" : ""}`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenPicker(isOpen ? null : key)}
                    className={`w-full cursor-pointer rounded-lg py-2 transition-colors ${
                      isPinned
                        ? "bg-white/[0.04]"
                        : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <p className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-[0.15em] text-white/25">
                      {label}
                      <svg
                        className={`h-2 w-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        viewBox="0 0 8 5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 1l3 3 3-3" />
                      </svg>
                    </p>
                    <p
                      className={`mt-0.5 text-sm transition-colors ${
                        isPinned ? "" : "text-white/70"
                      }`}
                      style={
                        isPinned
                          ? {
                              backgroundImage:
                                "linear-gradient(to right, #FF509B, #9B00FF)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              backgroundClip: "text",
                            }
                          : undefined
                      }
                    >
                      {displayValue}
                    </p>
                  </button>

                  {/* Dropdown */}
                  {isOpen && (
                    <div className="absolute top-full left-1/2 z-20 mt-1.5 min-w-[120px] -translate-x-1/2 rounded-lg border border-white/10 bg-[#2A2A2A] py-1 shadow-xl">
                      {options.map((opt, idx) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => selectDimension(key, idx)}
                          className={`block w-full px-3 py-1.5 text-left text-sm transition-colors hover:bg-white/[0.06] ${
                            isPinned && pinned[key] === idx
                              ? "font-medium text-white"
                              : "text-white/60"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                      <div className="mx-2 my-1 border-t border-white/[0.06]" />
                      <button
                        type="button"
                        onClick={() => selectDimension(key, null)}
                        className={`block w-full px-3 py-1.5 text-left text-sm transition-colors hover:bg-white/[0.06] ${
                          !isPinned
                            ? "font-medium text-white/70"
                            : "text-white/40"
                        }`}
                      >
                        Random
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action area */}
          <div className="mt-6 flex h-[130px] sm:h-[150px] flex-col items-center justify-center">
            {!revealed ? (
              <>
                <p className="mb-4 font-body text-sm text-white/50">
                  Make your guess right now
                </p>
                <button
                  onClick={() => setRevealed(true)}
                  className="cursor-pointer rounded-full border border-transparent px-6 py-2 font-body text-sm font-medium text-white transition-all duration-200"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #FF509B, #9B00FF)",
                    backgroundSize: "120% 120%",
                    backgroundPosition: "center",
                    boxShadow: "0 10px 15px -3px #FF509B33",
                  }}
                >
                  Reveal answer
                </button>
              </>
            ) : (
              <>
                <div
                  className="flex items-center justify-center rounded-xl px-6 py-3 transition-all duration-500"
                  style={
                    finished
                      ? {
                          backgroundImage:
                            "linear-gradient(to right, #9B00FF, #FF509B)",
                        }
                      : undefined
                  }
                >
                  <p
                    className="font-display text-[4rem] font-black tracking-wide transition-all duration-500 sm:text-[5rem]"
                    style={{
                      lineHeight: "1",
                      paddingTop: "0.1em",
                      ...(finished
                        ? { color: "#1F1F1F" }
                        : {
                            backgroundImage:
                              "linear-gradient(to right, #FF509B, #9B00FF)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }),
                    }}
                  >
                    {animatedValue}%
                  </p>
                </div>
                <button
                  onClick={handleNext}
                  className="mt-3 cursor-pointer rounded-full border border-white/10 px-5 py-1.5 font-body text-sm font-medium text-white/55 transition-all duration-200 hover:border-white/20 hover:text-white/70"
                >
                  Next question
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
