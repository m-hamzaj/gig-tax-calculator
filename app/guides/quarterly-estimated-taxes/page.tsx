import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/content/Section";

export const metadata: Metadata = {
  title: "Quarterly Estimated Taxes Explained — Gig Tax Estimator",
  description:
    "Who has to pay quarterly estimated taxes, the IRS safe-harbor rule that avoids a penalty, how the penalty works, and how the four due dates are actually set.",
};

export default function QuarterlyGuidePage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Quarterly estimated taxes, explained
          </h1>
        </div>

        <div className="flex flex-col gap-8">
          <Section title="Who actually has to pay quarterly">
            <p>
              If you expect to owe <strong>$1,000 or more</strong> for the year after subtracting
              withholding and credits, the IRS generally requires you to pay estimated tax in quarterly
              installments rather than one lump sum at filing time. Most gig workers and freelancers with
              no tax withheld from their 1099 income cross this threshold quickly.
            </p>
          </Section>

          <Section title="The safe harbor: how to avoid a penalty even if your estimate is off">
            <p>
              You don&apos;t have to predict your tax bill perfectly. The IRS&apos;s safe harbor rule
              protects you from an underpayment penalty if, across the year, you pay in at least the{" "}
              <strong>smaller</strong> of:
            </p>
            <ul className="list-disc pl-5">
              <li>90% of what you actually end up owing for the current year, or</li>
              <li>
                100% of your total tax from last year&apos;s return (110% if last year&apos;s adjusted
                gross income was over $150,000, or $75,000 if married filing separately).
              </li>
            </ul>
            <p>
              The second option is powerful precisely because it&apos;s a known number from a return
              you&apos;ve already filed — pay in that amount across four installments and you&apos;re
              penalty-proof regardless of how much your income jumps this year, even though you might
              still owe a real balance when you file.
            </p>
          </Section>

          <Section title="What happens if you underpay anyway">
            <p>
              An underpayment doesn&apos;t trigger a flat fine — the IRS calculates it closer to interest,
              based on how much you underpaid, for how long, using the federal short-term interest rate
              (which changes quarterly). It&apos;s calculated on Form 2210 and generally added to what you
              owe at filing. Paying late is usually cheaper than not paying at all, but paying close to on
              time is cheaper still.
            </p>
          </Section>

          <Section title="Why the four due dates aren't equal quarters">
            <p>
              IRS Form 1040-ES splits the year into four periods that are <strong>not</strong> equal
              three-month quarters: roughly January–March, April–May, June–August, and
              September–December. That means the gap between the Q1 and Q2 due dates is only about two
              months, while the gap between Q3 and Q4 (which falls in mid-January of the following year)
              is about four. A due date also shifts to the next business day when it would otherwise fall
              on a weekend or federal holiday.
            </p>
            <p>
              Use the{" "}
              <Link href="/tools/quarterly-deadlines" className="underline underline-offset-2 hover:no-underline">
                quarterly deadlines tool
              </Link>{" "}
              to see this year&apos;s exact dates and download them to your calendar, and the{" "}
              <Link href="/" className="underline underline-offset-2 hover:no-underline">
                tax estimator
              </Link>{" "}
              to see how much to actually set aside for each payment.
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
