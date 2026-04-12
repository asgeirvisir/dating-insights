"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type { GuessaryQuestion } from "@/types";

interface GuessaryGameProps {
  questions: GuessaryQuestion[];
}

const AGE_GROUPS = ["18-24", "25-34", "35-44", "45+"];
const MARKETS = ["Denmark", "Iceland", "Norway", "Sweden"];
const GENDERS = ["Male", "Female"];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function GuessaryGame({ questions }: GuessaryGameProps) {
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);
  const [seed, setSeed] = useState(0);

  // Pick a random question + age group + market + gender, re-pick when seed changes
  const { question, ageGroup, market, gender, answer } = useMemo(() => {
    const q = pickRandom(questions);
    const ag = pickRandom(AGE_GROUPS);
    const m = pickRandom(MARKETS);
    const g = pickRandom(GENDERS);
    const val = q.slices.all?.[ag] ?? 0;
    return { question: q, ageGroup: ag, market: m, gender: g, answer: val };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, seed]);

  // Animate from 0 to answer
  useEffect(() => {
    if (!revealed) {
      setAnimatedValue(0);
      setFinished(false);
      return;
    }

    const duration = 2000 + Math.random() * 3000; // 2-5 seconds
    const startTime = performance.now();
    let raf: number;

    // Pick a random easing curve
    const easings = [
      (t: number) => 1 - Math.pow(1 - t, 3),                    // ease-out cubic (fast start, slow end)
      (t: number) => t * t * t,                                   // ease-in cubic (slow start, fast end)
      (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, // ease-in-out cubic
      (t: number) => 1 - Math.pow(1 - t, 4),                    // ease-out quartic (faster start, slower end)
      (t: number) => t < 0.4 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,     // early ease-in, then ease-out
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
    setSeed((s) => s + 1);
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 pb-10 sm:pb-14">
      <div
        className="relative overflow-hidden rounded-xl border border-white/[0.08] p-6 sm:p-8"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,80,155,0.08) 0%, rgba(155,0,255,0.08) 100%), #1F1F1F",
        }}
      >
        {/* Subtle branded top bar */}
        <div
          className="absolute inset-x-0 top-0 h-[2px]"
          style={{
            backgroundImage: "linear-gradient(to right, #FF509B, #9B00FF)",
          }}
        />

        {/* Header */}
        <p
          className="mb-6 text-center font-body text-xs font-semibold uppercase tracking-[0.2em]"
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
        <h3 className="text-center font-heading text-xl font-bold leading-snug text-white sm:text-2xl">
          {question.displayQuestion}
        </h3>

        {/* Labels */}
        <div className="mx-auto mt-6 grid max-w-xs grid-cols-3 text-center font-body">
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/25">Market</p>
            <p className="mt-0.5 text-sm text-white/70">{market}</p>
          </div>
          <div className="border-x border-white/[0.06]">
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/25">Gender</p>
            <p className="mt-0.5 text-sm text-white/70">{gender}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/25">Age</p>
            <p className="mt-0.5 text-sm text-white/70">{ageGroup}</p>
          </div>
        </div>

        {/* Action area */}
        <div className="mt-7 text-center">
          {!revealed ? (
            <>
              <p className="font-body text-sm text-white/50 mb-4">
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
                className="inline-block rounded-xl px-6 py-2 transition-all duration-500"
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
                  className="font-display text-[4rem] font-black leading-none tracking-wide sm:text-[5rem] transition-all duration-500"
                  style={
                    finished
                      ? { color: "#1F1F1F" }
                      : {
                          backgroundImage:
                            "linear-gradient(to right, #FF509B, #9B00FF)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }
                  }
                >
                  {animatedValue}%
                </p>
              </div>
              <div>
                <button
                  onClick={handleNext}
                  className="mt-3 cursor-pointer rounded-full border border-white/10 px-5 py-1.5 font-body text-sm font-medium text-white/55 transition-all duration-200 hover:border-white/20 hover:text-white/70"
                >
                  Next question
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
