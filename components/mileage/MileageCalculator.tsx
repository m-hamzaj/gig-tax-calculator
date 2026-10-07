"use client";

import { useState } from "react";
import { CURRENT_TAX_YEAR, SUPPORTED_TAX_YEARS, getConstantsForYear } from "@/lib/tax-engine/constants";
import { calculateMileageDeduction, type MileageDeductionResult } from "@/lib/tax-engine/mileage-deduction";
import { mileageInputSchema } from "@/lib/validation/mileage-input-schema";
import DisclaimerBanner from "@/components/calculator/DisclaimerBanner";

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white py-2.5 px-3 text-zinc-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatRate(rate: number): string {
  return `$${rate.toFixed(3).replace(/0$/, "")}/mile`;
}

export default function MileageCalculator() {
  const [taxYear, setTaxYear] = useState(CURRENT_TAX_YEAR);
  const [miles, setMiles] = useState<string[]>(() =>
    getConstantsForYear(CURRENT_TAX_YEAR).standardMileageRatePeriods.map(() => "")
  );
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MileageDeductionResult | null>(null);

  const periods = getConstantsForYear(taxYear).standardMileageRatePeriods;

  function handleYearChange(year: number) {
    setTaxYear(year);
    setMiles(getConstantsForYear(year).standardMileageRatePeriods.map(() => ""));
    setResult(null);
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed = mileageInputSchema.safeParse({
      taxYear,
      milesByPeriod: miles.map((m) => Number(m || 0)),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check your inputs.");
      return;
    }

    setError(null);
    setResult(calculateMileageDeduction(parsed.data.milesByPeriod, getConstantsForYear(parsed.data.taxYear)));
  }

  return (
    <div className="flex flex-col gap-8">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Tax year</span>
          <select value={taxYear} onChange={(e) => handleYearChange(Number(e.target.value))} className={inputClass}>
            {SUPPORTED_TAX_YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>

        {periods.length > 1 && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
            The IRS changed the mileage rate mid-year for {taxYear} — enter your miles for each period
            separately so the right rate applies to each.
          </p>
        )}

        {periods.map((period, i) => (
          <label key={period.from} className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Business miles driven, {formatDate(period.from)}–{formatDate(period.to)}{" "}
              <span className="font-normal text-zinc-500 dark:text-zinc-400">({formatRate(period.rate)})</span>
            </span>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              step="1"
              value={miles[i] ?? ""}
              onChange={(e) => setMiles((m) => m.map((v, idx) => (idx === i ? e.target.value : v)))}
              placeholder="5,000"
              className={inputClass}
            />
          </label>
        ))}

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-teal-700 py-3 font-semibold text-white transition-colors hover:bg-teal-800 sm:w-auto sm:self-start sm:px-8"
        >
          Calculate my deduction
        </button>
      </form>

      {result && (
        <div className="flex flex-col gap-5">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Mileage deduction ({taxYear})
            </p>
            <p className="mt-1 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {formatCurrency(result.totalDeduction)}
            </p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {result.totalMiles.toLocaleString()} business miles
            </p>

            {result.periods.length > 1 && (
              <div className="mt-6 grid grid-cols-1 gap-4 border-t border-zinc-200 pt-6 sm:grid-cols-2 dark:border-zinc-800">
                {result.periods.map((p) => (
                  <div key={p.from}>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {formatDate(p.from)}–{formatDate(p.to)}
                    </p>
                    <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                      {formatCurrency(p.deduction)}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {p.miles.toLocaleString()} miles × {formatRate(p.rate)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            This deduction reduces your net earnings before self-employment tax is calculated — plug it
            into business expenses on the{" "}
            <a href="/" className="underline underline-offset-2 hover:no-underline">
              tax estimator
            </a>{" "}
            to see the full effect.
          </p>

          <DisclaimerBanner />
        </div>
      )}
    </div>
  );
}
