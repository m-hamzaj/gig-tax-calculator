/**
 * Shared types for the tax calculation engine. This module has zero
 * dependency on Next.js/React/the LLM layer -- it's imported identically
 * by the API route (to ground the LLM explanation in real numbers) and by
 * the client component (for instant, no-network display). Never let the
 * UI and the API compute the number two different ways.
 */

export type FilingStatus = "single" | "married_filing_jointly" | "head_of_household";

export interface TaxCalcInput {
  /** Total gross self-employment/1099 earnings for the year, before expenses. */
  grossEarnings: number;
  /** Deductible business expenses (mileage, supplies, home office, etc). */
  businessExpenses: number;
  filingStatus: FilingStatus;
  /** Calendar tax year -- looked up in the constants registry. */
  taxYear: number;
}

export interface QuarterlyPayment {
  label: "Q1" | "Q2" | "Q3" | "Q4";
  /** ISO date string (YYYY-MM-DD) for the IRS due date, accounting for the
   * uneven period lengths (Q2 covers 2 months, Q4 covers 4). */
  dueDate: string;
  amount: number;
}

export interface TaxCalcResult {
  taxYear: number;
  filingStatus: FilingStatus;

  grossEarnings: number;
  businessExpenses: number;
  /** grossEarnings - businessExpenses, floored at 0. */
  netEarnings: number;

  /** netEarnings * 0.9235 -- the base self-employment tax is actually
   * computed on, not raw net earnings (see se-tax.ts). */
  seTaxableEarnings: number;
  /** The 12.4% Social Security portion, capped at the year's wage base. */
  socialSecurityPortion: number;
  /** The 2.9% Medicare portion -- uncapped. */
  medicarePortion: number;
  /** The additional 0.9% Medicare tax above the filing-status threshold.
   * NOT eligible for the half-SE-tax deduction below. */
  additionalMedicareTax: number;
  /** socialSecurityPortion + medicarePortion + additionalMedicareTax. */
  seTax: number;
  /** Half of (socialSecurityPortion + medicarePortion) ONLY -- the
   * Additional Medicare Tax is never eligible for this deduction.
   * Deductible against federal income tax. */
  halfSeTaxDeduction: number;

  standardDeduction: number;
  /** max(0, netEarnings - halfSeTaxDeduction - standardDeduction). A
   * simplified base -- does NOT include the Qualified Business Income
   * (QBI) deduction or other above-the-line deductions/credits. See the
   * disclaimer copy for what this estimate excludes. */
  taxableIncomeForIncomeTax: number;
  estimatedFederalIncomeTax: number;

  totalEstimatedTax: number;
  /** totalEstimatedTax / netEarnings, or 0 if netEarnings is 0. */
  effectiveRate: number;

  quarterlyPayments: QuarterlyPayment[];
}
