import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Per-IP rate limiting on the explain endpoint, checked FIRST in the API
 * route -- before validation or calculation -- so abusive/bot traffic is
 * rejected before Groq is ever touched. Protects the shared free-tier
 * token budget from being exhausted by anything other than real visitors
 * asking real questions.
 *
 * Upstash Redis specifically (not an in-memory counter): Vercel
 * serverless functions are stateless across invocations/cold starts, so
 * a module-level Map would silently fail to actually limit anything once
 * traffic spans more than one function instance.
 *
 * A named constant, not a magic number: 5 requests/minute/IP is a
 * starting point tuned for "a real visitor calculating their taxes a
 * couple of times," not a hard technical constraint -- revisit against
 * real post-launch usage.
 */
const REQUESTS_PER_WINDOW = 5;
const WINDOW = "60 s";

let ratelimit: Ratelimit | null = null;

/**
 * Returns null if Upstash isn't configured (e.g. local dev without the
 * env vars set) -- callers must treat a null return as "rate limiting is
 * unavailable" and decide how to handle that explicitly, never silently
 * skip the check without noticing.
 */
export function getRateLimiter(): Ratelimit | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  if (!ratelimit) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(REQUESTS_PER_WINDOW, WINDOW),
      prefix: "gig-tax-calc:explain",
    });
  }
  return ratelimit;
}

/** Vercel populates x-forwarded-for on incoming requests; falls back to a
 * fixed key if it's ever missing (e.g. local dev), which degrades to a
 * single shared bucket rather than throwing -- acceptable since this
 * only matters for production traffic, where the header is reliable. */
export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}
