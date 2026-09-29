"use client";

import { useState } from "react";
import { calculateFullResult, type TaxCalcResult } from "@/lib/tax-engine/calculate";
import type { CalculatorInput } from "@/lib/validation/calculator-input-schema";
import CalculatorForm from "./CalculatorForm";
import ResultDisplay from "./ResultDisplay";
import ExplanationPanel from "./ExplanationPanel";

export default function Calculator() {
  const [result, setResult] = useState<TaxCalcResult | null>(null);

  function handleCalculate(input: CalculatorInput) {
    // calculateFullResult() runs entirely client-side here -- no network
    // round trip for the number itself. The API route calls the exact
    // same function server-side when grounding the AI explanation, so
    // the two can never disagree.
    setResult(calculateFullResult(input));
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <CalculatorForm onCalculate={handleCalculate} />
      </div>

      {result && (
        <div className="flex flex-col gap-6">
          <ResultDisplay result={result} />
          <ExplanationPanel key={`${result.taxYear}-${result.grossEarnings}-${result.businessExpenses}-${result.filingStatus}`} result={result} />
        </div>
      )}
    </div>
  );
}
