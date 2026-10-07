import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import QuarterlyDeadlines from "@/components/quarterly/QuarterlyDeadlines";

export const metadata: Metadata = {
  title: "Quarterly Estimated Tax Deadlines — Gig Tax Estimator",
  description:
    "The exact IRS Form 1040-ES quarterly estimated tax due dates for gig workers and freelancers, with a free calendar download.",
};

export default function QuarterlyDeadlinesPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Quarterly estimated tax deadlines
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            The real IRS Form 1040-ES due dates — not equal three-month quarters, and they shift when a
            date falls on a weekend or holiday.
          </p>
        </div>
        <QuarterlyDeadlines />
      </main>
      <Footer />
    </div>
  );
}
