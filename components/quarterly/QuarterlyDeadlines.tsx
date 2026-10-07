"use client";

import { useState } from "react";
import { CURRENT_TAX_YEAR, SUPPORTED_TAX_YEARS, getConstantsForYear } from "@/lib/tax-engine/constants";
import { buildQuarterlyDeadlinesIcs } from "@/lib/calendar/build-ics";

const LABELS = ["Q1", "Q2", "Q3", "Q4"] as const;

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white py-2.5 px-3 text-zinc-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";

function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function QuarterlyDeadlines() {
  const [taxYear, setTaxYear] = useState(CURRENT_TAX_YEAR);
  const dueDates = getConstantsForYear(taxYear).quarterlyDueDates;

  function handleDownloadIcs() {
    const events = dueDates.map((dueDate, i) => ({ label: LABELS[i], dueDate }));
    const ics = buildQuarterlyDeadlinesIcs(events, taxYear);
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quarterly-tax-deadlines-${taxYear}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Tax year</span>
          <select
            value={taxYear}
            onChange={(e) => setTaxYear(Number(e.target.value))}
            className={`${inputClass} max-w-xs`}
          >
            {SUPPORTED_TAX_YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>

        <dl className="mt-6 grid grid-cols-1 gap-4 border-t border-zinc-200 pt-6 sm:grid-cols-2 dark:border-zinc-800">
          {dueDates.map((dueDate, i) => (
            <div key={LABELS[i]}>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {LABELS[i]}
              </dt>
              <dd className="mt-0.5 font-semibold text-zinc-900 dark:text-zinc-50">{formatDate(dueDate)}</dd>
            </div>
          ))}
        </dl>

        <button
          type="button"
          onClick={handleDownloadIcs}
          className="mt-6 w-full rounded-lg bg-teal-700 py-3 font-semibold text-white transition-colors hover:bg-teal-800 sm:w-auto sm:px-8"
        >
          Add all four to my calendar
        </button>
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          Downloads a .ics file — nothing is sent to our servers to generate it.
        </p>
      </div>

      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Not sure if you need to pay quarterly, or what happens if you miss one?{" "}
        <a href="/guides/quarterly-estimated-taxes" className="underline underline-offset-2 hover:no-underline">
          Read the guide
        </a>
        . To see how much to actually set aside, use the{" "}
        <a href="/" className="underline underline-offset-2 hover:no-underline">
          tax estimator
        </a>
        .
      </p>
    </div>
  );
}
