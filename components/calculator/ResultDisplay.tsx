import type { TaxCalcResult } from "@/lib/tax-engine/calculate";
import DisclaimerBanner from "./DisclaimerBanner";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function formatDate(iso: string): string {
  // Parsed as UTC-noon to avoid a browser-timezone off-by-one on the
  // displayed calendar date for a plain YYYY-MM-DD string.
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Renders purely from a TaxCalcResult already computed -- works
 * identically whether that result came from an instant client-side
 * calculateFullResult() call or from the API route's response. Never
 * blocked by, or dependent on, whether an AI explanation is available --
 * see ExplanationPanel.tsx, which renders independently below this.
 */
export default function ResultDisplay({ result }: { result: TaxCalcResult }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Total estimated tax owed ({result.taxYear})
        </p>
        <p className="mt-1 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {formatCurrency(result.totalEstimatedTax)}
        </p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {result.effectiveRate}% effective rate on {formatCurrency(result.netEarnings)} net earnings
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-zinc-200 pt-6 sm:grid-cols-2 dark:border-zinc-800">
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Self-employment tax</p>
            <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {formatCurrency(result.seTax)}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Social Security + Medicare</p>
          </div>
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Estimated federal income tax</p>
            <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {formatCurrency(result.estimatedFederalIncomeTax)}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Quarterly estimated payments
        </p>
        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
          Split evenly across the year&apos;s four IRS due dates. Actual quarters aren&apos;t equal
          length — the IRS doesn&apos;t require equal payments either, this is a simplifying estimate.
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {result.quarterlyPayments.map((q) => (
            <div key={q.label}>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {q.label} · {formatDate(q.dueDate)}
              </dt>
              <dd className="mt-0.5 font-semibold text-zinc-900 dark:text-zinc-50">
                {formatCurrency(q.amount)}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <DisclaimerBanner />
    </div>
  );
}
