"use client";

import { useState, useMemo } from "react";
import type { GuessaryQuestion } from "@/types";
import GuessaryGrid from "./GuessaryGrid";

/* ── Filter options (matching lab) ── */

const MARKETS = [
  { key: "all", label: "All", short: "ALL" },
  { key: "iceland", label: "Iceland", short: "ICE" },
  { key: "denmark", label: "Denmark", short: "DEN" },
  { key: "norway", label: "Norway", short: "NOR" },
  { key: "sweden", label: "Sweden", short: "SWE" },
];

const GENDERS = [
  { key: "male", label: "Male", short: "M" },
  { key: "female", label: "Female", short: "F" },
];

/* ── Derive chart state from selections ── */

interface ChartState {
  sliceKeyA: string;
  sliceKeyB?: string;
  labelA: string;
  labelB?: string;
  shortA: string;
  shortB?: string;
  isComparing: boolean;
}

function deriveChartState(
  market: string,
  splitGender: boolean,
  compareRest: boolean,
  secondMarket: string | null
): ChartState {
  const mktLabel = (k: string) =>
    MARKETS.find((m) => m.key === k)?.label ?? k;
  const mktShort = (k: string) =>
    MARKETS.find((m) => m.key === k)?.short ?? k;

  // Two specific markets compared
  if (secondMarket) {
    return {
      sliceKeyA: market,
      sliceKeyB: secondMarket,
      labelA: mktLabel(market),
      labelB: mktLabel(secondMarket),
      shortA: mktShort(market),
      shortB: mktShort(secondMarket),
      isComparing: true,
    };
  }

  // Compare market vs rest-of-markets
  if (compareRest && market !== "all") {
    return {
      sliceKeyA: market,
      sliceKeyB: `rest_${market}`,
      labelA: mktLabel(market),
      labelB: "Rest",
      shortA: mktShort(market),
      shortB: "REST",
      isComparing: true,
    };
  }

  // Single market with gender split
  if (splitGender) {
    const prefix = market === "all" ? "all" : market;
    return {
      sliceKeyA: `${prefix}_male`,
      sliceKeyB: `${prefix}_female`,
      labelA: market === "all" ? "Male" : `${mktLabel(market)} — Male`,
      labelB: market === "all" ? "Female" : `${mktLabel(market)} — Female`,
      shortA: market === "all" ? "M" : `${mktShort(market)} M`,
      shortB: market === "all" ? "F" : `${mktShort(market)} F`,
      isComparing: true,
    };
  }

  // Single market, no comparison
  return {
    sliceKeyA: market,
    labelA: mktLabel(market),
    shortA: mktShort(market),
    isComparing: false,
  };
}

/* ── Deterministic shuffle helpers ── */

function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

/* ── Chip component ── */

function Chip({
  label,
  active,
  gradientIndex,
  onClick,
  disabled,
}: {
  label: string;
  active: boolean;
  gradientIndex?: 0 | 1;
  onClick: () => void;
  disabled?: boolean;
}) {
  const base =
    "cursor-pointer rounded-full px-3.5 py-1.5 font-body text-sm font-medium transition-all duration-200 border min-h-[36px] ";

  const isGradient = active && gradientIndex !== undefined;

  let classes = base;
  let style: React.CSSProperties | undefined;

  if (isGradient) {
    const grad =
      gradientIndex === 0
        ? "linear-gradient(to right, #FF509B, #9B00FF)"
        : "linear-gradient(to right, #9B00FF, #0CC4EF)";
    const shadow = gradientIndex === 0 ? "#FF509B33" : "#0CC4EF33";
    style = {
      backgroundImage: grad,
      backgroundSize: "120% 120%",
      backgroundPosition: "center",
      boxShadow: `0 10px 15px -3px ${shadow}`,
    };
    classes += "text-white border-transparent";
  } else if (active) {
    classes += "bg-white text-[#0A0A0F] border-transparent";
  } else if (disabled) {
    classes += "border-white/5 text-white/20 cursor-not-allowed";
  } else {
    classes +=
      "border-white/10 text-white/55 hover:border-white/20 hover:text-white/70";
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled && !active}
      className={classes}
      style={style}
    >
      {label}
    </button>
  );
}

/* ── Shuffle featured cards into the grid ── */

// Additional question IDs to mark as featured (clickbait-y ones)
const EXTRA_FEATURED_IDS = new Set([
  "q-18",  // Strip clubs
  "q-80",  // Love at first sight
  "q-48",  // Sex in public
  "q-70",  // Hooked up with a stranger
  "q-134", // Thought about someone else during sex
  "q-116", // More than $10k in bank
  "q-10",  // Tried drugs
  "q-43",  // Seen someone die
]);

