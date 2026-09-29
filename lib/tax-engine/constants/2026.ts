import type { TaxYearConstants } from "./types";

/**
 * Tax year 2026 constants.
 *
 * SOURCES (verified 2026-09-29 via web search against reporting that
 * cites the IRS's own inflation-adjustment release; re-confirm against
 * irs.gov directly before this figure is relied on for a real filing):
 *   - Federal brackets + standard deduction: IRS Rev. Proc. for tax year
 *     2026 ("IRS releases tax inflation adjustments for tax year 2026,
 *     including amendments from the One Big Beautiful Bill",
 *     irs.gov/newsroom).
 *   - Social Security wage base ($184,500): SSA.gov contribution and
 *     benefit base announcement for 2026.
 *   - SE tax mechanics (92.35%, 15.3%, Additional Medicare Tax
 *     thresholds): stable by law (IRC Sec. 1401/1402), not an annual
 *     inflation adjustment -- unchanged from prior years' verification.
 *
 * IMPORTANT: these figures must be RE-VERIFIED directly against irs.gov
 * and ssa.gov each year before adding/updating a constants file -- no
 * official machine-readable IRS API exists, so this is a manual,
 * cited process. See golden-value tests in ../__tests__/calculate.test.ts,
 * which must pass against hand-computed IRS worksheet examples before
 * a year's figures are trusted.
 */
export const TAX_YEAR_2026: TaxYearConstants = {
  taxYear: 2026,

  seTax: {
    netEarningsFactor: 0.9235,
    socialSecurityRate: 0.124,
    medicareRate: 0.029,
    additionalMedicareRate: 0.009,
  },

  socialSecurityWageBase: 184_500,

  additionalMedicareThreshold: {
    single: 200_000,
    married_filing_jointly: 250_000,
    head_of_household: 200_000,
  },

  standardDeduction: {
    single: 16_100,
    married_filing_jointly: 32_200,
    head_of_household: 24_150,
  },

  federalBrackets: {
    single: [
      { rate: 0.1, from: 0, to: 12_400 },
      { rate: 0.12, from: 12_400, to: 50_400 },
      { rate: 0.22, from: 50_400, to: 105_700 },
      { rate: 0.24, from: 105_700, to: 201_775 },
      { rate: 0.32, from: 201_775, to: 256_225 },
      { rate: 0.35, from: 256_225, to: 640_600 },
      { rate: 0.37, from: 640_600, to: null },
    ],
    married_filing_jointly: [
      { rate: 0.1, from: 0, to: 24_800 },
      { rate: 0.12, from: 24_800, to: 100_800 },
      { rate: 0.22, from: 100_800, to: 211_400 },
      { rate: 0.24, from: 211_400, to: 403_550 },
      { rate: 0.32, from: 403_550, to: 512_450 },
      { rate: 0.35, from: 512_450, to: 768_700 },
      { rate: 0.37, from: 768_700, to: null },
    ],
    head_of_household: [
      { rate: 0.1, from: 0, to: 17_700 },
      { rate: 0.12, from: 17_700, to: 67_450 },
      { rate: 0.22, from: 67_450, to: 105_700 },
      { rate: 0.24, from: 105_700, to: 201_750 },
      { rate: 0.32, from: 201_750, to: 256_200 },
      { rate: 0.35, from: 256_200, to: 640_600 },
      { rate: 0.37, from: 640_600, to: null },
    ],
  },

  // IRS Form 1040-ES: periods are Jan-Mar, Apr-May, Jun-Aug, Sep-Dec --
  // NOT equal three-month quarters. Q4 for TY2026 is due Jan 15, 2027.
  quarterlyDueDates: ["2026-04-15", "2026-06-15", "2026-09-15", "2027-01-15"],
};
