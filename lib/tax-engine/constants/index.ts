import type { TaxYearConstants } from "./types";
import { TAX_YEAR_2025 } from "./2025";
import { TAX_YEAR_2026 } from "./2026";

const REGISTRY: Record<number, TaxYearConstants> = {
  2025: TAX_YEAR_2025,
  2026: TAX_YEAR_2026,
};

/** The most recent tax year this tool has figures for -- used as the
 * calculator's default selection. */
export const CURRENT_TAX_YEAR = 2026;

export const SUPPORTED_TAX_YEARS = Object.keys(REGISTRY)
  .map(Number)
  .sort((a, b) => b - a);

/**
 * Throws on an unsupported year rather than silently falling back to a
 * different year's numbers -- a wrong-year tax figure presented as
 * correct is a worse failure mode than a visible error.
 */
export function getConstantsForYear(year: number): TaxYearConstants {
  const constants = REGISTRY[year];
  if (!constants) {
    throw new Error(
      `No tax constants available for year ${year}. Supported years: ${SUPPORTED_TAX_YEARS.join(", ")}.`
    );
  }
  return constants;
}

export type { TaxYearConstants, TaxBracket } from "./types";
