import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/content/Section";

export const metadata: Metadata = {
  title: "How the Mileage Deduction Works — Gig Tax Estimator",
  description:
    "How the IRS standard mileage deduction works for gig workers and freelancers: the current rates, what counts as business mileage, and what records you need.",
};

export default function MileageDeductionGuidePage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            How the mileage deduction works
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            For rideshare, delivery, and other driving-based gig work.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          <Section title="The standard mileage method">
            <p>
              The IRS lets you deduct business driving in one of two ways: track your actual vehicle
              costs (gas, insurance, repairs, depreciation) and apply your business-use percentage, or
              use the <strong>standard mileage rate</strong> — a flat cents-per-mile figure the IRS sets
              each year that&apos;s meant to approximate those costs without you having to track every
              receipt.
            </p>
            <p>
              Almost every gig driver uses the standard mileage method, because it requires far less
              recordkeeping: you just need the miles, not every gas and maintenance receipt for the year.
            </p>
          </Section>

          <Section title="The current rates">
            <p>
              For <strong>2025</strong>, the business standard mileage rate is a flat{" "}
              <strong>70 cents per mile</strong> for the whole year.
            </p>
            <p>
              For <strong>2026</strong>, the IRS set the rate at 72.5 cents per mile starting January 1 —
              then made a rare mid-year change, raising it to <strong>76 cents per mile</strong> for July
              1 through December 31, citing high fuel prices. If you drove for gig work across both
              halves of 2026, your miles from each half need their own rate — our{" "}
              <Link href="/tools/mileage-deduction" className="underline underline-offset-2 hover:no-underline">
                mileage calculator
              </Link>{" "}
              handles this split automatically.
            </p>
          </Section>

          <Section title="What counts as business mileage">
            <p>
              Driving to pick up or drop off a delivery, driving between rides with the rideshare app
              active and accepting fares, and driving to a client site for freelance work all count.
              Your regular <strong>commute</strong> from home to a fixed workplace does not — that&apos;s
              personal mileage under IRS rules, whether you&apos;re an employee or self-employed.
            </p>
            <p>
              If your home is your primary place of business (common for delivery and rideshare drivers
              who have no other office), trips from home to your first pickup and back can generally
              count as business mileage rather than commuting — this is a real distinction with real
              money attached, and one worth confirming with a tax professional for your specific setup.
            </p>
          </Section>

          <Section title="What records you need">
            <p>
              The IRS expects a contemporaneous mileage log — recorded at or near the time of the trip,
              not reconstructed from memory months later. For each business trip, keep: the date, the
              starting point and destination, the business purpose, and the miles driven. Rideshare and
              delivery apps often show trip-mile totals in your driver dashboard, which can supplement
              (but don&apos;t always fully replace) your own log, since dashboard figures sometimes
              exclude the drive to your first pickup.
            </p>
          </Section>

          <Section title="One deduction, not two">
            <p>
              You can&apos;t use the standard mileage rate for a vehicle and also deduct actual expenses
              like gas or depreciation for the same miles — it&apos;s one method or the other, for a
              given vehicle, for the year. Whichever you use, it reduces your net business
              earnings before self-employment tax and income tax are calculated — plug your deduction
              into business expenses on the{" "}
              <Link href="/" className="underline underline-offset-2 hover:no-underline">
                tax estimator
              </Link>{" "}
              to see the full effect on what you owe.
            </p>
          </Section>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            This is general information, not tax advice — see the{" "}
            <Link href="/terms" className="underline underline-offset-2 hover:no-underline">
              terms page
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
