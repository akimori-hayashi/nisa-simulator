"use client";

import { SimulationResult, SimulatorInput } from "@/types";
import { formatCurrency, formatCurrencyCompact } from "@/lib/calculator";

interface Props {
  result: SimulationResult;
  input: SimulatorInput;
}

interface CardProps {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  gold?: boolean;
}

function StatCard({ label, value, sub, accent, gold }: CardProps) {
  return (
    <div
      className={`rounded-xl p-4 ${
        accent
          ? "bg-emerald-500/10 border border-emerald-500/30"
          : gold
          ? "bg-amber-500/10 border border-amber-500/30"
          : "bg-slate-700/40 border border-slate-700"
      }`}
    >
      <div className="text-xs text-slate-400 mb-1">{label}</div>
      <div
        className={`font-bold leading-tight ${
          accent
            ? "text-emerald-400"
            : gold
            ? "text-amber-400"
            : "text-white"
        } ${accent ? "text-2xl" : "text-lg"}`}
      >
        {value}
      </div>
      {sub && <div className="text-xs text-slate-500 mt-0.5">{sub}</div>}
    </div>
  );
}

export default function ResultSummary({ result, input }: Props) {
  const {
    futureValue,
    totalPrincipal,
    totalProfit,
    gainRate,
    taxSaving,
    endAge,
  } = result;

  const multiple = totalPrincipal > 0 ? (futureValue / totalPrincipal).toFixed(2) : "0";

  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-bold text-white mb-4">シミュレーション結果</h2>

      {/* Main result - large emphasis */}
      <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 rounded-2xl p-6 mb-4 text-center">
        <div className="text-sm text-slate-400 mb-2">最終積立総資産</div>
        <div className="text-4xl sm:text-5xl font-bold text-emerald-400 tabular-nums leading-tight">
          {formatCurrencyCompact(futureValue)}
        </div>
        <div className="text-slate-400 text-sm mt-2 tabular-nums">
          {formatCurrency(futureValue)}円
        </div>
        <div className="mt-3 inline-flex items-center gap-2 bg-emerald-500/10 rounded-full px-3 py-1 text-xs text-emerald-400">
          <span>元本の {multiple} 倍</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard
          label="元本合計"
          value={formatCurrencyCompact(totalPrincipal)}
          sub={`${formatCurrency(totalPrincipal)}円`}
        />
        <StatCard
          label="運用益合計"
          value={formatCurrencyCompact(totalProfit)}
          sub={`+${gainRate.toFixed(1)}%`}
          accent
        />
        <StatCard
          label="NISA非課税メリット"
          value={formatCurrencyCompact(taxSaving)}
          sub="課税口座との差額（参考）"
          gold
        />
        <StatCard
          label="積立終了時の年齢"
          value={`${endAge}歳`}
          sub={`開始${input.age}歳 → 終了${endAge}歳`}
        />
        <StatCard
          label="月々の積立金額"
          value={`${formatCurrency(input.monthly)}円`}
          sub={`年間 ${formatCurrency(input.monthly * 12)}円`}
        />
        <StatCard
          label="年間利回り"
          value={`${input.rate.toFixed(1)}%`}
          sub={`${input.years}年間`}
        />
      </div>
    </div>
  );
}
