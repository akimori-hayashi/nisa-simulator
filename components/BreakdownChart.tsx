"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { SimulationResult } from "@/types";
import { formatCurrencyCompact } from "@/lib/calculator";

interface Props {
  result: SimulationResult;
}

const COLORS = ["#3b82f6", "#10b981"];

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { percent: number } }>;
}) => {
  if (active && payload && payload.length) {
    const entry = payload[0];
    return (
      <div className="bg-slate-800 border border-slate-600 rounded-xl p-3 text-sm shadow-xl">
        <p className="text-white font-medium">{entry.name}</p>
        <p className="text-slate-400">{formatCurrencyCompact(entry.value)}</p>
        <p className="text-slate-400">
          {(entry.payload.percent * 100).toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
}) => {
  if (
    cx == null ||
    cy == null ||
    midAngle == null ||
    innerRadius == null ||
    outerRadius == null ||
    percent == null ||
    percent < 0.05
  )
    return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={13}
      fontWeight="bold"
    >
      {(percent * 100).toFixed(1)}%
    </text>
  );
};

export default function BreakdownChart({ result }: Props) {
  const { totalPrincipal, totalProfit, futureValue } = result;

  const data = [
    { name: "元本", value: totalPrincipal },
    { name: "運用益", value: totalProfit > 0 ? totalProfit : 0 },
  ];

  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-bold text-white mb-1">内訳</h2>
      <p className="text-xs text-slate-500 mb-4">元本と運用益の割合</p>

      <div
        className="relative h-48 sm:h-56"
        role="img"
        aria-label={`元本 ${totalPrincipal}円、運用益 ${totalProfit}円の円グラフ`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="45%"
              outerRadius="70%"
              dataKey="value"
              labelLine={false}
              label={renderCustomLabel}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-xs text-slate-400">総資産</div>
          <div className="text-base font-bold text-white tabular-nums">
            {formatCurrencyCompact(futureValue)}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-3">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-1.5 text-xs text-slate-300">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index] }}
            />
            {entry.name}
          </div>
        ))}
      </div>
    </div>
  );
}
