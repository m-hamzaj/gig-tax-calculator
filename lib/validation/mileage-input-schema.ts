import { z } from "zod";
import { SUPPORTED_TAX_YEARS } from "@/lib/tax-engine/constants";

/**
 * `milesByPeriod` length must match the selected year's
 * `standardMileageRatePeriods` -- the form builds one input per period, so
 * this is validated at the point of use (MileageCalculator.tsx), not here;
 * this schema only validates that each entry itself is a sane number.
 */
export const mileageInputSchema = z.object({
  taxYear: z.number().refine((year) => (SUPPORTED_TAX_YEARS as number[]).includes(year), {
    error: `Tax year must be one of: ${SUPPORTED_TAX_YEARS.join(", ")}.`,
  }),
  milesByPeriod: z
    .array(
      z
        .number({ error: "Enter a number for business miles." })
        .min(0, "Miles can't be negative.")
        .max(1_000_000, "That number looks too large -- double-check it.")
    )
    .min(1),
});

export type MileageInput = z.infer<typeof mileageInputSchema>;
