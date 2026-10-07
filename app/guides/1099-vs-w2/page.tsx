import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/content/Section";

export const metadata: Metadata = {
  title: "1099 vs W-2: What Actually Differs — Gig Tax Estimator",
  description:
    "What actually differs between 1099 contractor and W-2 employee pay: the FICA tax gap, benefits, expense deductions, and withholding — the real math, not opinions.",
};

export default function PayComparisonGuidePage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            1099 vs W-2: what actually differs
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Not &quot;which is better&quot; — that depends on your situation. Here&apos;s the real math.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          <Section title="The FICA tax gap">
            <p>
              A W-2 employee and their employer each pay half of the 15.3% Social Security and Medicare
              tax (FICA): 7.65% withheld from the paycheck, 7.65% paid separately by the employer, never
              touching the employee&apos;s take-home pay. A 1099 contractor has no employer, so they pay
              <strong> both halves</strong> themselves, as self-employment tax — the full 15.3% (plus the
              Additional Medicare Tax above certain income thresholds).
            </p>
            <p>
              This is the single biggest, most mechanical difference between the two, and it&apos;s what
              our{" "}
              <Link href="/tools/1099-vs-w2" className="underline underline-offset-2 hover:no-underline">
                comparison tool
              </Link>{" "}
              calculates directly from the same gross pay figure.
            </p>
          </Section>

          <Section title="Expense deductions cut the other way">
            <p>
              A W-2 employee generally can&apos;t deduct job-related expenses from their taxable wages. A
              1099 contractor can deduct legitimate business expenses — mileage, equipment, a home
              office, software subscriptions — which lowers the net earnings that self-employment tax and
              income tax are calculated on in the first place. This is why the comparison tool&apos;s
              result, which assumes zero deductible expenses to keep the comparison apples-to-apples,
              understates how a 1099 contractor with real expenses actually comes out.
            </p>
          </Section>

          <Section title="Benefits most people don't think to price in">
            <p>
              A W-2 job often comes with employer-sponsored health insurance (sometimes subsidized),
              employer retirement-plan matching, paid sick leave and vacation, unemployment insurance
              eligibility if you&apos;re laid off, and workers&apos; compensation if you&apos;re injured
              on the job. A 1099 contractor generally has none of these by default — any health coverage,
              retirement savings, or injury protection has to be arranged and paid for independently. These
              don&apos;t show up in a pay-stub comparison, but they&apos;re real dollar value.
            </p>
          </Section>

          <Section title="Withholding timing, not just amount">
            <p>
              A W-2 employer withholds income tax and FICA from every paycheck automatically. A 1099
              contractor who expects to owe $1,000 or more for the year is generally required to pay
              estimated tax quarterly instead — see the{" "}
              <Link
                href="/guides/quarterly-estimated-taxes"
                className="underline underline-offset-2 hover:no-underline"
              >
                quarterly deadlines guide
              </Link>
              . Nothing is withheld automatically, so the responsibility (and the risk of an
              underpayment penalty) shifts entirely to the contractor.
            </p>
          </Section>

          <Section title="Why this isn't a 'which is better' question">
            <p>
              The right comparison depends on the actual rate offered for each arrangement (a 1099 rate
              should generally be higher than an equivalent W-2 salary to offset the gaps above), how much
              you can genuinely deduct as business expenses, and how much you value benefits like health
              insurance and unemployment protection. The tax math above is one real, calculable piece of
              that decision — not the whole picture.
            </p>
          </Section>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            This is general information, not tax or employment advice — see the{" "}
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
