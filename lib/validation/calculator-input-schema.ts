import { z } from "zod";
import { SUPPORTED_TAX_YEARS } from "@/lib/tax-engine/constants";

/**
 * The ONE input schema, imported by both the client form
 * (components/calculator/CalculatorForm.tsx) and the API route
 * (app/api/calculate-explain/route.ts) -- validation logic must never
 * drift between the two, so there's exactly one definition.
 *
 * Numeric ceiling (10M) exists specifically to reject absurd/garbage/
 * injection-style values before they ever reach the calculation engine
 * or an LLM prompt -- not a realistic earnings cap, just a sanity bound.
 */
export const calculatorInputSchema = z.object({
  grossEarnings: z
    .number({ error: "Enter a number for gross earnings." })
    .min(0, "Gross earnings can't be negative.")
    .max(10_000_000, "That number looks too large -- double-check it."),
  businessExpenses: z
    .number({ error: "Enter a number for business expenses." })
    .min(0, "Business expenses can't be negative.")
    .max(10_000_000, "That number looks too large -- double-check it."),
  filingStatus: z.enum(["single", "married_filing_jointly", "head_of_household"], {
    error: "Choose a filing status.",
  }),
  taxYear: z
    .number()
    .refine((year) => (SUPPORTED_TAX_YEARS as number[]).includes(year), {
      error: `Tax year must be one of: ${SUPPORTED_TAX_YEARS.join(", ")}.`,
    }),
});

export type CalculatorInput = z.infer<typeof calculatorInputSchema>;

/**
 * The API route's full request body: the calculator inputs above, plus
 * ONE optional grounded follow-up question (v1 deliberately allows a
 * single question, not open-ended chat -- see the project plan). Length
 * capped to keep prompt size (and therefore token spend against the
 * shared Groq rate limit) small and predictable.
 */
export const explainRequestSchema = z.object({
  input: calculatorInputSchema,
  followUpQuestion: z
    .string()
    .trim()
    .max(300, "Keep your question under 300 characters.")
    .optional(),
});

export type ExplainRequest = z.infer<typeof explainRequestSchema>;
