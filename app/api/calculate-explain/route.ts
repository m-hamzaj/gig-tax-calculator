import { NextRequest, NextResponse } from "next/server";
import { calculateFullResult, type TaxCalcResult } from "@/lib/tax-engine/calculate";
import { explainRequestSchema } from "@/lib/validation/calculator-input-schema";
import { callGroqExplain } from "@/lib/llm/groq-client";
import { buildExplainMessages } from "@/lib/llm/prompts";
import { getClientIp, getRateLimiter } from "@/lib/llm/rate-limit";

export interface ExplainResponse {
  result: TaxCalcResult;
  explanation: string | null;
  explanationError: string | null;
}

/**
 * POST /api/calculate-explain
 *
 * Order of operations matters and is deliberate -- see the project plan:
 *   1. Rate-limit check, before anything else touches Groq.
 *   2. Input validation.
 *   3. Run the deterministic calculation and HOLD the result.
 *   4. Only THEN attempt the Groq explanation.
 *   5. Any Groq failure nulls `explanation`, never `result` -- this route
 *      returns 200 even when the LLM call fails outright, because the
 *      calculator's core value (the number) must never be withheld or
 *      delayed by an LLM problem.
 */
export async function POST(request: NextRequest) {
  const limiter = getRateLimiter();
  if (limiter) {
    const ip = getClientIp(request.headers);
    const { success } = await limiter.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "You're asking too fast — try again in a minute." },
        { status: 429 }
      );
    }
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = explainRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }
  const { input, followUpQuestion } = parsed.data;

  // The calculation happens and is fully formed BEFORE the Groq call is
  // attempted -- a total Groq failure below structurally cannot corrupt
  // or delay this result, since it's already computed by the time we
  // even try.
  let result: TaxCalcResult;
  try {
    result = calculateFullResult(input);
  } catch (error) {
    // Only calculateFullResult's own explicit unsupported-year error
    // (or a genuine bug) lands here -- a real 400, not a Groq problem.
    const message = error instanceof Error ? error.message : "Could not calculate a result for that input.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const messages = buildExplainMessages(result, followUpQuestion);
  const outcome = await callGroqExplain(messages);

  const response: ExplainResponse =
    outcome.ok
      ? { result, explanation: outcome.text, explanationError: null }
      : {
          result,
          explanation: null,
          explanationError:
            outcome.reason === "rate_limited"
              ? "The AI explanation is temporarily busy. Your numbers below are still accurate."
              : "The AI explanation is temporarily unavailable. Your numbers below are still accurate.",
        };

  // Always 200 for a Groq-only failure -- see module docstring.
  return NextResponse.json(response, { status: 200 });
}
