"use client";

import { YearlyData } from "@/types";
import { formatCurrency } from "@/lib/calculator";

interface Props {
  data: YearlyData[];
}

export default function YearlyTable({ data }: Props) {
  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-bold text-white mb-1">年別詳細</h2>
      <p className="text-xs text-slate-500 mb-4">各年末時点の積立状況</p>

      <div className="overflow-x-auto overflow-y-auto max-h-72 rounded-xl border border-slate-700">
        <table className="w-full text-sm min-w-[560px]" aria-label="年別積立詳細テーブル">
          <thead className="sticky top-0 bg-slate-800 z-10">
            <tr>
              <th
                scope="col"
                className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider"
              >
                年数
              </th>
              <th
                scope="col"
                className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider"
              >
                年齢
              </th>
              <th
                scope="col"
                className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider"
              >
                元本累計
              </th>
              <th
                scope="col"
                className="text-right px-4 py-3 text-xs font-semibold text-emerald-400/70 uppercase tracking-wider"
              >
                運用益
              </th>
              <th
                scope="col"
                className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider"
              >
                総資産
              </th>
              <th
                scope="col"
                className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider"
              >
                前年比
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {data.map((row, idx) => {
              const yoy =
                row.prevTotal > 0
                  ? ((row.total - row.prevTotal) / row.prevTotal) * 100
                  : 0;
              const isEven = idx % 2 === 0;

              return (
                <tr
                  key={row.year}
                  className={`${
                    isEven ? "bg-slate-800/20" : "bg-transparent"
                  } hover:bg-slate-700/30 transition-colors`}
                >
                  <td className="px-4 py-2.5 text-slate-300 tabular-nums font-medium">
                    {row.year}年目
                  </td>
                  <td className="px-4 py-2.5 text-slate-300 tabular-nums">
                    {row.age}歳
                  </td>
                  <td className="px-4 py-2.5 text-right text-slate-200 tabular-nums">
                    {formatCurrency(row.principal)}円
                  </td>
                  <td className="px-4 py-2.5 text-right text-emerald-400 tabular-nums">
                    +{formatCurrency(row.profit)}円
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold text-white tabular-nums">
                    {formatCurrency(row.total)}円
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums">
                    <span
                      className={
                        yoy >= 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      }
                    >
                      {yoy >= 0 ? "+" : ""}{yoy.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
