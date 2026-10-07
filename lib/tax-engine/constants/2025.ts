import type { TaxYearConstants } from "./types";

/**
 * Tax year 2025 constants.
 *
 * SOURCES (verified 2026-09-29 via web search against reporting citing
 * the IRS's own inflation-adjustment release; re-confirm against irs.gov
 * directly before this figure is relied on for a real filing):
 *   - Federal brackets + standard deduction: IRS tax year 2025
 *     inflation-adjustment release (irs.gov/newsroom). NOTE: some
 *     secondary sources report a slightly different standard-deduction
 *     figure for 2025, apparently reflecting a later legislative change
 *     (One Big Beautiful Bill) that adjusted the originally-announced
 *     amount -- the figures below use the more recent/higher values;
 *     re-verify directly against irs.gov if this year's numbers are used
 *     for anything beyond a rough estimate.
 *   - Social Security wage base ($176,100): SSA.gov contribution and
 *     benefit base announcement for 2025.
 *   - SE tax mechanics: stable by law, unchanged from 2026's file.
 *   - Standard mileage rate (70 cents/mile, business use): IRS Notice
 *     2025-05, announced Dec 2024, effective for all of calendar year
 *     2025 (verified 2026-10-07 via web search against reporting citing
 *     the IRS release).
 *
 * See ../__tests__/calculate.test.ts for the golden-value tests these
 * figures are checked against.
 */
export const TAX_YEAR_2025: TaxYearConstants = {
  taxYear: 2025,

  seTax: {
    netEarningsFactor: 0.9235,
    socialSecurityRate: 0.124,
    medicareRate: 0.029,
    additionalMedicareRate: 0.009,
  },

  socialSecurityWageBase: 176_100,

  additionalMedicareThreshold: {
    single: 200_000,
    married_filing_jointly: 250_000,
    head_of_household: 200_000,
  },

  standardDeduction: {
    single: 15_000,
    married_filing_jointly: 30_000,
    head_of_household: 22_500,
  },

  federalBrackets: {
    single: [
      { rate: 0.1, from: 0, to: 11_925 },
      { rate: 0.12, from: 11_925, to: 48_475 },
      { rate: 0.22, from: 48_475, to: 103_350 },
      { rate: 0.24, from: 103_350, to: 197_300 },
      { rate: 0.32, from: 197_300, to: 250_525 },
      { rate: 0.35, from: 250_525, to: 626_350 },
      { rate: 0.37, from: 626_350, to: null },
    ],
    married_filing_jointly: [
      { rate: 0.1, from: 0, to: 23_850 },
      { rate: 0.12, from: 23_850, to: 96_950 },
      { rate: 0.22, from: 96_950, to: 206_700 },
      { rate: 0.24, from: 206_700, to: 394_600 },
      { rate: 0.32, from: 394_600, to: 501_050 },
      { rate: 0.35, from: 501_050, to: 751_600 },
      { rate: 0.37, from: 751_600, to: null },
    ],
    head_of_household: [
      { rate: 0.1, from: 0, to: 17_000 },
      { rate: 0.12, from: 17_000, to: 64_850 },
      { rate: 0.22, from: 64_850, to: 103_350 },
      { rate: 0.24, from: 103_350, to: 197_300 },
      { rate: 0.32, from: 197_300, to: 250_500 },
      { rate: 0.35, from: 250_500, to: 626_350 },
      { rate: 0.37, from: 626_350, to: null },
    ],
  },

  // June 15, 2025 fell on a Sunday, so Q2 shifts to Monday June 16.
  quarterlyDueDates: ["2025-04-15", "2025-06-16", "2025-09-15", "2026-01-15"],

  // One flat rate for the full year (no mid-year change in 2025).
  standardMileageRatePeriods: [{ from: "2025-01-01", to: "2025-12-31", rate: 0.7 }],
};