function shuffleWithFeaturedSpread(questions: GuessaryQuestion[]): GuessaryQuestion[] {
  // Mark extra featured
  const enhanced = questions.map((q) => ({
    ...q,
    featured: q.featured || EXTRA_FEATURED_IDS.has(q.id),
  }));

  const featured = enhanced.filter((q) => q.featured);
  const regular = enhanced.filter((q) => !q.featured);

  // Deterministic shuffle using question IDs
  const seed = hashSeed("guessary-grid-layout");
  const rand = seededRandom(seed);
  regular.sort(() => rand() - 0.5);
  featured.sort(() => rand() - 0.5);

  // Distribute featured cards with grid-aware spacing.
  // Desktop (3 cols): featured spans 2 cols + 1 small fills the row.
  //   Alternate 9 (3 full rows) and 8 small cards between featured cards
  //   so the grid stays gap-free with dense auto-flow.
  // Tablet (2 cols): featured spans full width, even counts keep rows tidy.
  // The 9/8 alternation satisfies both: 9 is 4.5 tablet-rows (dense fills),
  // 8 is 4 tablet-rows (perfect).
  const SPACINGS = [9, 8];
  const result: GuessaryQuestion[] = [];
  let regularIdx = 0;
  let featuredIdx = 0;

  while (regularIdx < regular.length || featuredIdx < featured.length) {
    const spacing = SPACINGS[featuredIdx % SPACINGS.length];
    const batchSize = Math.min(spacing, regular.length - regularIdx);
    for (let i = 0; i < batchSize; i++) {
      result.push(regular[regularIdx++]);
    }
    if (featuredIdx < featured.length) {
      result.push(featured[featuredIdx++]);
    }
  }

  return result;
}

/* ── Main component ── */

interface GuessaryExplorerProps {
  questions: GuessaryQuestion[];
}

export default function GuessaryExplorer({
  questions,
}: GuessaryExplorerProps) {
  const [market, setMarket] = useState("all");
  const [compareRest, setCompareRest] = useState(false);
  const [secondMarket, setSecondMarket] = useState<string | null>(null);
  const [splitGender, setSplitGender] = useState(false);

  // Shuffle with featured spread
  const shuffledQuestions = useMemo(
    () => shuffleWithFeaturedSpread(questions),
    [questions]
  );

  const isComparing = compareRest || secondMarket !== null;

  const handleMarketSelect = (key: string) => {
    if (key === "all") {
      // Always reset to default
      setMarket("all");
      setCompareRest(false);
      setSecondMarket(null);
      setSplitGender(false);
      return;
    }

    // Two-market mode: tap one of the selected markets to deselect it
    if (secondMarket) {
      if (key === market) {
        // Deselect first → remaining market vs rest
        setMarket(secondMarket);
        setSecondMarket(null);
        setCompareRest(true);
        setSplitGender(false);
        return;
      }
      if (key === secondMarket) {
        // Deselect second → remaining market vs rest
        setSecondMarket(null);
        setCompareRest(true);
        setSplitGender(false);
        return;
      }
      // Third market tapped while two are selected — ignore
      return;
    }

    // Market vs rest mode: tap same to go single, tap different to go two-market
    if (compareRest && key === market) {
      setCompareRest(false);
      setSplitGender(false);
      return;
    }
    if (compareRest && key !== market) {
      setSecondMarket(key);
      setCompareRest(false);
      setSplitGender(false);
      return;
    }

    // Single market mode: tap same to go back to all, tap different to compare vs rest
    if (key === market) {
      setMarket("all");
      return;
    }

    // From all or single market → enter compare-rest mode
    setMarket(key);
    setCompareRest(true);
    setSplitGender(false);
  };

  const handleSplitToggle = () => {
    setSplitGender((prev) => !prev);
  };

  const chartState = deriveChartState(market, splitGender, compareRest, secondMarket);

  return (
    <>
      {/* Controls */}
      <div className="sticky top-16 z-30 -mx-4 bg-surface-base/80 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-col gap-3">
          {/* Market row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-body text-[13px] uppercase tracking-wider text-white/55 mr-1 w-14">
              Market
            </span>
            {MARKETS.map((m) => {
              let isActive: boolean;
              let gradientIdx: 0 | 1 | undefined;
              let isDisabled = false;

              if (secondMarket) {
                // Two-market mode: only those two are active
                isActive = m.key === market || m.key === secondMarket;
                isDisabled =
                  m.key !== "all" &&
                  m.key !== market &&
                  m.key !== secondMarket;
                if (m.key === market) gradientIdx = 0;
                if (m.key === secondMarket) gradientIdx = 1;
              } else if (compareRest) {
                // Market vs rest: both All and market are active
                isActive = m.key === "all" || m.key === market;
                if (m.key === market) gradientIdx = 0;
                if (m.key === "all") gradientIdx = 1;
              } else {
                // Single mode
                isActive =
                  m.key === "all"
                    ? market === "all"
                    : m.key === market;
              }

              return (
                <Chip
                  key={m.key}
                  label={m.label}
                  active={isActive}
                  gradientIndex={gradientIdx}
                  onClick={() => handleMarketSelect(m.key)}
                  disabled={isDisabled}
                />
              );
            })}
          </div>

          {/* Gender row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-body text-[13px] uppercase tracking-wider text-white/55 mr-1 w-14">
              Gender
            </span>
            <Chip
              label="Split by gender"
              active={splitGender}
              onClick={handleSplitToggle}
              disabled={isComparing}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-8">
        <GuessaryGrid
          questions={shuffledQuestions}
          chartState={chartState}
        />
      </div>
    </>
  );
}
