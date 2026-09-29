import { getConstantsForYear } from "./constants";
import { calculateFederalIncomeTax } from "./federal-income-tax";
import { calculateQuarterlyEstimate } from "./quarterly-estimate";
import { calculateSelfEmploymentTax } from "./se-tax";
import type { TaxCalcInput, TaxCalcResult } from "./types";

function roundCents(amount: number): number {
  return Math.round(amount * 100) / 100;
}

/**
 * The single entry point for this whole module -- called identically by
 * the API route (to ground the LLM explanation in real numbers) and the
 * client component (for instant, no-network display). Never compute this
 * number two different ways in two different places.
 */
export function calculateFullResult(input: TaxCalcInput): TaxCalcResult {
  const constants = getConstantsForYear(input.taxYear);

  const netEarnings = roundCents(Math.max(0, input.grossEarnings - input.businessExpenses));

  const se = calculateSelfEmploymentTax(netEarnings, input.filingStatus, constants);

  const standardDeduction = constants.standardDeduction[input.filingStatus];
  const taxableIncomeForIncomeTax = roundCents(Math.max(0, netEarnings - se.halfSeTaxDeduction - standardDeduction));

  const estimatedFederalIncomeTax = calculateFederalIncomeTax(
    taxableIncomeForIncomeTax,
    input.filingStatus,
    constants
  );

  const totalEstimatedTax = roundCents(se.seTax + estimatedFederalIncomeTax);
  // Rounds the PERCENTAGE value itself to 2 decimals (e.g. 20.4373... ->
  // 20.44) -- deliberately not reusing roundCents() here, which rounds to
  // cents (2 decimals of a DOLLAR amount) and would silently produce a
  // value with too many decimal places if applied to a percentage ratio
  // instead. Found live: an earlier version of this line composed
  // roundCents with an extra /100, over-dividing and showing 20.4373%
  // instead of 20.44% -- correct dollar figures throughout, but wrong
  // displayed precision on this one derived field.
  const effectiveRatePercent = netEarnings > 0 ? (totalEstimatedTax / netEarnings) * 100 : 0;
  const effectiveRate = Math.round(effectiveRatePercent * 100) / 100;

  const quarterlyPayments = calculateQuarterlyEstimate(totalEstimatedTax, constants);

  return {
    taxYear: input.taxYear,
    filingStatus: input.filingStatus,
    grossEarnings: input.grossEarnings,
    businessExpenses: input.businessExpenses,
    netEarnings,
    seTaxableEarnings: se.seTaxableEarnings,
    socialSecurityPortion: se.socialSecurityPortion,
    medicarePortion: se.medicarePortion,
    additionalMedicareTax: se.additionalMedicareTax,
    seTax: se.seTax,
    halfSeTaxDeduction: se.halfSeTaxDeduction,
    standardDeduction,
    taxableIncomeForIncomeTax,
    estimatedFederalIncomeTax,
    totalEstimatedTax,
    effectiveRate,
    quarterlyPayments,
  };
}

export type { TaxCalcInput, TaxCalcResult, FilingStatus, QuarterlyPayment } from "./types";
export { CURRENT_TAX_YEAR, SUPPORTED_TAX_YEARS } from "./constants";
