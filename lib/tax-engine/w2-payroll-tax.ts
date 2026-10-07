import type { FilingStatus } from "./types";
import type { TaxYearConstants } from "./constants";

function roundCents(amount: number): number {
  return Math.round(amount * 100) / 100;
}

export interface W2PayrollTaxBreakdown {
  socialSecurityWithheld: number;
  medicareWithheld: number;
  additionalMedicareWithheld: number;
  /** socialSecurityWithheld + medicareWithheld + additionalMedicareWithheld. */
  totalEmployeeWithholding: number;
}

/**
 * Computes the EMPLOYEE-side-only FICA withholding on W-2 wages -- the
 * 1099-vs-W2 comparison tool's other half (see se-tax.ts for the 1099
 * side). Deliberately NOT a shared helper with calculateSelfEmploymentTax:
 * the two operate on different bases (raw gross wages here vs. the
 * 92.35%-adjusted seTaxableEarnings there) and the duplication is a
 * couple of one-line cap/threshold checks, not enough to justify a shared
 * abstraction.
 *
 * Unlike SE tax, W-2 wages are NOT reduced by the 92.35% net-earnings
 * factor -- that factor exists specifically because SE tax has to
 * approximate the employer-equivalent share for someone with no employer;
 * a W-2 employee's FICA is withheld on their full gross wages.
 *
 * The employee pays HALF the combined Social Security (12.4%) and
 * Medicare (2.9%) rates -- 6.2% and 1.45% -- because an employer pays the
 * other half separately (not deducted from the employee's paycheck,
 * so not represented here). The Additional Medicare Tax (0.9%) has no
 * employer-paid counterpart at all -- it's withheld in full once wages
 * cross the filing-status threshold.
 *
 * Same simplifying assumption as calculateSelfEmploymentTax: assumes this
 * is the filer's only wage income this year (no combining with other
 * W-2/SE earnings for the wage-base cap or Additional Medicare threshold).
 */
export function calculateW2PayrollTax(
  grossWages: number,
  filingStatus: FilingStatus,
  constants: TaxYearConstants
): W2PayrollTaxBreakdown {
  if (grossWages <= 0) {
    return {
      socialSecurityWithheld: 0,
      medicareWithheld: 0,
      additionalMedicareWithheld: 0,
      totalEmployeeWithholding: 0,
    };
  }

  const { socialSecurityRate, medicareRate, additionalMedicareRate } = constants.seTax;

  const socialSecurityBase = Math.min(grossWages, constants.socialSecurityWageBase);
  const socialSecurityWithheld = roundCents(socialSecurityBase * (socialSecurityRate / 2));

  const medicareWithheld = roundCents(grossWages * (medicareRate / 2));

  const additionalMedicareThreshold = constants.additionalMedicareThreshold[filingStatus];
  const amountAboveThreshold = Math.max(0, grossWages - additionalMedicareThreshold);
  const additionalMedicareWithheld = roundCents(amountAboveThreshold * additionalMedicareRate);

  const totalEmployeeWithholding = roundCents(
    socialSecurityWithheld + medicareWithheld + additionalMedicareWithheld
  );

  return {
    socialSecurityWithheld,
    medicareWithheld,
    additionalMedicareWithheld,
    totalEmployeeWithholding,
  };
}
