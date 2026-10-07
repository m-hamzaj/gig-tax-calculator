import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PayComparisonCalculator from "@/components/comparison/PayComparisonCalculator";

export const metadata: Metadata = {
  title: "1099 vs W-2 Pay Comparison Calculator — Gig Tax Estimator",
  description:
    "Compare take-home pay as a 1099 contractor vs a W-2 employee at the same gross pay, and see exactly what the FICA tax gap costs you. Free, no account needed.",
};

export default function PayComparisonPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            1099 vs W-2 pay comparison
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            See exactly how much more tax you pay as a 1099 contractor compared to a W-2 employee earning
            the same gross amount.{" "}
            <Link href="/guides/1099-vs-w2" className="underline underline-offset-2 hover:no-underline">
              Read the guide
            </Link>{" "}
            for what else differs beyond the tax math.
          </p>
        </div>
        <PayComparisonCalculator />
      </main>
      <Footer />
    </div>
  );
}
