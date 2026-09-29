import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Gig Tax Estimator",
  description: "What data this tool collects, stores, and sends to third parties, and why.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">{title}</h2>
      <div className="flex flex-col gap-3 text-zinc-700 dark:text-zinc-300">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Privacy policy</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Straightforward, because there isn&apos;t much to say — this tool is built to collect as
          little as possible.
        </p>
      </div>

      <Section title="We don't store your financial data">
        <p>
          There is no login and no account. The numbers you enter — earnings, expenses, filing status —
          are used to calculate your result in your browser and, if you request the AI explanation, sent
          to our server for that one request. None of it is written to a database, logged permanently,
          or associated with you in any way. Refresh the page and it&apos;s gone.
        </p>
      </Section>

      <Section title="What's sent to the AI explanation service">
        <p>
          If you click &quot;Explain this in plain English,&quot; your calculated tax figures (not your
          raw entered numbers) and any follow-up question you type are sent to Groq, a third-party AI
          inference provider, to generate the explanation. This request is not used to train any model
          on your data, and Groq does not receive your name or any other identifying information from
          this tool — only the numbers and the question text.
        </p>
      </Section>

      <Section title="Advertising and cookies">
        <p>
          This site may display ads served by Google AdSense once it&apos;s eligible for the program.
          Google AdSense uses cookies to serve ads based on your visits to this and other sites; you can
          opt out of personalized advertising through{" "}
          <a
            href="https://adssettings.google.com/"
            className="underline underline-offset-2 hover:no-underline"
          >
            Google&apos;s Ads Settings
          </a>
          . If and when ads are active on this site, a notice will be shown here confirming it.
        </p>
      </Section>

      <Section title="Analytics">
        <p>
          We may use basic, privacy-respecting analytics to understand how many people use this tool and
          which pages they visit — no analytics service used here associates data with your name or
          email, since we never collect either.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about this policy? See the <a href="/about" className="underline underline-offset-2 hover:no-underline">About page</a> for a
          contact method.
        </p>
      </Section>
    </div>
  );
}
