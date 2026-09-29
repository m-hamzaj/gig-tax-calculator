import type { FilingStatus } from "./types";
import type { TaxYearConstants } from "./constants";

/** Rounds to the nearest cent. Internal precision throughout this engine
 * is cents, not whole dollars -- the IRS's own Schedule SE worksheet
 * rounds to whole dollars at several intermediate steps, so this
 * estimator's final figures may differ from a hand-filled Schedule SE by
 * a small number of dollars. That's disclosed in the UI copy, not hidden. */
function roundCents(amount: number): number {
  return Math.round(amount * 100) / 100;
}

export interface SeTaxBreakdown {
  seTaxableEarnings: number;
  socialSecurityPortion: number;
  medicarePortion: number;
  additionalMedicareTax: number;
  /** socialSecurityPortion + medicarePortion + additionalMedicareTax. */
  seTax: number;
  /** Half of (socialSecurityPortion + medicarePortion) ONLY -- see the
   * module docstring below for why additionalMedicareTax is excluded. */
  halfSeTaxDeduction: number;
}

/**
 * Computes self-employment tax per IRS Schedule SE mechanics.
 *
 * IMPORTANT ASSUMPTION: this assumes the filer has no OTHER W-2 wages
 * already subject to Social Security tax this year. If they do, the
 * Social Security wage base cap should account for those wages too (the
 * cap applies across combined SE + W-2 earnings, not to SE earnings
 * alone) -- this tool doesn't collect W-2 wage input in v1, so it applies
 * the cap to SE earnings only. Disclosed as a known limitation in the
 * UI, not silently assumed away.
 *
 * The Additional Medicare Tax (0.9%) is computed on seTaxableEarnings
 * (the same 92.35%-adjusted base the regular Medicare portion uses) per
 * Form 8959's self-employment-income line -- NOT on raw net earnings
 * before that adjustment.
 *
 * Only the REGULAR SE tax (Social Security + Medicare portions) is
 * eligible for the "half of SE tax" deduction against federal income
 * tax (IRC Sec. 164(f)) -- the Additional Medicare Tax is explicitly
 * excluded from that deduction by law, so it's tracked separately here
 * rather than folded into one combined figure.
 */
export function calculateSelfEmploymentTax(
  netEarnings: number,
  filingStatus: FilingStatus,
  constants: TaxYearConstants
): SeTaxBreakdown {
  if (netEarnings <= 0) {
    return {
      seTaxableEarnings: 0,
      socialSecurityPortion: 0,
      medicarePortion: 0,
      additionalMedicareTax: 0,
      seTax: 0,
      halfSeTaxDeduction: 0,
    };
  }

  const { netEarningsFactor, socialSecurityRate, medicareRate, additionalMedicareRate } = constants.seTax;

  const seTaxableEarnings = roundCents(netEarnings * netEarningsFactor);

  const socialSecurityBase = Math.min(seTaxableEarnings, constants.socialSecurityWageBase);
  const socialSecurityPortion = roundCents(socialSecurityBase * socialSecurityRate);

  const medicarePortion = roundCents(seTaxableEarnings * medicareRate);

  const additionalMedicareThreshold = constants.additionalMedicareThreshold[filingStatus];
  const amountAboveThreshold = Math.max(0, seTaxableEarnings - additionalMedicareThreshold);
  const additionalMedicareTax = roundCents(amountAboveThreshold * additionalMedicareRate);

  const regularSeTax = socialSecurityPortion + medicarePortion;
  const seTax = roundCents(regularSeTax + additionalMedicareTax);
  const halfSeTaxDeduction = roundCents(regularSeTax / 2);

  return {
    seTaxableEarnings,
    socialSecurityPortion,
    medicarePortion,
    additionalMedicareTax,
    seTax,
    halfSeTaxDeduction,
  };
}
