import type { TaxYearConstants } from "./constants";

function roundCents(amount: number): number {
  return Math.round(amount * 100) / 100;
}

export interface MileagePeriodBreakdown {
  from: string;
  to: string;
  rate: number;
  miles: number;
  deduction: number;
}

export interface MileageDeductionResult {
  periods: MileagePeriodBreakdown[];
  totalMiles: number;
  totalDeduction: number;
}

/**
 * Computes the deduction under the IRS optional standard mileage method
 * (miles * the year's rate) -- NOT the actual-expense method (depreciation,
 * gas, insurance, repairs, etc, times business-use percentage), which this
 * tool doesn't attempt since it requires records this calculator doesn't
 * collect. Disclosed in the paired guide page, not silently assumed away.
 *
 * `milesByPeriod` must have exactly one entry per
 * `constants.standardMileageRatePeriods` period, in the same order --
 * most years that's a single number for the whole year, but a year with a
 * mid-year rate change (see constants/2026.ts) needs miles broken out per
 * period so the right rate applies to the right miles, never one flat
 * rate applied to a year that actually had two.
 */
export function calculateMileageDeduction(
  milesByPeriod: number[],
  constants: TaxYearConstants
): MileageDeductionResult {
  const ratePeriods = constants.standardMileageRatePeriods;

  if (milesByPeriod.length !== ratePeriods.length) {
    throw new Error(
      `Expected ${ratePeriods.length} mileage figure(s) for tax year ${constants.taxYear} (one per rate period), got ${milesByPeriod.length}.`
    );
  }

  const periods: MileagePeriodBreakdown[] = ratePeriods.map((period, i) => {
    const miles = Math.max(0, milesByPeriod[i]);
    return {
      from: period.from,
      to: period.to,
      rate: period.rate,
      miles,
      deduction: roundCents(miles * period.rate),
    };
  });

  return {
    periods,
    totalMiles: periods.reduce((sum, p) => sum + p.miles, 0),
    totalDeduction: roundCents(periods.reduce((sum, p) => sum + p.deduction, 0)),
  };
}
