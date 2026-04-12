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
  secondMarket: string | null,
  genderFilter: string | null
): ChartState {
  const mktLabel = (k: string) =>
    MARKETS.find((m) => m.key === k)?.label ?? k;
  const mktShort = (k: string) =>
    MARKETS.find((m) => m.key === k)?.short ?? k;

  if (!splitGender && !secondMarket) {
    return {
      sliceKeyA: market,
      labelA: mktLabel(market),
      shortA: mktShort(market),
      isComparing: false,
    };
  }

  if (splitGender && !secondMarket) {
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

  if (secondMarket && !genderFilter) {
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

  if (secondMarket && genderFilter) {
    const gLabel = genderFilter === "male" ? "Male" : "Female";
    const gShort = genderFilter === "male" ? "M" : "F";
    return {
      sliceKeyA: `${market}_${genderFilter}`,
      sliceKeyB: `${secondMarket}_${genderFilter}`,
      labelA: `${mktLabel(market)} — ${gLabel}`,
      labelB: `${mktLabel(secondMarket)} — ${gLabel}`,
      shortA: `${mktShort(market)} ${gShort}`,
      shortB: `${mktShort(secondMarket)} ${gShort}`,
      isComparing: true,
    };
  }

  return {
    sliceKeyA: "all",
    labelA: "All",
    shortA: "ALL",
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
  const [secondMarket, setSecondMarket] = useState<string | null>(null);
  const [splitGender, setSplitGender] = useState(false);
  const [genderFilter, setGenderFilter] = useState<string | null>(null);

  // Shuffle with featured spread
  const shuffledQuestions = useMemo(
    () => shuffleWithFeaturedSpread(questions),
    [questions]
  );

  const handleMarketSelect = (key: string) => {
    if (key === "all") {
      setMarket("all");
      setSecondMarket(null);
      setGenderFilter(null);
      return;
    }

    if (secondMarket) {
      if (key === market) {
        setMarket(secondMarket);
        setSecondMarket(null);
        setSplitGender(false);
        setGenderFilter(null);
        return;
      }
      if (key === secondMarket) {
        setSecondMarket(null);
        setGenderFilter(null);
        return;
      }
      return;
    }

    if (key === market) {
      setMarket("all");
      setSplitGender(false);
      setGenderFilter(null);
      return;
    }

    if (market !== "all") {
      setSecondMarket(key);
      setSplitGender(false);
      return;
    }

    setMarket(key);
    setSplitGender(false);
    setGenderFilter(null);
  };

  const handleSplitToggle = () => {
    setSplitGender((prev) => !prev);
  };

  const handleGenderFilter = (key: string) => {
    setGenderFilter((prev) => (prev === key ? null : key));
  };

  const isTwoMarkets = secondMarket !== null;
  const chartState = deriveChartState(
    market,
    splitGender,
    secondMarket,
    genderFilter
  );

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
              const isActive =
                m.key === "all"
                  ? market === "all" && !secondMarket
                  : m.key === market || m.key === secondMarket;
              const isDisabled =
                m.key !== "all" &&
                isTwoMarkets &&
                m.key !== market &&
                m.key !== secondMarket;

              let gradientIdx: 0 | 1 | undefined;
              if (isTwoMarkets && m.key === market) gradientIdx = 0;
              if (isTwoMarkets && m.key === secondMarket) gradientIdx = 1;

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
            {isTwoMarkets ? (
              GENDERS.map((g) => (
                <Chip
                  key={g.key}
                  label={g.label}
                  active={genderFilter === g.key}
                  onClick={() => handleGenderFilter(g.key)}
                />
              ))
            ) : (
              <Chip
                label="Split by gender"
                active={splitGender}
                onClick={handleSplitToggle}
              />
            )}
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
