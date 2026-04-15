"use client";

import { useId } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AgeBreakdownChartProps {
  dataA: Record<string, number>;
  dataB?: Record<string, number>;
  labelA?: string;
  labelB?: string;
  shortA?: string;
  shortB?: string;
  isComparing?: boolean;
}

const AGE_GROUPS = ["18-24", "25-34", "35-44", "45+"];

const GRADIENT_A = { from: "#FF509B", to: "#9B00FF" }; // pink → purple
const GRADIENT_B = { from: "#0CC4EF", to: "#9B00FF" }; // cyan → purple

/* ── Tooltip ── */

function ChartTooltip({
  active,
  payload,
  shortA,
  shortB,
}: {
  active?: boolean;
  payload?: { value: number; dataKey: string }[];
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
  if (unique.length === 1) {
    return (
      <div className="rounded-md bg-white/10 backdrop-blur-sm border border-white/10 px-2.5 py-1 shadow-lg">
        <p className="font-body text-sm font-semibold text-white tabular-nums">
          {unique[0].value}%
        </p>
      </div>
    );
  }
  const aEntry = unique.find((p) => p.dataKey === "a");
  const bEntry = unique.find((p) => p.dataKey === "b");
  return (
    <div className="rounded-md bg-white/10 backdrop-blur-sm border border-white/10 px-3 py-1.5 shadow-lg">
      <p className="font-body text-sm text-white tabular-nums">
        {aEntry && (
          <span>
            <span style={{ color: "#FF509B" }} className="opacity-70">{shortA}</span>{" "}
            <span style={{ color: "#FF509B" }} className="font-semibold">{aEntry.value}%</span>
          </span>
        )}
        {aEntry && bEntry && (
          <span className="mx-1.5 text-white/25">vs</span>
        )}
        {bEntry && (
          <span>
            <span style={{ color: "#0CC4EF" }} className="opacity-70">{shortB}</span>{" "}
            <span style={{ color: "#0CC4EF" }} className="font-semibold">{bEntry.value}%</span>
          </span>
        )}
      </p>
    </div>
  );
}

/* ── Legend ── */

export function ChartLegend({ labels }: { labels: [string, string] }) {
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

/* ── Chart ── */

export default function AgeBreakdownChart({
  dataA,
  dataB,
  shortA = "",
  shortB,
  isComparing = false,
}: AgeBreakdownChartProps) {
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
          content={<ChartTooltip shortA={shortA} shortB={shortB} />}
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

        {/* Line A (pink→purple) — glow */}
        <Area
          type="natural"
          dataKey="a"
          stroke={`url(#${uid}-strokeA)`}
          strokeWidth={6}
          fill="none"
          filter={`url(#${uid}-glowA)`}
          dot={false}
          activeDot={false}
          strokeOpacity={0.5}
          isAnimationActive={false}
        />
        {/* Line A — main */}
        <Area
          type="natural"
          dataKey="a"
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

      </AreaChart>
    </ResponsiveContainer>
  );
}
