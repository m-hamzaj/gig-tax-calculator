# Gig Tax Estimator

A free self-employment tax estimator for US 1099 gig workers and
freelancers, with an AI layer that explains the result in plain English —
grounded in your actual calculated numbers, not a generic explanation.
Stateless: no accounts, nothing saved server-side.

## Why this exists

Several small calculator sites already do the plain "number in, number
out" version of this. The differentiator here is the explanation layer —
it answers "why is my number what it is" and one grounded follow-up
question, using the numbers a deterministic calculation engine already
computed (the AI never does its own tax math).

## Stack

Next.js (App Router) + TypeScript + Tailwind, deployed on Vercel. Groq
for the AI explanation, Upstash Redis for rate limiting.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # fill in GROQ_API_KEY + Upstash values
npm run dev
npm test                            # golden-value tax engine tests
```

See **`DEPLOY.md`** for the full deploy checklist (env vars, Vercel setup,
post-deploy verification, AdSense timing). See **`CLAUDE.md`** for the
key architectural conventions if you're working on the code.

## Project layout

```
lib/
  tax-engine/    pure calculation engine, zero framework dependency, source-cited IRS constants per tax year
  llm/           server-only Groq client, prompt builder (with injection guard), rate limiter
  validation/    the one Zod schema shared by the client form and the API route
app/
  page.tsx                        the calculator
  api/calculate-explain/route.ts  the only place the Groq key is read
  privacy/ about/ terms/          required pages, real content
components/
  calculator/    form, result display, AI explanation panel
  layout/        header, footer
```

## Tests

```bash
npm test
```

Golden-value tests for the tax engine, including a cross-check against an
independently-published worked example — this is the real credibility
backstop for the numbers this tool shows people. Must stay green.
