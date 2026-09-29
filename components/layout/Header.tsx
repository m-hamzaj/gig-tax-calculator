import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
          Gig Tax Estimator
        </Link>
        <nav className="flex gap-5 text-sm text-zinc-600 dark:text-zinc-400">
          <Link href="/about" className="hover:text-zinc-900 dark:hover:text-zinc-100">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
