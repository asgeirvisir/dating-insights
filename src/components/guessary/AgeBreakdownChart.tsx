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
  data: Record<string, number>;
}

const AGE_GROUPS = ["18-24", "25-34", "35-44", "45+"];

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg bg-surface-elevated px-3 py-2 shadow-lg">
      <p className="font-body text-sm text-content-primary">
        <span className="text-content-muted">{label}:</span> {payload[0].value}%
      </p>
    </div>
  );
}

export default function AgeBreakdownChart({ data }: AgeBreakdownChartProps) {
  const gradientId = `pinkGradient-${useId()}`;
  const chartData = AGE_GROUPS.map((group) => ({
    ageGroup: group,
    value: data[group] ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF509B" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#FF509B" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#434343"
          vertical={false}
        />
        <XAxis
          dataKey="ageGroup"
          tick={{ fill: "#8D8D8D", fontSize: 12, fontFamily: "Source Sans 3" }}
          axisLine={{ stroke: "#434343" }}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: "#8D8D8D", fontSize: 12, fontFamily: "Source Sans 3" }}
          axisLine={false}
          tickLine={false}
          width={35}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#FF509B"
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={{ r: 4, fill: "#FF509B", stroke: "#1C1C1C", strokeWidth: 2 }}
          activeDot={{ r: 6, fill: "#FF509B", stroke: "#1C1C1C", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
