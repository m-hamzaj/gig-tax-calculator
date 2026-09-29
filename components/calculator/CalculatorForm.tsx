"use client";

import { useState } from "react";
import { CURRENT_TAX_YEAR, SUPPORTED_TAX_YEARS, type FilingStatus } from "@/lib/tax-engine/calculate";
import { calculatorInputSchema, type CalculatorInput } from "@/lib/validation/calculator-input-schema";

const FILING_STATUS_LABELS: Record<FilingStatus, string> = {
  single: "Single",
  married_filing_jointly: "Married filing jointly",
  head_of_household: "Head of household",
};

interface Props {
  onCalculate: (input: CalculatorInput) => void;
}

export default function CalculatorForm({ onCalculate }: Props) {
  const [grossEarnings, setGrossEarnings] = useState("");
  const [businessExpenses, setBusinessExpenses] = useState("");
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const [taxYear, setTaxYear] = useState(CURRENT_TAX_YEAR);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed = calculatorInputSchema.safeParse({
      grossEarnings: Number(grossEarnings),
      businessExpenses: Number(businessExpenses || 0),
      filingStatus,
      taxYear,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check your inputs.");
      return;
    }

    setError(null);
    onCalculate(parsed.data);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Gross 1099 / self-employment earnings this year
          </span>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              required
              value={grossEarnings}
              onChange={(e) => setGrossEarnings(e.target.value)}
              placeholder="45,000"
              className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-7 pr-3 text-zinc-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Business expenses (mileage, supplies, etc.)
          </span>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              value={businessExpenses}
              onChange={(e) => setBusinessExpenses(e.target.value)}
              placeholder="5,000"
              className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-7 pr-3 text-zinc-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Filing status</span>
          <select
            value={filingStatus}
            onChange={(e) => setFilingStatus(e.target.value as FilingStatus)}
            className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 px-3 text-zinc-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            {Object.entries(FILING_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Tax year</span>
          <select
            value={taxYear}
            onChange={(e) => setTaxYear(Number(e.target.value))}
            className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 px-3 text-zinc-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            {SUPPORTED_TAX_YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full rounded-lg bg-teal-700 py-3 font-semibold text-white transition-colors hover:bg-teal-800 sm:w-auto sm:self-start sm:px-8"
      >
        Calculate my estimate
      </button>
    </form>
  );
}
