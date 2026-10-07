import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Free Tools for Gig Workers — Gig Tax Estimator",
  description:
    "Free calculators for gig workers and freelancers: self-employment tax, mileage deductions, 1099 vs W-2 pay comparison, and quarterly tax deadlines.",
};

const TOOLS = [
  {
    href: "/",
    title: "Self-employment tax estimator",
    description: "Estimate your SE tax, federal income tax, and quarterly payments.",
  },
  {
    href: "/tools/mileage-deduction",
    title: "Mileage deduction calculator",
    description: "Calculate your deduction for business miles driven, using the IRS standard rate.",
  },
  {
    href: "/tools/1099-vs-w2",
    title: "1099 vs W-2 pay comparison",
    description: "See exactly what the FICA tax gap costs you as a 1099 contractor.",
  },
  {
    href: "/tools/quarterly-deadlines",
    title: "Quarterly tax deadlines",
    description: "The real IRS due dates for this tax year, with a free calendar download.",
  },
];

export default function ToolsIndexPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Free tools for gig workers
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            All stateless — nothing you enter is saved anywhere.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-teal-600 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-teal-600"
            >
              <p className="font-semibold text-zinc-900 dark:text-zinc-50">{tool.title}</p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{tool.description}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
