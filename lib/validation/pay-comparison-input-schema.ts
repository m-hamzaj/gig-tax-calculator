import { z } from "zod";
import { SUPPORTED_TAX_YEARS } from "@/lib/tax-engine/constants";

/** Shared by PayComparisonCalculator.tsx (the 1099-vs-W2 tool) -- same
 * one-schema convention as calculator-input-schema.ts. */
export const payComparisonInputSchema = z.object({
  grossPay: z
    .number({ error: "Enter a number for gross pay." })
    .min(0, "Gross pay can't be negative.")
    .max(10_000_000, "That number looks too large -- double-check it."),
  filingStatus: z.enum(["single", "married_filing_jointly", "head_of_household"], {
    error: "Choose a filing status.",
  }),
  taxYear: z.number().refine((year) => (SUPPORTED_TAX_YEARS as number[]).includes(year), {
    error: `Tax year must be one of: ${SUPPORTED_TAX_YEARS.join(", ")}.`,
  }),
});

export type PayComparisonInput = z.infer<typeof payComparisonInputSchema>;
