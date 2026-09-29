import { describe, expect, it } from "vitest";
import { calculateSelfEmploymentTax } from "../se-tax";
import { getConstantsForYear } from "../constants";

const c2026 = getConstantsForYear(2026);

describe("calculateSelfEmploymentTax", () => {
  it("matches an independently-published worked example ($50,000 net SE income -> ~$7,065 SE tax)", () => {
    // Cross-checked against a real, independently-authored explanation of
    // Schedule SE mechanics (not derived from this codebase), which
    // states: "$50,000 net self-employment income -> $46,175 taxable
    // base ($50,000 x 0.9235) -> ~$7,065 SE tax." This is a real-world
    // sanity check, not just an internally hand-computed value.
    const result = calculateSelfEmploymentTax(50_000, "single", c2026);

    expect(result.seTaxableEarnings).toBeCloseTo(46_175, 2);
    expect(result.seTax).toBeCloseTo(7_064.78, 2); // ~$7,065, matches the source's "about $7,065"
    expect(result.additionalMedicareTax).toBe(0); // well under any threshold
  });

  it("caps the Social Security portion at the year's wage base, but never caps Medicare", () => {
    const netEarnings = 280_000;
    const uncappedSeTaxableEarnings = netEarnings * c2026.seTax.netEarningsFactor; // 258,580
    const result = calculateSelfEmploymentTax(netEarnings, "married_filing_jointly", c2026);

    // Uncapped, Social Security alone would be 258,580 * 0.124 = 32,064.92 --
    // the actual result must be LESS than that, specifically capped at
    // the wage base ($184,500 for 2026) * 12.4%.
    const uncappedSocialSecurity = uncappedSeTaxableEarnings * c2026.seTax.socialSecurityRate;
    expect(result.socialSecurityPortion).toBeLessThan(uncappedSocialSecurity);
    expect(result.socialSecurityPortion).toBeCloseTo(c2026.socialSecurityWageBase * c2026.seTax.socialSecurityRate, 2);

    // Medicare portion is NEVER capped -- it applies to the full
    // seTaxableEarnings regardless of the Social Security wage base.
    expect(result.medicarePortion).toBeCloseTo(uncappedSeTaxableEarnings * c2026.seTax.medicareRate, 2);
  });

  it("applies the Additional Medicare Tax only above the filing-status threshold, and excludes it from the half-SE-tax deduction", () => {
    const netEarnings = 280_000; // seTaxableEarnings = 258,580, above the $250k MFJ threshold
    const result = calculateSelfEmploymentTax(netEarnings, "married_filing_jointly", c2026);

    expect(result.additionalMedicareTax).toBeGreaterThan(0);
    expect(result.additionalMedicareTax).toBeCloseTo(8_580 * c2026.seTax.additionalMedicareRate, 2);

    // halfSeTaxDeduction must be based on (socialSecurityPortion +
    // medicarePortion) ONLY -- excluding additionalMedicareTax, by law.
    const expectedHalf = (result.socialSecurityPortion + result.medicarePortion) / 2;
    expect(result.halfSeTaxDeduction).toBeCloseTo(expectedHalf, 2);
    // Sanity: half of the FULL seTax (including Additional Medicare Tax)
    // would be a different, larger number -- confirm we're not
    // accidentally including it.
    expect(result.halfSeTaxDeduction).not.toBeCloseTo(result.seTax / 2, 2);
  });

  it("returns all zeros for zero or negative net earnings, never negative or NaN values", () => {
    for (const netEarnings of [0, -5000]) {
      const result = calculateSelfEmploymentTax(netEarnings, "single", c2026);
      expect(result.seTax).toBe(0);
      expect(result.socialSecurityPortion).toBe(0);
      expect(result.medicarePortion).toBe(0);
      expect(result.additionalMedicareTax).toBe(0);
      expect(result.halfSeTaxDeduction).toBe(0);
      expect(Number.isNaN(result.seTax)).toBe(false);
    }
  });
});
