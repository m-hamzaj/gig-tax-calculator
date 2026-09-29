# Deploy checklist

Everything below is a real, remaining step before this goes live — none of
it is code, all of it needs an actual account/action from you (and your
friend, if you're splitting this).

## 1. Before deploying

- [ ] **Replace the placeholder contact email.** `app/about/page.tsx` has
      `hello@example.com` with a `TODO` comment next to it — swap in the
      real email you two want public on the site.
- [ ] **Create a free Upstash account** at [upstash.com](https://upstash.com) ->
      Create Database (Redis, free tier is enough) -> REST API tab -> copy
      the URL and token.
- [ ] **Create/confirm a Groq API key** at
      [console.groq.com](https://console.groq.com) -> API Keys. Free tier,
      no card needed. If you're reusing a key from another project, know
      that this site's traffic will share that same account-wide rate
      limit with whatever else uses the same key.
- [ ] Copy `.env.local.example` to `.env.local` and fill in both Upstash
      values and the Groq key, for local testing before you deploy.

## 2. Deploy to Vercel

- [ ] Push this repo to a GitHub repo (new one, or reuse an existing
      account) — Vercel deploys from a connected Git repo.
- [ ] At [vercel.com/new](https://vercel.com/new), import that repo.
      Framework preset should auto-detect as Next.js — no config changes
      needed.
- [ ] In the Vercel project's **Settings -> Environment Variables**, add
      `GROQ_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
      — same names as `.env.local`. Set them for both **Production** and
      **Preview** environments (the plan deliberately recommends separate
      values per environment where possible, so a broken preview deploy
      can't drain the same production rate-limit budget — at minimum,
      know that Preview and Production share one budget if you use the
      same values for both).
- [ ] Deploy. Vercel gives you a `*.vercel.app` URL immediately; a custom
      domain can be added later under **Settings -> Domains**.

## 3. After deploying — verify for real, don't assume

- [ ] Load the deployed URL, run a calculation, confirm the number
      appears instantly.
- [ ] Click "Explain this in plain English" — confirm a real AI
      explanation comes back (this only works once `GROQ_API_KEY` is set
      correctly in Vercel).
- [ ] Open browser dev tools -> Network tab, trigger the explanation
      again, and confirm the request body/response never contains the
      Groq key — it shouldn't, since the key is server-only, but this is
      the concrete way to *confirm* that rather than just trust it.
- [ ] Visit `/privacy`, `/about`, `/terms` on the live URL and confirm
      they render your real content (not a 404).
- [ ] Trigger the explanation request 6+ times quickly (past the 5/minute
      limit) and confirm you get the "asking too fast" message, not a
      crash — this confirms Upstash is actually wired up correctly in
      production, not just configured.

## 4. Ad monetization — a milestone, not a launch feature

Do not expect AdSense approval on day one. Before applying:

- [ ] Let the site accumulate some real content depth beyond the bare
      calculator (see the "expanded content pages" item in the project's
      v2 scope notes) and some real traffic history — this is a "come
      back to in a few weeks/months" step, not a checkbox to rush.
- [ ] Apply at [google.com/adsense](https://www.google.com/adsense) once
      the above is genuinely true. Expect possibly more than one review
      cycle.

## 5. Updating the tax year each year

`lib/tax-engine/constants/` is a registry, one file per tax year. When a
new tax year's figures are needed:

1. Add a new `lib/tax-engine/constants/{year}.ts`, sourced and cited the
   same way `2026.ts` is (IRS Rev. Proc. for brackets/standard deduction,
   SSA.gov for the Social Security wage base).
2. Register it in `lib/tax-engine/constants/index.ts`.
3. Add golden-value tests for the new year in
   `lib/tax-engine/__tests__/` before trusting it.
4. Update `CURRENT_TAX_YEAR` in `constants/index.ts` once the new year is
   verified.
