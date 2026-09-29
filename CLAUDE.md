# gig-tax-calculator

A US self-employment/1099 tax estimator with an LLM layer that explains
the result in plain English. Next.js App Router + TypeScript + Tailwind,
deployed on Vercel. Stateless -- no accounts, nothing saved server-side.

Full design decisions and reasoning: see the project plan this was built
from (tax-calculation-engine architecture, security checklist, AdSense
readiness, v1/v2 scope).

## Key conventions

- `lib/tax-engine/` has zero dependency on Next.js/React/the LLM -- it's
  a pure, independently-tested module. `calculateFullResult()` is the
  ONE entry point, used identically by the API route and the client.
  Every IRS figure is a named, source-cited constant in
  `lib/tax-engine/constants/{year}.ts`, never inline in a calculation
  function.
- `lib/llm/groq-client.ts` is the ONLY file that reads `GROQ_API_KEY`
  (enforced by the `server-only` import, not just convention) and is
  imported ONLY by `app/api/calculate-explain/route.ts`.
- The API route's fallback contract: a Groq failure only ever nulls the
  `explanation` field, never the `result` field. The calculator's core
  value (the number) must survive total LLM unavailability.
- `npm test` runs the golden-value test suite in `lib/tax-engine/__tests__/`
  -- must stay green; this is the actual credibility backstop for the
  tax figures.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
