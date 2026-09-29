import type { FilingStatus } from "./types";
import type { TaxYearConstants } from "./constants";

function roundCents(amount: number): number {
  return Math.round(amount * 100) / 100;
}

/**
 * Standard progressive marginal-bracket calculation: only the portion of
 * taxableIncome that falls WITHIN each bracket is taxed at that bracket's
 * rate, not the whole income at the top bracket's rate -- a common
 * misunderstanding this function must get right, since it's the single
 * highest-leverage place for a subtle bug to quietly overstate someone's
 * tax bill.
 *
 * SIMPLIFIED ESTIMATE -- this does NOT include the Qualified Business
 * Income (QBI) deduction (a 20% deduction many self-employed filers
 * qualify for, which has its own phase-out/wage-limitation rules for
 * higher earners) or any other above-the-line deductions or tax credits.
 * Omitting QBI means this estimate is likely HIGHER than a filer's real
 * federal income tax -- disclosed explicitly in the UI copy, not a
 * silent gap. Implementing QBI correctly is a deliberate v2 item (see
 * the project plan), not attempted here to avoid a half-correct
 * implementation of a genuinely complex provision.
 */
export function calculateFederalIncomeTax(
  taxableIncome: number,
  filingStatus: FilingStatus,
  constants: TaxYearConstants
): number {
  if (taxableIncome <= 0) return 0;

  const brackets = constants.federalBrackets[filingStatus];
  let tax = 0;

  for (const bracket of brackets) {
    if (taxableIncome <= bracket.from) break;
    const upperBound = bracket.to === null ? taxableIncome : Math.min(taxableIncome, bracket.to);
    const amountInBracket = upperBound - bracket.from;
    if (amountInBracket <= 0) continue;
    tax += amountInBracket * bracket.rate;
  }

  return roundCents(tax);
}
