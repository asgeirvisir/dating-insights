"use client";

import { useState } from "react";
import {
  PERCENTILE_DATA,
  PERCENTILE_LABELS,
  PERCENTILE_TICK_LABELS,
  MARKET_OPTIONS,
  type MarketKey,
} from "@/data/modules/percentileData";

/* ── Brand gradients (same as GuessaryLabCards) ── */

const GRADIENT_PINK_PURPLE = { from: "#FF509B", to: "#9B00FF" };

/* ── Chip (duplicated from GuessaryLabCards — private there) ── */

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const base =
    "cursor-pointer rounded-full px-3.5 py-1.5 font-body text-sm font-medium transition-all duration-200 border min-h-[36px] ";

  const classes = active
    ? base + "bg-white text-[#0A0A0F] border-transparent"
    : base +
      "border-white/10 text-white/50 hover:border-white/20 hover:text-white/70";

  return (
    <button onClick={onClick} className={classes}>
      {label}
    </button>
  );
}

/* ── Percentile Slider ── */

function PercentileSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (idx: number) => void;
}) {
  const fillPercent = (value / 4) * 100;

  return (
    <div className="flex items-center gap-3">
      <span className="font-body text-xs uppercase tracking-wider text-white/30 mr-1 w-14 shrink-0">
        Top %
      </span>
      <div className="flex-1 flex flex-col">
        {/* Track + thumb */}
        <div className="relative h-9 flex items-center">
          {/* Gradient fill */}
          <div
            className="absolute top-1/2 left-0 h-1.5 rounded-full -translate-y-1/2 pointer-events-none opacity-70"
            style={{
              width: `calc(${fillPercent}% + 14px)`,
              background: `linear-gradient(90deg, ${GRADIENT_PINK_PURPLE.from}, ${GRADIENT_PINK_PURPLE.to})`,
            }}
          />
          {/* Native range input */}
          <input
            type="range"
            min={0}
            max={4}
            step={1}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="percentile-slider relative z-10 w-full"
          />
        </div>
        {/* Tick labels */}
        <div className="flex justify-between px-0.5 -mt-0.5">
          {PERCENTILE_TICK_LABELS.map((tick, i) => (
            <button
              key={tick}
              onClick={() => onChange(i)}
              className={`font-body text-[11px] transition-colors cursor-pointer w-10 text-center ${
                i === value
                  ? "text-white/70 font-semibold"
                  : "text-white/25 hover:text-white/50"
              }`}
            >
              {tick}
            </button>
          ))}
        </div>
      </div>
      {/* Current value badge */}
      <div className="font-body text-sm font-semibold text-white/90 bg-white/[0.08] rounded-lg px-2.5 py-1.5 min-w-[72px] text-center shrink-0">
        {PERCENTILE_LABELS[value]}
      </div>
    </div>
  );
}

/* ── Comparison Bar ── */

