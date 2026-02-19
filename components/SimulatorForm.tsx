"use client";

import { SimulatorInput } from "@/types";
import { formatCurrency } from "@/lib/calculator";

interface Props {
  input: SimulatorInput;
  onChange: (input: SimulatorInput) => void;
}

interface SliderFieldProps {
  label: string;
  id: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
  unit?: string;
}

function SliderField({
  label,
  id,
  value,
  min,
  max,
  step,
  format,
  onChange,
  unit,
}: SliderFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-sm font-medium text-slate-300">
          {label}
        </label>
        <span className="text-sm font-bold text-emerald-400 tabular-nums">
          {format(value)}
          {unit && <span className="text-slate-400 font-normal ml-0.5">{unit}</span>}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 cursor-pointer"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
      />
      <div className="flex justify-between text-xs text-slate-500">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

export default function SimulatorForm({ input, onChange }: Props) {
  const update = (key: keyof SimulatorInput, value: number) => {
    onChange({ ...input, [key]: value });
  };

  return (
    <div className="glass-card p-6 space-y-6 sticky top-6">
      <div>
        <h2 className="text-lg font-bold text-white mb-1">シミュレーション設定</h2>
        <p className="text-xs text-slate-500">スライダーを動かすとリアルタイムで計算されます</p>
      </div>

      <SliderField
        label="月々の積立金額"
        id="monthly"
        value={input.monthly}
        min={1000}
        max={100000}
        step={1000}
        format={(v) => `${formatCurrency(v)}円`}
        onChange={(v) => update("monthly", v)}
      />

      <SliderField
        label="年間想定利回り"
        id="rate"
        value={input.rate}
        min={0.1}
        max={20}
        step={0.1}
        format={(v) => `${v.toFixed(1)}%`}
        onChange={(v) => update("rate", v)}
      />

      <SliderField
        label="積立期間"
        id="years"
        value={input.years}
        min={1}
        max={40}
        step={1}
        format={(v) => `${v}年`}
        onChange={(v) => update("years", v)}
      />

      <SliderField
        label="積立開始年齢"
        id="age"
        value={input.age}
        min={18}
        max={65}
        step={1}
        format={(v) => `${v}歳`}
        onChange={(v) => update("age", v)}
      />

      {/* Initial amount: number input */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label
            htmlFor="initial"
            className="text-sm font-medium text-slate-300"
          >
            現在の保有資産
            <span className="ml-1 text-xs text-slate-500">（任意）</span>
          </label>
          <span className="text-sm font-bold text-emerald-400 tabular-nums">
            {formatCurrency(input.initial)}円
          </span>
        </div>
        <input
          id="initial"
          type="number"
          min={0}
          max={10000000}
          step={10000}
          value={input.initial}
          onChange={(e) => {
            const v = Math.min(10000000, Math.max(0, Number(e.target.value)));
            update("initial", isNaN(v) ? 0 : v);
          }}
          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 tabular-nums"
          placeholder="0"
          aria-label="現在の保有資産"
        />
        <p className="text-xs text-slate-500">0〜10,000,000円</p>
      </div>

      {/* Summary */}
      <div className="pt-4 border-t border-slate-700 grid grid-cols-2 gap-3 text-center">
        <div className="bg-slate-700/40 rounded-xl p-3">
          <div className="text-xs text-slate-400 mb-1">積立終了年齢</div>
          <div className="text-xl font-bold text-white">
            {input.age + input.years}
            <span className="text-sm font-normal text-slate-400">歳</span>
          </div>
        </div>
        <div className="bg-slate-700/40 rounded-xl p-3">
          <div className="text-xs text-slate-400 mb-1">総積立回数</div>
          <div className="text-xl font-bold text-white">
            {input.years * 12}
            <span className="text-sm font-normal text-slate-400">回</span>
          </div>
        </div>
      </div>
    </div>
  );
}
