import type { FilingStatus } from "../types";

/** One marginal bracket: this rate applies to income between `from` and
 * `to` (exclusive upper bound is handled by the next bracket's `from`;
 * the last bracket in a table has `to: null` meaning "and above"). */
export interface TaxBracket {
  rate: number;
  from: number;
  to: number | null;
}

/** One IRS standard-mileage-rate period. Most years have exactly one
 * period covering the whole year, but the IRS can (rarely) issue a
 * mid-year rate change -- 2026 is one such year -- so this is always an
 * array, never a single flat number, to avoid silently applying the
 * wrong half-year's rate. */
export interface MileageRatePeriod {
  /** ISO date, inclusive. */
  from: string;
  /** ISO date, inclusive. */
  to: string;
  /** Dollars per business mile for this period. */
  rate: number;
}

export interface TaxYearConstants {
  taxYear: number;
  /** Self-employment tax rate mechanics -- stable by law across years,
   * repeated per-year (not hoisted to a single shared constant) so a
   * future law change is a one-line diff in exactly the year it takes
   * effect, not a shared constant someone has to remember also affects
   * every other year. */
  seTax: {
    /** The 92.35% net-earnings adjustment (IRC Sec. 1402(a)(12)). */
    netEarningsFactor: number;
    /** 12.4% Social Security portion of the 15.3% SE tax rate. */
    socialSecurityRate: number;
    /** 2.9% Medicare portion of the 15.3% SE tax rate. */
    medicareRate: number;
    /** Additional Medicare Tax rate (0.9%) above the threshold below. */
    additionalMedicareRate: number;
  };
  /** Maximum earnings subject to the 12.4% Social Security portion this
   * year (SSA.gov contribution and benefit base). Medicare portion is
   * uncapped. */
  socialSecurityWageBase: number;
  /** Additional Medicare Tax thresholds by filing status (IRC Sec. 1401(b)(2)).
   * Note: MFS is not yet supported as a filing status in this tool (see
   * FilingStatus type) -- if added later, its threshold is $125,000. */
  additionalMedicareThreshold: Record<FilingStatus, number>;
  standardDeduction: Record<FilingStatus, number>;
  federalBrackets: Record<FilingStatus, TaxBracket[]>;
  /** IRS Form 1040-ES due dates for this tax year, as ISO date strings.
   * Periods are NOT equal three-month quarters -- Q2 covers 2 months,
   * Q4 covers 4 -- see quarterly-estimate.ts. */
  quarterlyDueDates: [string, string, string, string];
  /** IRS optional standard mileage rate(s) for business use this year.
   * See MileageRatePeriod -- almost always one period, occasionally more
   * if the IRS issues a mid-year change. */
  standardMileageRatePeriods: MileageRatePeriod[];
}
