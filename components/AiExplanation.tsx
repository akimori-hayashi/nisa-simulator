"use client";

import { useState, useRef } from "react";
import { SimulatorInput, SimulationResult } from "@/types";

interface Props {
  input: SimulatorInput;
  result: SimulationResult;
}

export default function AiExplanation({ input, result }: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const handleExplain = async () => {
    if (loading) return;

    setText("");
    setError(null);
    setDone(false);
    setLoading(true);

    abortRef.current = new AbortController();

    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monthly: input.monthly,
          rate: input.rate,
          years: input.years,
          age: input.age,
          initial: input.initial,
          result: {
            totalPrincipal: result.totalPrincipal,
            futureValue: result.futureValue,
            totalProfit: result.totalProfit,
            gainRate: result.gainRate,
            taxSaving: result.taxSaving,
          },
        }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`サーバーエラー: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("レスポンスが空です");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;
        const chunk = decoder.decode(value, { stream: true });
        setText((prev) => prev + chunk);
      }

      setDone(true);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(
        err instanceof Error ? err.message : "予期しないエラーが発生しました"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 flex flex-col gap-4 h-full">
      <div>
        <h2 className="text-lg font-bold text-white mb-1">AI解説</h2>
        <p className="text-xs text-slate-500">
          FPアシスタントがあなたの結果を解説します
        </p>
      </div>

      <button
        onClick={handleExplain}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-semibold px-4 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-900/30"
        aria-label="AIに結果を説明してもらう"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>解説を生成中...</span>
          </>
        ) : (
          <>
            <span>✨</span>
            <span>AIに結果を説明してもらう</span>
          </>
        )}
      </button>

      {error && (
        <div
          className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm"
          role="alert"
        >
          {error}
        </div>
      )}

      {(text || loading) && (
        <div
          className="bg-slate-700/30 rounded-xl p-4 text-sm text-slate-200 leading-relaxed min-h-[80px]"
          aria-live="polite"
          aria-label="AI解説テキスト"
        >
          {text}
          {loading && !done && (
            <span className="inline-block w-0.5 h-4 bg-emerald-400 animate-pulse ml-0.5 align-middle" />
          )}
        </div>
      )}
    </div>
  );
}
