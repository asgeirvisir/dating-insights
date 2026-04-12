"use client";

import { useId, useRef, useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";

import { SmittenBrandMark } from "@/components/ui/SmittenBrand";
import ChartExportButton from "@/components/ui/ChartExportButton";

const AGE_GROUPS = ["18-24", "25-34", "35-44", "45+"];

/* ── Brand gradients ── */

const GRADIENT_A = { from: "#FF509B", to: "#9B00FF" }; // pink → purple
const GRADIENT_B = { from: "#0CC4EF", to: "#9B00FF" }; // cyan → purple

/* ── Mock data (including cross-sliced market × gender) ── */

type SliceData = Record<string, number>;

interface LabQuestion {
  id: string;
  displayQuestion: string;
  emoji: string;
  headline: string;
  slices: Record<string, SliceData>;
}

const LAB_QUESTIONS: LabQuestion[] = [
  {
    id: "q-93",
    displayQuestion: "How many people have been in love?",
    emoji: "❤️",
    headline: "By 45, almost everyone has been in love",
    slices: {
      all: { "18-24": 60, "25-34": 80, "35-44": 92, "45+": 97 },
      male: { "18-24": 52, "25-34": 74, "35-44": 88, "45+": 95 },
      female: { "18-24": 68, "25-34": 86, "35-44": 96, "45+": 98 },
      iceland: { "18-24": 65, "25-34": 84, "35-44": 94, "45+": 98 },
      denmark: { "18-24": 58, "25-34": 78, "35-44": 90, "45+": 96 },
      uk: { "18-24": 55, "25-34": 76, "35-44": 89, "45+": 95 },
      us: { "18-24": 62, "25-34": 82, "35-44": 93, "45+": 97 },
      iceland_male: { "18-24": 58, "25-34": 78, "35-44": 90, "45+": 96 },
      iceland_female: { "18-24": 72, "25-34": 90, "35-44": 97, "45+": 99 },
      denmark_male: { "18-24": 50, "25-34": 72, "35-44": 86, "45+": 94 },
      denmark_female: { "18-24": 66, "25-34": 84, "35-44": 94, "45+": 97 },
      uk_male: { "18-24": 48, "25-34": 70, "35-44": 84, "45+": 93 },
      uk_female: { "18-24": 62, "25-34": 82, "35-44": 94, "45+": 97 },
      us_male: { "18-24": 54, "25-34": 76, "35-44": 89, "45+": 95 },
      us_female: { "18-24": 70, "25-34": 88, "35-44": 97, "45+": 99 },
      all_male: { "18-24": 52, "25-34": 74, "35-44": 88, "45+": 95 },
      all_female: { "18-24": 68, "25-34": 86, "35-44": 96, "45+": 98 },
    },
  },
  {
    id: "q-119",
    displayQuestion: "How many people are iPhone users?",
    emoji: "📱",
    headline: "The iPhone generation gap is real",
    slices: {
      all: { "18-24": 96, "25-34": 76, "35-44": 56, "45+": 57 },
      male: { "18-24": 94, "25-34": 72, "35-44": 50, "45+": 52 },
      female: { "18-24": 98, "25-34": 80, "35-44": 62, "45+": 62 },
      iceland: { "18-24": 92, "25-34": 70, "35-44": 48, "45+": 45 },
      denmark: { "18-24": 90, "25-34": 68, "35-44": 52, "45+": 50 },
      uk: { "18-24": 95, "25-34": 78, "35-44": 58, "45+": 55 },
      us: { "18-24": 98, "25-34": 82, "35-44": 64, "45+": 65 },
      iceland_male: { "18-24": 90, "25-34": 66, "35-44": 42, "45+": 40 },
      iceland_female: { "18-24": 94, "25-34": 74, "35-44": 54, "45+": 50 },
      denmark_male: { "18-24": 88, "25-34": 64, "35-44": 46, "45+": 44 },
      denmark_female: { "18-24": 92, "25-34": 72, "35-44": 58, "45+": 56 },
      uk_male: { "18-24": 93, "25-34": 74, "35-44": 52, "45+": 50 },
      uk_female: { "18-24": 97, "25-34": 82, "35-44": 64, "45+": 60 },
      us_male: { "18-24": 96, "25-34": 78, "35-44": 58, "45+": 60 },
      us_female: { "18-24": 99, "25-34": 86, "35-44": 70, "45+": 70 },
      all_male: { "18-24": 94, "25-34": 72, "35-44": 50, "45+": 52 },
      all_female: { "18-24": 98, "25-34": 80, "35-44": 62, "45+": 62 },
    },
  },
];

/* ── Filter options ── */

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

/* ── Hooks ── */

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [breakpoint]);
  return isMobile;
}

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
  market: string, // "all" or a specific market
  splitGender: boolean,
  secondMarket: string | null,
  genderFilter: string | null
): ChartState {
  const mktLabel = (k: string) => MARKETS.find((m) => m.key === k)?.label ?? k;
  const mktShort = (k: string) => MARKETS.find((m) => m.key === k)?.short ?? k;

  // Single market (or All), no split, no second market
  if (!splitGender && !secondMarket) {
    return {
      sliceKeyA: market,
      labelA: mktLabel(market),
      shortA: mktShort(market),
      isComparing: false,
    };
  }

  // Split by gender (works for All and single markets)
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

  // Two markets, no gender filter
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

  // Two markets + gender filter
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

/* ── Tooltip ── */

function LabTooltip({
  active,
  payload,
  shortA,
  shortB,
}: {
  active?: boolean;
  payload?: { value: number; name: string; dataKey: string }[];
  label?: string;
  shortA: string;
  shortB?: string;
}) {
  if (!active || !payload?.length) return null;
  const seen = new Set<string>();
  const unique = payload.filter((p) => {
    if (seen.has(p.dataKey)) return false;
    seen.add(p.dataKey);
    return true;
  });
  // Single line
  if (unique.length === 1) {
    return (
      <div className="rounded-md bg-white/10 backdrop-blur-sm border border-white/10 px-2.5 py-1 shadow-lg">
        <p className="font-body text-sm font-semibold text-white tabular-nums">
          {unique[0].value}%
        </p>
      </div>
    );
  }
  // Comparing — show short labels
  const aEntry = unique.find((p) => p.dataKey === "a");
  const bEntry = unique.find((p) => p.dataKey === "b");
  return (
    <div className="rounded-md bg-white/10 backdrop-blur-sm border border-white/10 px-3 py-1.5 shadow-lg">
      <p className="font-body text-sm text-white tabular-nums">
        {aEntry && (
          <span>
            <span className="text-white/50">{shortA}</span>{" "}
            <span className="font-semibold">{aEntry.value}%</span>
          </span>
        )}
        {aEntry && bEntry && (
          <span className="mx-1.5 text-white/25">vs</span>
        )}
        {bEntry && (
          <span>
            <span className="text-white/50">{shortB}</span>{" "}
            <span className="font-semibold">{bEntry.value}%</span>
          </span>
        )}
      </p>
    </div>
  );
}

/* ── Chart ── */

function LabChart({
  dataA,
  dataB,
  labelA,
  labelB,
  shortA,
  shortB,
  isComparing,
}: {
  dataA: SliceData;
  dataB?: SliceData;
  labelA: string;
  labelB?: string;
  shortA: string;
  shortB?: string;
  isComparing: boolean;
}) {
  const reactId = useId();
  const uid = reactId.replace(/:/g, "");

  const chartData = AGE_GROUPS.map((group) => ({
    ageGroup: group,
    a: dataA[group] ?? 0,
    ...(dataB ? { b: dataB[group] ?? 0 } : {}),
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart
        data={chartData}
        margin={{ top: 28, right: 30, left: 12, bottom: 4 }}
      >
        <defs>
          <linearGradient id={`${uid}-strokeA`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={GRADIENT_A.from} />
            <stop offset="100%" stopColor={GRADIENT_A.to} />
          </linearGradient>
          <linearGradient id={`${uid}-fillA`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={GRADIENT_A.from} stopOpacity={0.3} />
            <stop offset="80%" stopColor={GRADIENT_A.to} stopOpacity={0.05} />
            <stop offset="100%" stopColor={GRADIENT_A.to} stopOpacity={0} />
          </linearGradient>
          <linearGradient id={`${uid}-strokeB`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={GRADIENT_B.to} />
            <stop offset="100%" stopColor={GRADIENT_B.from} />
          </linearGradient>
          <filter id={`${uid}-glowA`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
          </filter>
          <filter id={`${uid}-glowB`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
          </filter>
        </defs>

        <XAxis
          dataKey="ageGroup"
          tick={{
            fill: "#A4A4A4",
            fontSize: 12,
            fontFamily: "Source Sans 3",
          }}
          axisLine={false}
          tickLine={false}
          dy={6}
          padding={{ left: 14, right: 0 }}
        />
        <CartesianGrid
          horizontal
          vertical={false}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={1}
        />
        <YAxis
          domain={[0, 100]}
          ticks={[0, 25, 50, 75, 100]}
          tick={{
            fill: "#434343",
            fontSize: 9,
            fontFamily: "Source Sans 3",
          }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `${v}`}
          width={22}
          orientation="left"
        />
        <Tooltip
          content={<LabTooltip shortA={shortA} shortB={shortB} />}
          cursor={{
            stroke: "rgba(255,255,255,0.1)",
            strokeWidth: 1,
            strokeDasharray: "3 3",
          }}
        />

        {/* Line B (cyan→purple) */}
        {dataB && (
          <>
            <Area
              type="natural"
              dataKey="b"
              name={labelB}
              stroke={`url(#${uid}-strokeB)`}
              strokeWidth={5}
              fill="none"
              filter={`url(#${uid}-glowB)`}
              dot={false}
              activeDot={false}
              strokeOpacity={0.4}
              isAnimationActive={false}
            />
            <Area
              type="natural"
              dataKey="b"
              name={labelB}
              stroke={`url(#${uid}-strokeB)`}
              strokeWidth={2.5}
              fill="none"
              isAnimationActive={false}
              dot={{ r: 3, fill: GRADIENT_B.from, stroke: "none" }}
              activeDot={{
                r: 5,
                fill: GRADIENT_B.from,
                stroke: `${GRADIENT_B.from}4D`,
                strokeWidth: 6,
              }}
            />
          </>
        )}

        {/* Line A (pink→purple) */}
        <Area
          type="natural"
          dataKey="a"
          name={labelA}
          stroke={`url(#${uid}-strokeA)`}
          strokeWidth={6}
          fill="none"
          filter={`url(#${uid}-glowA)`}
          dot={false}
          activeDot={false}
          strokeOpacity={0.5}
          isAnimationActive={false}
        />
        <Area
          type="natural"
          dataKey="a"
          name={labelA}
          stroke={`url(#${uid}-strokeA)`}
          strokeWidth={2.5}
          fill={isComparing ? "none" : `url(#${uid}-fillA)`}
          isAnimationActive={false}
          dot={{ r: 3, fill: GRADIENT_A.from, stroke: "none" }}
          activeDot={{
            r: 5,
            fill: GRADIENT_A.from,
            stroke: `${GRADIENT_A.from}4D`,
            strokeWidth: 6,
          }}
        />

        {!isComparing &&
          chartData.map((d) => (
            <ReferenceDot
              key={d.ageGroup}
              x={d.ageGroup}
              y={d.a}
              r={0}
              label={{
                value: `${d.a}%`,
                position: "top",
                fill: "rgba(255,255,255,0.9)",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "Source Sans 3",
                dy: -6,
              }}
            />
          ))}
      </AreaChart>
    </ResponsiveContainer>
  );
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
    const shadow =
      gradientIndex === 0 ? "#FF509B33" : "#0CC4EF33";
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

/* ── Legend ── */

function Legend({ labels }: { labels: [string, string] }) {
  return (
    <div className="flex items-center gap-4 font-body text-[13px] text-white/70">
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-0.5 w-4 rounded-full bg-gradient-to-r from-[#FF509B] to-[#9B00FF]" />
        {labels[0]}
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-0.5 w-4 rounded-full bg-gradient-to-r from-[#9B00FF] to-[#0CC4EF]" />
        {labels[1]}
      </span>
    </div>
  );
}

/* ── Lab Card (with ref for export) ── */

function LabCard({
  question: q,
  index,
  sliceKeyA,
  sliceKeyB,
  labelA,
  labelB,
  shortA,
  shortB,
  isComparing,
}: {
  question: LabQuestion;
  index: number;
  sliceKeyA: string;
  sliceKeyB?: string;
  labelA: string;
  labelB?: string;
  shortA: string;
  shortB?: string;
  isComparing: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const dataA = q.slices[sliceKeyA] ?? q.slices.all;
  const dataB = sliceKeyB ? q.slices[sliceKeyB] ?? q.slices.all : undefined;

  return (
    <div
      ref={cardRef}
      className="relative flex flex-col rounded-xl border border-white/[0.08] bg-[#1F1F1F] p-5 sm:p-6"
    >
      <div className="absolute top-4 right-4">
        <ChartExportButton
          targetRef={cardRef}
          filename={`guessary-${q.id}`}
        />
      </div>
      <div className="mb-2">
        <span className="text-2xl" role="img" aria-hidden="true">
          {q.emoji}
        </span>
      </div>
      <h3 className="mb-1 font-heading text-lg font-bold leading-snug text-white sm:text-xl">
        {q.displayQuestion}
      </h3>
      {q.headline && (
        <p className="mb-3 font-body text-[13px] leading-snug text-white/60">
          {q.headline}
        </p>
      )}
      <div className="mt-auto">
        {isComparing && labelB && (
          <div className="mb-2">
            <Legend labels={[labelA, labelB]} />
          </div>
        )}
        <LabChart
          dataA={dataA}
          dataB={dataB}
          labelA={labelA}
          labelB={labelB}
          shortA={shortA}
          shortB={shortB}
          isComparing={isComparing}
        />
      </div>

      {/* Brand */}
      <div className="mt-3 pt-3 border-t border-white/[0.06] flex justify-center">
        <SmittenBrandMark />
      </div>
    </div>
  );
}

/* ── Main export ── */

export default function GuessaryLabCards() {
  // market: which market chip is active ("all" by default)
  const [market, setMarket] = useState("all");
  // secondMarket: optional second market for comparison (only non-"all")
  const [secondMarket, setSecondMarket] = useState<string | null>(null);
  // splitGender: whether we're showing male vs female split
  const [splitGender, setSplitGender] = useState(false);
  // genderFilter: when comparing 2 markets, optionally filter by a gender
  const [genderFilter, setGenderFilter] = useState<string | null>(null);

  const handleMarketSelect = (key: string) => {
    if (key === "all") {
      // Reset to All
      setMarket("all");
      setSecondMarket(null);
      setGenderFilter(null);
      // Keep splitGender state — user can split All too
      return;
    }

    if (secondMarket) {
      // Already comparing two markets
      if (key === market) {
        // Deselect first market → promote second to first
        setMarket(secondMarket);
        setSecondMarket(null);
        setSplitGender(false);
        setGenderFilter(null);
        return;
      }
      if (key === secondMarket) {
        // Deselect second market
        setSecondMarket(null);
        setGenderFilter(null);
        return;
      }
      // Max 2 — do nothing
      return;
    }

    if (key === market) {
      // Deselect → go back to All
      setMarket("all");
      setSplitGender(false);
      setGenderFilter(null);
      return;
    }

    if (market !== "all") {
      // First market already selected, this becomes second
      setSecondMarket(key);
      setSplitGender(false); // can't split when comparing markets
      return;
    }

    // Select first market from All
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
  const chartState = deriveChartState(market, splitGender, secondMarket, genderFilter);
  const { sliceKeyA, sliceKeyB, labelA, labelB, shortA, shortB, isComparing } = chartState;

  return (
    <>
      {/* Controls */}
      <div className="col-span-1 sm:col-span-2 flex flex-col gap-4 mb-2">
        <div className="flex flex-col gap-3">
          {/* Market row (includes All) */}
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

              // Gradient: when 2 markets, color them
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
              // 2 markets → Male / Female filter chips
              GENDERS.map((g) => (
                <Chip
                  key={g.key}
                  label={g.label}
                  active={genderFilter === g.key}
                  onClick={() => handleGenderFilter(g.key)}
                />
              ))
            ) : (
              // All or 1 market → Split by gender toggle
              <Chip
                label="Split by gender"
                active={splitGender}
                onClick={handleSplitToggle}
              />
            )}
          </div>
        </div>

      </div>

      {/* Cards */}
      {LAB_QUESTIONS.map((q, idx) => (
        <LabCard
          key={q.id}
          question={q}
          index={idx}
          sliceKeyA={sliceKeyA}
          sliceKeyB={sliceKeyB}
          labelA={labelA}
          labelB={labelB}
          shortA={shortA}
          shortB={shortB}
          isComparing={isComparing}
        />
      ))}
    </>
  );
}
