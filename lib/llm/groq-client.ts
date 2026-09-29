import "server-only";
import Groq, { APIConnectionError, RateLimitError } from "groq-sdk";

/**
 * SERVER-ONLY. The `server-only` import above makes any accidental
 * import of this module from a client component a build-time error, not
 * just a convention -- this is the one file allowed to read
 * GROQ_API_KEY, and this module is imported ONLY by
 * app/api/calculate-explain/route.ts. Never add an import of this file
 * to anything under a "use client" boundary.
 */

// openai/gpt-oss-20b, not the larger 120b model used in prior projects --
// explaining a handful of already-calculated numbers in plain English is
// a simple task that doesn't need the bigger model. This does NOT
// increase headroom under Groq's shared per-minute token rate limit
// (confirmed live during planning: every tool-capable model on this
// account shares the same flat cap) -- the actual rate-limit-pressure
// reducer is MAX_COMPLETION_TOKENS below, kept deliberately small.
const MODEL = "openai/gpt-oss-20b";

// An explanation of a number, not an essay -- this is the real lever
// that keeps token spend (and therefore rate-limit pressure) low,
// independent of which model is used.
const MAX_COMPLETION_TOKENS = 400;

// Deliberately much shorter than a batch-job retry schedule (e.g. the
// 15s x 2^attempt over 5 retries used in a prior offline eval project) --
// this is a live, user-facing request. A visitor won't wait over a
// minute for an explanation; the graceful-degradation fallback in the
// API route exists specifically so a short, bounded retry budget here is
// safe to fail out of quickly.
const RATE_LIMIT_RETRIES = 2;
const RATE_LIMIT_BASE_BACKOFF_MS = 1_000;
const REQUEST_TIMEOUT_MS = 9_000;

let client: Groq | null = null;

function getClient(): Groq {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set");
  }
  if (!client) {
    client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
      timeout: REQUEST_TIMEOUT_MS,
      // SDK's own retry handling disabled (maxRetries: 0) in favor of the
      // explicit, visible retry loop below -- full control over the total
      // wait budget for a live request, not hidden inside the library.
      maxRetries: 0,
    });
  }
  return client;
}

export interface GroqMessage {
  role: "system" | "user";
  content: string;
}

export type GroqExplainOutcome = { ok: true; text: string } | { ok: false; reason: "rate_limited" | "unavailable" };

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calls Groq for the plain-English explanation. Never throws for a
 * transient/rate-limit failure -- returns a tagged outcome instead, so
 * the API route's fallback path (see route.ts) is a simple, unavoidable
 * branch on the return value, not a try/catch someone could forget to
 * wire up correctly at a call site.
 */
export async function callGroqExplain(messages: GroqMessage[]): Promise<GroqExplainOutcome> {
  for (let attempt = 0; attempt <= RATE_LIMIT_RETRIES; attempt++) {
    try {
      // getClient() moved INSIDE the try block deliberately: it throws
      // synchronously if GROQ_API_KEY is missing (e.g. a misconfigured
      // deploy), and that must be caught here like any other
      // unavailability, never propagate uncaught past this function --
      // the API route relies on this function never throwing (see
      // docstring above) to keep its own "always 200, explanation nulled
      // out" contract, and an uncaught exception here would silently
      // break that guarantee.
      const groq = getClient();
      const response = await groq.chat.completions.create({
        model: MODEL,
        messages,
        max_completion_tokens: MAX_COMPLETION_TOKENS,
        temperature: 0.3,
      });
      const text = response.choices[0]?.message?.content?.trim();
      if (!text) {
        return { ok: false, reason: "unavailable" };
      }
      return { ok: true, text };
    } catch (error) {
      const isTransient = error instanceof RateLimitError || error instanceof APIConnectionError;
      if (!isTransient || attempt === RATE_LIMIT_RETRIES) {
        return {
          ok: false,
          reason: error instanceof RateLimitError ? "rate_limited" : "unavailable",
        };
      }
      await sleep(RATE_LIMIT_BASE_BACKOFF_MS * (attempt + 1));
    }
  }
  // Unreachable -- the loop above always returns.
  return { ok: false, reason: "unavailable" };
}
