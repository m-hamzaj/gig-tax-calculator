/** Shared section wrapper for the long-form /guides/* content pages
 * (mirrors the local Section component already used in app/terms/page.tsx,
 * pulled out here since three new guide pages reuse it identically). */
export default function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">{title}</h2>
      <div className="flex flex-col gap-3 text-zinc-700 dark:text-zinc-300">{children}</div>
    </section>
  );
}
