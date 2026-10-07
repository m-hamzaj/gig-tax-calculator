import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Gig Tax Estimator",
  description: "Why this tool exists and how it's built.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">About</h1>

      <div className="flex flex-col gap-4 text-zinc-700 dark:text-zinc-300">
        <p>
          Gig Tax Estimator exists because most self-employment tax calculators stop at giving you a
          number. We built this one to also explain what that number means and why — in plain English,
          grounded in your actual figures, not a generic article about self-employment tax.
        </p>
        <p>
          It&apos;s aimed at gig workers and freelancers — rideshare and delivery drivers, freelance
          creatives, independent contractors — anyone getting a 1099 instead of a W-2, trying to figure
          out how much to set aside for taxes before the quarterly deadline sneaks up on them.
        </p>
        <p>
          The calculation engine is built against real IRS Schedule SE and Form 1040-ES mechanics — self-employment
          tax rate, the Social Security wage base cap, the Additional Medicare Tax threshold, and current
          federal income tax brackets — and tested against hand-verified worked examples so the number
          you see is one we&apos;ve actually checked, not just typed in and hoped for. What it doesn&apos;t
          yet cover (state tax, some deductions) is disclosed plainly on the{" "}
          <a href="/terms" className="underline underline-offset-2 hover:no-underline">
            terms page
          </a>{" "}
          rather than quietly omitted.
        </p>
        <p>
          Nothing you enter is saved anywhere — see the{" "}
          <a href="/privacy" className="underline underline-offset-2 hover:no-underline">
            privacy policy
          </a>{" "}
          for the specifics.
        </p>
      </div>

      <div className="mt-2 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        <p>
          Questions, feedback, or found something that looks wrong? Reach out at{" "}
          <a
            href="mailto:mhamzajavaid370@gmail.com"
            className="underline underline-offset-2 hover:no-underline"
          >
            mhamzajavaid370@gmail.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
