import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MileageCalculator from "@/components/mileage/MileageCalculator";

export const metadata: Metadata = {
  title: "Mileage Deduction Calculator — Gig Tax Estimator",
  description:
    "Calculate your IRS standard mileage deduction for business driving as a gig worker or freelancer. Free, no account needed, nothing saved.",
};

export default function MileageDeductionPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Mileage deduction calculator
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Enter the business miles you drove for deliveries, rideshare, or client work to estimate your
            deduction under the IRS standard mileage method. Not sure how this works?{" "}
            <Link href="/guides/mileage-deduction" className="underline underline-offset-2 hover:no-underline">
              Read the guide
            </Link>
            .
          </p>
        </div>
        <MileageCalculator />
      </main>
      <Footer />
    </div>
  );
}
