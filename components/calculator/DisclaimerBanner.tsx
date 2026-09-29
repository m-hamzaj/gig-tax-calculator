import Link from "next/link";

/**
 * Rendered directly with every result display (see ResultDisplay.tsx) --
 * not footer-only. This is the single most important piece of copy in
 * the app from a compliance/liability standpoint.
 */
export default function DisclaimerBanner() {
  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
      <strong className="font-semibold">This is an estimate, not tax advice.</strong>{" "}
      It&apos;s for informational purposes only. Consult a qualified tax professional or CPA for your
      specific situation.{" "}
      <Link href="/terms" className="underline underline-offset-2 hover:no-underline">
        What this estimate doesn&apos;t include
      </Link>
      .
    </div>
  );
}
