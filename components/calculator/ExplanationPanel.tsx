"use client";

import { useState } from "react";
import type { TaxCalcResult } from "@/lib/tax-engine/calculate";
import type { ExplainResponse } from "@/app/api/calculate-explain/route";

type Status = "idle" | "loading" | "done" | "error";

/**
 * Renders entirely independently of ResultDisplay -- the numeric result
 * is already on screen (computed instantly, client-side) by the time
 * this panel does anything. This panel's own loading/error state never
 * blocks or hides that number; the worst case here is "no AI explanation
 * available right now," never "no result available."
 */
export default function ExplanationPanel({ result }: { result: TaxCalcResult }) {
  const [status, setStatus] = useState<Status>("idle");
  const [explanation, setExplanation] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [followUpQuestion, setFollowUpQuestion] = useState("");

  async function requestExplanation() {
    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/calculate-explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: {
            grossEarnings: result.grossEarnings,
            businessExpenses: result.businessExpenses,
            filingStatus: result.filingStatus,
            taxYear: result.taxYear,
          },
          followUpQuestion: followUpQuestion.trim() || undefined,
        }),
      });

      if (response.status === 429) {
        setStatus("error");
        setErrorMessage("You're asking too fast — try again in a minute.");
        return;
      }

      if (!response.ok) {
        setStatus("error");
        setErrorMessage("Something went wrong. Your numbers above are still accurate.");
        return;
      }

      const data: ExplainResponse = await response.json();

      if (data.explanation) {
        setStatus("done");
        setExplanation(data.explanation);
      } else {
        // The API route's own graceful-degradation contract -- a Groq
        // failure, surfaced here as a plain message, never as a blocked UI.
        setStatus("error");
        setErrorMessage(data.explanationError ?? "The AI explanation is temporarily unavailable.");
      }
    } catch {
      // Network-level failure (e.g. offline) -- same graceful handling.
      setStatus("error");
      setErrorMessage("Couldn't reach the AI explanation right now. Your numbers above are still accurate.");
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">AI explanation (optional)</p>

      {status === "idle" && (
        <div className="mt-3 flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Have a question about these numbers? (optional, one question)
            </span>
            <textarea
              value={followUpQuestion}
              onChange={(e) => setFollowUpQuestion(e.target.value.slice(0, 300))}
              maxLength={300}
              rows={2}
              placeholder="e.g. Why is my rate higher than I expected?"
              className="w-full resize-none rounded-lg border border-zinc-300 bg-white p-2.5 text-sm text-zinc-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </label>
          <button
            type="button"
            onClick={requestExplanation}
            className="self-start rounded-lg border border-teal-700 px-5 py-2 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-950/30"
          >
            Explain this in plain English
          </button>
        </div>
      )}

      {status === "loading" && (
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">Thinking…</p>
      )}

      {status === "done" && explanation && (
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {explanation}
        </p>
      )}

      {status === "error" && (
        <div className="mt-3 flex flex-col gap-2">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{errorMessage}</p>
          <button
            type="button"
            onClick={requestExplanation}
            className="self-start text-sm font-medium text-teal-700 underline underline-offset-2 hover:no-underline dark:text-teal-400"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
