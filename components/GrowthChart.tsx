"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { YearlyData } from "@/types";

interface Props {
  data: YearlyData[];
}

function formatYAxis(value: number): string {
  if (value >= 100000000) return `${(value / 100000000).toFixed(0)}億`;
  if (value >= 10000) return `${(value / 10000).toFixed(0)}万`;
  return String(value);
}

function formatTooltipValue(value: number): string {
  if (value >= 100000000)
    return `${(value / 100000000).toFixed(2)}億円 (${(value / 10000).toFixed(0)}万円)`;
  return `${Math.round(value / 10000).toLocaleString("ja-JP")}万円`;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: number;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-600 rounded-xl p-3 text-sm shadow-xl">
        <p className="text-slate-300 font-medium mb-2">{label}年目</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-400">{entry.name}:</span>
            <span className="text-white font-medium tabular-nums">
              {formatTooltipValue(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function GrowthChart({ data }: Props) {
  const chartData = [
    { year: 0, 元本累計: data[0]?.principal - data[0]?.profit || 0, 総資産: 0 },
    ...data.map((d) => ({
      year: d.year,
      元本累計: d.principal,
      総資産: d.total,
    })),
  ];

  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-bold text-white mb-1">積み立て推移グラフ</h2>
      <p className="text-xs text-slate-500 mb-4">元本と運用益の積み上がりを確認できます</p>
      <div className="h-64 sm:h-80" role="img" aria-label="積み立て推移グラフ">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="year"
              stroke="#64748b"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickFormatter={(v) => `${v}年`}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickFormatter={formatYAxis}
              width={55}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: "16px", fontSize: "12px", color: "#94a3b8" }}
            />
            <Area
              type="monotone"
              dataKey="元本累計"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorPrincipal)"
              stackId="1"
            />
            <Area
              type="monotone"
              dataKey="総資産"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#colorTotal)"
              stackId="2"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
