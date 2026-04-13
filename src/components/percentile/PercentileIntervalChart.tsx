"use client";

import { useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  PERCENTILE_DATA,
  MARKET_OPTIONS,
  type MarketKey,
} from "@/data/modules/percentileData";
import { SmittenBrandMark } from "@/components/ui/SmittenBrand";
import ChartExportButton from "@/components/ui/ChartExportButton";

/* ── Derive interval (marginal) data from cumulative ── */

function deriveIntervalData(market: MarketKey) {
  const cumulative = PERCENTILE_DATA[market];
  return [
    {
      bucket: "Top 10%",
      male: +cumulative[0].male.toFixed(1),
      female: +cumulative[0].female.toFixed(1),
    },
    ...cumulative.slice(1).map((entry, i) => ({
      bucket: `${(i + 1) * 10 + 1}–${(i + 2) * 10}%`,
      male: +(entry.male - cumulative[i].male).toFixed(1),
      female: +(entry.female - cumulative[i].female).toFixed(1),
    })),
  ];
}

/* ── Custom tooltip ── */

function IntervalTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; dataKey: string; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md bg-neutral-950/95 border border-white/[0.08] px-3 py-2 shadow-xl backdrop-blur-sm">
      <p className="font-body text-xs uppercase tracking-wider text-white/60 mb-1">
        {label} of profiles
      </p>
      <div className="flex flex-col gap-0.5">
        {payload.map((p) => (
          <div
            key={p.dataKey}
            className="flex items-baseline gap-2 font-body text-sm tabular-nums"
          >
            <span className="font-semibold" style={{ color: p.color }}>
              {p.value}%
            </span>
            <span className="text-white/60 text-[13px]">
              of {p.dataKey === "male" ? "male" : "female"} likes
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main export ── */

export default function PercentileIntervalChart() {
  const [market, setMarket] = useState<MarketKey>("all");
  const chartRef = useRef<HTMLDivElement>(null);
  const intervalData = deriveIntervalData(market);
  const malePeak = intervalData[0];
  const femalePeak = intervalData[0];

  return (
    <div className="w-full max-w-[720px]">
      <div ref={chartRef} className="relative rounded-xl border border-white/[0.08] bg-[#1F1F1F] p-4 sm:p-5">
        {/* Header row: legend + market chips + export */}
        <div className="flex flex-wrap items-center justify-between gap-y-3 mb-5">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <span
                className="block h-3 w-3 rounded-[2px]"
                style={{ background: "#9B00FF" }}
              />
              <span className="font-body text-[13px] tracking-wide text-white/70">
                Male likes
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="block h-3 w-3 rounded-[2px]"
                style={{ background: "#FF509B" }}
              />
              <span className="font-body text-[13px] tracking-wide text-white/70">
                Female likes
              </span>
            </div>
          </div>

          {/* Market chips + export */}
          <div className="flex items-center gap-1.5">
            {MARKET_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setMarket(opt.key)}
                className={`font-body text-[13px] tracking-wide px-2.5 py-1 rounded-full transition-colors ${
                  market === opt.key
                    ? "bg-white/12 text-white/90"
                    : "text-white/55 hover:text-white/70 hover:bg-white/[0.05]"
                }`}
              >
                {opt.label}
              </button>
            ))}
            <ChartExportButton
              targetRef={chartRef}
              filename="percentile-distribution"
            />
          </div>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={intervalData}
            margin={{ top: 8, right: 8, left: -4, bottom: 0 }}
            barGap={2}
            barCategoryGap="20%"
          >
            <defs>
              <linearGradient id="gradMale" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9B00FF" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#9B00FF" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="gradFemale" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF509B" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#FF509B" stopOpacity={0.3} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="bucket"
              tick={{
                fill: "#A4A4A4",
                fontSize: 12,
                fontFamily: "Source Sans 3",
              }}
              axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
              tickLine={false}
              dy={6}
            />
            <YAxis
              domain={[0, 55]}
              ticks={[0, 10, 20, 30, 40, 50]}
              tick={{
                fill: "#A4A4A4",
                fontSize: 11,
                fontFamily: "Source Sans 3",
              }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `${v}%`}
              dx={-2}
              width={36}
            />
            <Tooltip
              content={<IntervalTooltip />}
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
            />

            <Bar
              dataKey="male"
              fill="url(#gradMale)"
              radius={[3, 3, 0, 0]}
              isAnimationActive={false}
            />

            <Bar
              dataKey="female"
              fill="url(#gradFemale)"
              radius={[3, 3, 0, 0]}
              isAnimationActive={false}
            />

          </BarChart>
        </ResponsiveContainer>

        {/* Insight */}
        <p className="mt-3 pt-3 border-t border-white/[0.08] font-body text-[13px] text-white/60 leading-relaxed">
          The top 10% of male profiles receive{" "}
          <span className="text-white/85 font-semibold">
            {malePeak.male}%
          </span>{" "}
          of all male likes. The top 10% of female profiles receive{" "}
          <span className="text-white/85 font-semibold">
            {femalePeak.female}%
          </span>
          . The gap narrows as you move down the ranks.
        </p>

        {/* Brand */}
        <div className="mt-3 flex justify-center">
          <SmittenBrandMark />
        </div>
      </div>
    </div>
  );
}
