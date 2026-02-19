"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SimulatorInput, SimulationResult } from "@/types";
import { calculate } from "@/lib/calculator";
import SimulatorForm from "@/components/SimulatorForm";
import ResultSummary from "@/components/ResultSummary";
import GrowthChart from "@/components/GrowthChart";
import BreakdownChart from "@/components/BreakdownChart";
import YearlyTable from "@/components/YearlyTable";
import AiExplanation from "@/components/AiExplanation";
import ShareButton from "@/components/ShareButton";

const DEFAULT_INPUT: SimulatorInput = {
  monthly: 33333,
  rate: 5,
  years: 20,
  age: 30,
  initial: 0,
};

function sanitizeNumber(value: string | null, fallback: number): number {
  if (value === null) return fallback;
  const num = Number(value);
  return isFinite(num) ? num : fallback;
}

function SimulatorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [input, setInput] = useState<SimulatorInput>(() => ({
    monthly: sanitizeNumber(searchParams.get("monthly"), DEFAULT_INPUT.monthly),
    rate: sanitizeNumber(searchParams.get("rate"), DEFAULT_INPUT.rate),
    years: sanitizeNumber(searchParams.get("years"), DEFAULT_INPUT.years),
    age: sanitizeNumber(searchParams.get("age"), DEFAULT_INPUT.age),
    initial: sanitizeNumber(searchParams.get("initial"), DEFAULT_INPUT.initial),
  }));

  const [result, setResult] = useState<SimulationResult>(() =>
    calculate(input)
  );
  const [showResults, setShowResults] = useState(false);

  const updateURL = useCallback(
    (newInput: SimulatorInput) => {
      const params = new URLSearchParams({
        monthly: String(Math.round(newInput.monthly)),
        rate: String(newInput.rate),
        years: String(Math.round(newInput.years)),
        age: String(Math.round(newInput.age)),
        initial: String(Math.round(newInput.initial)),
      });
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router]
  );

  const handleInputChange = useCallback(
    (newInput: SimulatorInput) => {
      setInput(newInput);
      const newResult = calculate(newInput);
      setResult(newResult);
      updateURL(newInput);
      setShowResults(true);
    },
    [updateURL]
  );

  useEffect(() => {
    setShowResults(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800/50 to-emerald-950/30 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-emerald-400 text-sm font-medium mb-4">
            <span>📈</span>
            <span>つみたてNISA シミュレーター</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
            複利の力で
            <span className="text-emerald-400"> 資産を育てよう</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            毎月の積立金額・利回り・期間を設定して、
            <br className="hidden sm:block" />
            将来の資産をシミュレーションしましょう
          </p>
        </header>

        {/* Main grid */}
        <div className="grid lg:grid-cols-[380px_1fr] gap-6">
          {/* Left: Form */}
          <aside>
            <SimulatorForm input={input} onChange={handleInputChange} />
          </aside>

          {/* Right: Results */}
          <main className="space-y-6">
            {showResults && (
              <>
                <div className="animate-fade-in-up">
                  <ResultSummary result={result} input={input} />
                </div>

                <div
                  className="animate-fade-in-up"
                  style={{ animationDelay: "0.1s" }}
                >
                  <GrowthChart data={result.yearlyData} />
                </div>

                <div
                  className="grid sm:grid-cols-2 gap-6 animate-fade-in-up"
                  style={{ animationDelay: "0.2s" }}
                >
                  <BreakdownChart result={result} />
                  <div className="flex flex-col gap-6">
                    <AiExplanation input={input} result={result} />
                    <ShareButton />
                  </div>
                </div>

                <div
                  className="animate-fade-in-up"
                  style={{ animationDelay: "0.3s" }}
                >
                  <YearlyTable data={result.yearlyData} />
                </div>
              </>
            )}
          </main>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-slate-500 text-xs">
          <p>
            ※ このシミュレーターは参考値です。実際の運用成果を保証するものではありません。
          </p>
          <p className="mt-1">
            投資は自己責任で行い、必要に応じて専門家にご相談ください。
          </p>
        </footer>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
          <div className="text-emerald-400 text-lg">読み込み中...</div>
        </div>
      }
    >
      <SimulatorContent />
    </Suspense>
  );
}
