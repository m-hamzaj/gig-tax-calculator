import type { TaxYearConstants } from "./constants";
import type { QuarterlyPayment } from "./types";

const LABELS: QuarterlyPayment["label"][] = ["Q1", "Q2", "Q3", "Q4"];

function roundCents(amount: number): number {
  return Math.round(amount * 100) / 100;
}

/**
 * Splits total estimated tax into four EQUAL payments against the year's
 * real IRS due dates. The IRS does not actually require equal quarterly
 * payments (income can vary through the year, and there's an
 * annualized-installment method for uneven earners) -- equal quarters is
 * the standard simplifying assumption nearly every consumer-facing
 * estimator uses, and is disclosed as such in the UI rather than
 * presented as the only correct approach.
 */
export function calculateQuarterlyEstimate(totalTaxOwed: number, constants: TaxYearConstants): QuarterlyPayment[] {
  if (totalTaxOwed <= 0) {
    return constants.quarterlyDueDates.map((dueDate, i) => ({
      label: LABELS[i],
      dueDate,
      amount: 0,
    }));
  }

  const perQuarter = roundCents(totalTaxOwed / 4);

  return constants.quarterlyDueDates.map((dueDate, i) => ({
    label: LABELS[i],
    dueDate,
    // Last quarter absorbs any rounding remainder so the four payments
    // sum exactly to totalTaxOwed, not a few cents short/over.
    amount: i === 3 ? roundCents(totalTaxOwed - perQuarter * 3) : perQuarter,
  }));
}
