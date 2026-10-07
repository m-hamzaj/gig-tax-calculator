import Link from "next/link";
import Calculator from "@/components/calculator/Calculator";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const MORE_TOOLS = [
  {
    href: "/tools/mileage-deduction",
    title: "Mileage deduction calculator",
    description: "Calculate your deduction for business miles driven.",
  },
  {
    href: "/tools/1099-vs-w2",
    title: "1099 vs W-2 pay comparison",
    description: "See what the FICA tax gap actually costs you.",
  },
  {
    href: "/tools/quarterly-deadlines",
    title: "Quarterly tax deadlines",
    description: "This year's real IRS due dates, with a calendar download.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Self-employment tax estimator
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            For 1099 gig workers and freelancers — Uber, DoorDash, Instacart, freelance clients, and
            similar. Enter your numbers to estimate your self-employment tax, federal income tax, and
            quarterly payments. Nothing you enter is saved.
          </p>
        </div>
        <Calculator />

        <div className="mt-14 border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">More free tools</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {MORE_TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-teal-600 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-teal-600"
              >
                <p className="font-medium text-zinc-900 dark:text-zinc-50">{tool.title}</p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
