import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-6 py-8 text-sm text-zinc-500 dark:text-zinc-400">
        <p>
          Estimates only, not tax advice. No data is saved — everything you enter stays on this page
          and is never stored on our servers.
        </p>
        <nav className="flex flex-wrap gap-4">
          <Link href="/tools" className="hover:text-zinc-900 dark:hover:text-zinc-100">
            All tools
          </Link>
          <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-zinc-100">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-zinc-100">
            Terms &amp; disclaimer
          </Link>
          <Link href="/about" className="hover:text-zinc-900 dark:hover:text-zinc-100">
            About
          </Link>
        </nav>
      </div>
    </footer>
  );
}
