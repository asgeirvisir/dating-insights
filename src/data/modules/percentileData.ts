/**
 * Top-percentile like distribution data.
 *
 * Each market maps to an array of 5 tiers (index 0 = Top 10%, … 4 = Top 50%).
 * `male` / `female` = cumulative % of total likes captured by that percentile group.
 *
 * Source CSV columns: Gender, Country, Percentile_Group, Cumulative_Pct_of_Likes
 */

export interface PercentileEntry {
  male: number;
  female: number;
}

export type MarketKey = "all" | "denmark" | "iceland" | "norway" | "sweden";

export const PERCENTILE_LABELS = [
  "Top 10%",
  "Top 20%",
  "Top 30%",
  "Top 40%",
  "Top 50%",
] as const;

export const PERCENTILE_TICK_LABELS = [
  "10%",
  "20%",
  "30%",
  "40%",
  "50%",
] as const;

export const MARKET_OPTIONS: { key: MarketKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "denmark", label: "Denmark" },
  { key: "iceland", label: "Iceland" },
  { key: "norway", label: "Norway" },
  { key: "sweden", label: "Sweden" },
];

export const PERCENTILE_DATA: Record<MarketKey, PercentileEntry[]> = {
  denmark: [
    { male: 50.09, female: 22.52 },
    { male: 66.07, female: 35.21 },
    { male: 76.18, female: 46.10 },
    { male: 82.68, female: 56.45 },
    { male: 86.94, female: 65.80 },
  ],
  iceland: [
    { male: 45.16, female: 20.04 },
    { male: 60.43, female: 34.90 },
    { male: 70.49, female: 47.42 },
    { male: 76.02, female: 58.56 },
    { male: 80.10, female: 68.30 },
  ],
  norway: [
    { male: 47.20, female: 21.95 },
    { male: 63.98, female: 35.49 },
    { male: 76.00, female: 46.37 },
    { male: 82.90, female: 56.75 },
    { male: 88.21, female: 67.72 },
  ],
  sweden: [
    { male: 47.74, female: 24.43 },
    { male: 65.15, female: 38.83 },
    { male: 77.23, female: 50.25 },
    { male: 83.78, female: 60.86 },
    { male: 88.73, female: 71.28 },
  ],
  // Averaged across all four markets
  all: [
    { male: 47.5, female: 22.2 },
    { male: 63.9, female: 36.1 },
    { male: 75.0, female: 47.5 },
    { male: 81.3, female: 58.2 },
    { male: 86.0, female: 68.3 },
  ],
};
