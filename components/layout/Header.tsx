import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
          Gig Tax Estimator
        </Link>
        <nav className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
          <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100">
            Tax Estimator
          </Link>
          <Link href="/tools/mileage-deduction" className="hover:text-zinc-900 dark:hover:text-zinc-100">
            Mileage
          </Link>
          <Link href="/tools/1099-vs-w2" className="hover:text-zinc-900 dark:hover:text-zinc-100">
            1099 vs W-2
          </Link>
          <Link href="/tools/quarterly-deadlines" className="hover:text-zinc-900 dark:hover:text-zinc-100">
            Quarterly Deadlines
          </Link>
          <Link href="/about" className="hover:text-zinc-900 dark:hover:text-zinc-100">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
