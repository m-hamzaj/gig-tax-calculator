"use client";

import { useState } from "react";
import { CURRENT_TAX_YEAR, SUPPORTED_TAX_YEARS, getConstantsForYear } from "@/lib/tax-engine/constants";
import type { FilingStatus } from "@/lib/tax-engine/types";
import { calculateSelfEmploymentTax } from "@/lib/tax-engine/se-tax";
import { calculateW2PayrollTax } from "@/lib/tax-engine/w2-payroll-tax";
import { calculateFederalIncomeTax } from "@/lib/tax-engine/federal-income-tax";
import { payComparisonInputSchema, type PayComparisonInput } from "@/lib/validation/pay-comparison-input-schema";
import DisclaimerBanner from "@/components/calculator/DisclaimerBanner";

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white py-2.5 px-3 text-zinc-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";

const FILING_STATUS_LABELS: Record<FilingStatus, string> = {
  single: "Single",
  married_filing_jointly: "Married filing jointly",
  head_of_household: "Head of household",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

interface ComparisonResult {
  grossPay: number;
  oneOhNineNine: { payrollTax: number; federalIncomeTax: number; takeHome: number };
  w2: { payrollTax: number; federalIncomeTax: number; takeHome: number };
  /** The employer-match share a 1099 worker effectively pays themselves
   * that a W-2 employee's employer pays instead. The headline number. */
  ficaGap: number;
}

/**
 * Compares take-home pay at the SAME gross amount, assuming NO deductible
 * business expenses on the 1099 side -- a W-2 employee has none either, so
 * this keeps the comparison apples-to-apples. A 1099 worker who DOES have
 * real business expenses would come out relatively better than shown here;
 * that's disclosed in the paired guide, not modeled in this simplified
 * side-by-side.
 */
function compare(grossPay: number, filingStatus: FilingStatus, taxYear: number): ComparisonResult {
  const constants = getConstantsForYear(taxYear);
  const standardDeduction = constants.standardDeduction[filingStatus];

  const se = calculateSelfEmploymentTax(grossPay, filingStatus, constants);
  const oneOhNineNineTaxableIncome = Math.max(0, grossPay - se.halfSeTaxDeduction - standardDeduction);
  const oneOhNineNineFederalIncomeTax = calculateFederalIncomeTax(oneOhNineNineTaxableIncome, filingStatus, constants);

  const w2Payroll = calculateW2PayrollTax(grossPay, filingStatus, constants);
  const w2TaxableIncome = Math.max(0, grossPay - standardDeduction);
  const w2FederalIncomeTax = calculateFederalIncomeTax(w2TaxableIncome, filingStatus, constants);

  return {
    grossPay,
    oneOhNineNine: {
      payrollTax: se.seTax,
      federalIncomeTax: oneOhNineNineFederalIncomeTax,
      takeHome: grossPay - se.seTax - oneOhNineNineFederalIncomeTax,
    },
    w2: {
      payrollTax: w2Payroll.totalEmployeeWithholding,
      federalIncomeTax: w2FederalIncomeTax,
      takeHome: grossPay - w2Payroll.totalEmployeeWithholding - w2FederalIncomeTax,
    },
    ficaGap: se.seTax - w2Payroll.totalEmployeeWithholding,
  };
}

export default function PayComparisonCalculator() {
  const [grossPay, setGrossPay] = useState("");
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const [taxYear, setTaxYear] = useState(CURRENT_TAX_YEAR);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ComparisonResult | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed = payComparisonInputSchema.safeParse({
      grossPay: Number(grossPay),
      filingStatus,
      taxYear,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check your inputs.");
      return;
    }

    setError(null);
    const { grossPay: gp, filingStatus: fs, taxYear: ty }: PayComparisonInput = parsed.data;
    setResult(compare(gp, fs, ty));
  }

  return (
    <div className="flex flex-col gap-8">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Gross pay to compare</span>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                required
                value={grossPay}
                onChange={(e) => setGrossPay(e.target.value)}
                placeholder="60,000"
                className={`${inputClass} pl-7`}
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Filing status</span>
            <select
              value={filingStatus}
              onChange={(e) => setFilingStatus(e.target.value as FilingStatus)}
              className={inputClass}
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
            <select value={taxYear} onChange={(e) => setTaxYear(Number(e.target.value))} className={inputClass}>
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
          Compare take-home pay
        </button>
      </form>

      {result && (
        <div className="flex flex-col gap-5">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              The FICA gap, at {formatCurrency(result.grossPay)} gross
            </p>
            <p className="mt-1 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {formatCurrency(result.ficaGap)}
            </p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              What you pay as a 1099 worker that a W-2 employer would otherwise pay on your behalf.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-6 border-t border-zinc-200 pt-6 sm:grid-cols-2 dark:border-zinc-800">
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">1099 contractor</p>
                <dl className="mt-2 flex flex-col gap-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-zinc-500 dark:text-zinc-400">Self-employment tax</dt>
                    <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                      {formatCurrency(result.oneOhNineNine.payrollTax)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-zinc-500 dark:text-zinc-400">Federal income tax</dt>
                    <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                      {formatCurrency(result.oneOhNineNine.federalIncomeTax)}
                    </dd>
                  </div>
                  <div className="mt-1 flex justify-between border-t border-zinc-200 pt-1 dark:border-zinc-800">
                    <dt className="font-medium text-zinc-700 dark:text-zinc-300">Take-home</dt>
                    <dd className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {formatCurrency(result.oneOhNineNine.takeHome)}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">W-2 employee</p>
                <dl className="mt-2 flex flex-col gap-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-zinc-500 dark:text-zinc-400">FICA withholding</dt>
                    <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                      {formatCurrency(result.w2.payrollTax)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-zinc-500 dark:text-zinc-400">Federal income tax</dt>
                    <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                      {formatCurrency(result.w2.federalIncomeTax)}
                    </dd>
                  </div>
                  <div className="mt-1 flex justify-between border-t border-zinc-200 pt-1 dark:border-zinc-800">
                    <dt className="font-medium text-zinc-700 dark:text-zinc-300">Take-home</dt>
                    <dd className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {formatCurrency(result.w2.takeHome)}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            This assumes the same gross pay and no deductible business expenses on the 1099 side, to keep
            the comparison apples-to-apples — real 1099 work usually has deductible expenses a W-2 job
            doesn&apos;t, which narrows this gap. See{" "}
            <a href="/guides/1099-vs-w2" className="underline underline-offset-2 hover:no-underline">
              the guide
            </a>{" "}
            for what else differs (benefits, withholding timing, unemployment insurance).
          </p>

          <DisclaimerBanner />
        </div>
      )}
    </div>
  );
}