function ComparisonBar({
  label,
  value,
  gradient,
  glowColor,
}: {
  label: string;
  value: number;
  gradient: string;
  glowColor: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 text-xs text-white/40 text-right shrink-0 font-body">
        {label}
      </div>
      <div className="flex-1 h-8 bg-white/5 rounded-lg overflow-hidden">
        <div
          className="h-full rounded-lg flex items-center justify-end pr-2.5 transition-[width] duration-400 ease-out min-w-[48px]"
          style={{
            width: `${value}%`,
            background: gradient,
            boxShadow: `0 0 20px ${glowColor}`,
          }}
        >
          <span className="text-[13px] font-bold text-white font-body tabular-nums">
            {Math.round(value)}%
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Main export ── */

export default function PercentileHeroCard() {
  const [market, setMarket] = useState<MarketKey>("all");
  const [percentileIdx, setPercentileIdx] = useState(0);

  const entry = PERCENTILE_DATA[market][percentileIdx];
  const percentileLabel = PERCENTILE_LABELS[percentileIdx];
  const marketLabel =
    MARKET_OPTIONS.find((m) => m.key === market)?.label ?? "All";

  // Insight ratio
  const ratio = (entry.male / entry.female).toFixed(1);
  let comparison: string;
  if (Number(ratio) >= 1.9) {
    comparison = "more than double";
  } else if (Number(ratio) >= 1.4) {
    comparison = `nearly ${ratio}x`;
  } else {
    comparison = `${ratio}x`;
  }

  const marketSuffix = market === "all" ? "" : ` in ${marketLabel}`;

  return (
    <div className="w-full max-w-[580px]">
      {/* Slider custom styles */}
      <style>{`
        .percentile-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.08);
          outline: none;
          cursor: pointer;
        }
        .percentile-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF509B, #9B00FF);
          box-shadow: 0 0 16px rgba(255, 80, 155, 0.4),
            0 0 32px rgba(155, 0, 255, 0.2);
          cursor: grab;
          border: 3px solid #1c1c1c;
          transition: box-shadow 0.2s;
        }
        .percentile-slider::-webkit-slider-thumb:hover {
          box-shadow: 0 0 20px rgba(255, 80, 155, 0.6),
            0 0 40px rgba(155, 0, 255, 0.3);
        }
        .percentile-slider::-webkit-slider-thumb:active {
          cursor: grabbing;
        }
        .percentile-slider::-moz-range-thumb {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF509B, #9B00FF);
          box-shadow: 0 0 16px rgba(255, 80, 155, 0.4),
            0 0 32px rgba(155, 0, 255, 0.2);
          cursor: grab;
          border: 3px solid #1c1c1c;
        }
        .percentile-slider::-moz-range-track {
          height: 6px;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.08);
          border: none;
        }
      `}</style>

      <div className="rounded-xl border border-white/10 bg-white/5 p-5 sm:p-6">
        {/* ── Filters ── */}
        <div className="flex flex-col gap-3.5 mb-7">
          {/* Market chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-body text-xs uppercase tracking-wider text-white/30 mr-1 w-14">
              Market
            </span>
            {MARKET_OPTIONS.map((m) => (
              <Chip
                key={m.key}
                label={m.label}
                active={market === m.key}
                onClick={() => setMarket(m.key)}
              />
            ))}
          </div>

          {/* Percentile slider */}
          <PercentileSlider
            value={percentileIdx}
            onChange={setPercentileIdx}
          />
        </div>

        {/* ── Hero number ── */}
        <div className="text-center mb-7">
          <div
            className="font-body text-[80px] leading-none font-extrabold"
            style={{
              background: `linear-gradient(135deg, ${GRADIENT_PINK_PURPLE.from}, ${GRADIENT_PINK_PURPLE.to})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {Math.round(entry.male)}%
          </div>
          <p className="font-body text-[15px] text-white/50 mt-2 leading-relaxed">
            of all likes{marketSuffix} go to the{" "}
            <span className="text-white font-semibold">{percentileLabel}</span>{" "}
            of profiles
          </p>
        </div>

        {/* ── Comparison bars ── */}
        <div className="max-w-[420px] mx-auto flex flex-col gap-3">
          <ComparisonBar
            label="Male"
            value={entry.male}
            gradient="linear-gradient(90deg, #9B00FF, #c040ff)"
            glowColor="rgba(155, 0, 255, 0.3)"
          />
          <ComparisonBar
            label="Female"
            value={entry.female}
            gradient="linear-gradient(90deg, #FF509B, #ff7eb5)"
            glowColor="rgba(255, 80, 155, 0.3)"
          />
        </div>

        {/* ── Insight ── */}
        <p className="text-center mt-5 pt-4 border-t border-white/[0.06] font-body text-[13px] text-white/35 leading-relaxed">
          The {percentileLabel.toLowerCase()} of male profiles{marketSuffix}{" "}
          receive{" "}
          <span className="text-white/70 font-semibold">{comparison}</span> the
          share compared to female profiles
        </p>
      </div>
    </div>
  );
}
