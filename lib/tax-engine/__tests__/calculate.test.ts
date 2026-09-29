import { describe, expect, it } from "vitest";
import { calculateFullResult } from "../calculate";

describe("calculateFullResult -- golden-value scenarios", () => {
  it("$50,000 gross, $5,000 expenses, single, 2026 -- full hand-verified pipeline", () => {
    // Hand-computed against the same IRS Schedule SE / Form 1040-ES
    // mechanics as se-tax.test.ts's externally-sourced example, carried
    // through federal income tax and the quarterly split. See
    // lib/tax-engine/constants/2026.ts for the source-cited bracket
    // figures this depends on.
    const result = calculateFullResult({
      grossEarnings: 50_000,
      businessExpenses: 5_000,
      filingStatus: "single",
      taxYear: 2026,
    });

    expect(result.netEarnings).toBe(45_000);
    expect(result.seTaxableEarnings).toBeCloseTo(41_557.5, 2);
    expect(result.socialSecurityPortion).toBeCloseTo(5_153.13, 2);
    expect(result.medicarePortion).toBeCloseTo(1_205.17, 2);
    expect(result.additionalMedicareTax).toBe(0);
    expect(result.seTax).toBeCloseTo(6_358.3, 2);
    expect(result.halfSeTaxDeduction).toBeCloseTo(3_179.15, 2);
    expect(result.standardDeduction).toBe(16_100);
    expect(result.taxableIncomeForIncomeTax).toBeCloseTo(25_720.85, 2);
    expect(result.estimatedFederalIncomeTax).toBeCloseTo(2_838.5, 2);
    expect(result.totalEstimatedTax).toBeCloseTo(9_196.8, 2);
    // Precision 2, not 1 -- a prior version of this test used precision 1
    // (tolerance +/-0.05), which was loose enough to silently pass a real
    // double-rounding bug that displayed 20.4373 instead of 20.44. This
    // tighter check is the actual regression guard for that bug.
    expect(result.effectiveRate).toBeCloseTo(20.44, 2);
  });

  it("a high-earning MFJ scenario exercises both the SS wage-base cap and the Additional Medicare Tax in one pipeline run", () => {
    const result = calculateFullResult({
      grossEarnings: 300_000,
      businessExpenses: 20_000,
      filingStatus: "married_filing_jointly",
      taxYear: 2026,
    });

    expect(result.netEarnings).toBe(280_000);
    expect(result.socialSecurityPortion).toBeCloseTo(22_878.0, 2); // capped, not 258,580 * 12.4%
    expect(result.additionalMedicareTax).toBeGreaterThan(0); // seTaxableEarnings (258,580) exceeds the $250k MFJ threshold
    expect(result.totalEstimatedTax).toBeGreaterThan(result.seTax); // federal income tax is also owed, not just SE tax
  });
});

describe("calculateFullResult -- structural invariants (robust to hand-arithmetic mistakes in the golden-value tests above)", () => {
  const scenarios = [
    { grossEarnings: 80_000, businessExpenses: 15_000, filingStatus: "single" as const, taxYear: 2026 },
    { grossEarnings: 120_000, businessExpenses: 30_000, filingStatus: "married_filing_jointly" as const, taxYear: 2025 },
    { grossEarnings: 45_000, businessExpenses: 5_000, filingStatus: "head_of_household" as const, taxYear: 2026 },
  ];

  it.each(scenarios)("totalEstimatedTax always equals seTax + estimatedFederalIncomeTax (%o)", (input) => {
    const result = calculateFullResult(input);
    expect(result.totalEstimatedTax).toBeCloseTo(result.seTax + result.estimatedFederalIncomeTax, 2);
  });

  it.each(scenarios)("the four quarterly payments always sum to totalEstimatedTax, to the cent (%o)", (input) => {
    const result = calculateFullResult(input);
    const sum = result.quarterlyPayments.reduce((total, q) => total + q.amount, 0);
    expect(sum).toBeCloseTo(result.totalEstimatedTax, 2);
    expect(result.quarterlyPayments).toHaveLength(4);
  });

  it.each(scenarios)("netEarnings is always grossEarnings minus businessExpenses, floored at 0 (%o)", (input) => {
    const result = calculateFullResult(input);
    expect(result.netEarnings).toBeCloseTo(Math.max(0, input.grossEarnings - input.businessExpenses), 2);
  });

  it.each(scenarios)("effectiveRate never has more than 2 decimal places (%o)", (input) => {
    const result = calculateFullResult(input);
    // Regression guard for a real double-rounding bug found during
    // manual live testing (see calculate.ts's effectiveRate comment) --
    // caught a value like 20.4373 that should have been 20.44.
    expect(result.effectiveRate).toBeCloseTo(Math.round(result.effectiveRate * 100) / 100, 10);
  });

  it("business expenses exceeding gross earnings produce zero tax everywhere, never negative", () => {
    const result = calculateFullResult({
      grossEarnings: 10_000,
      businessExpenses: 15_000,
      filingStatus: "single",
      taxYear: 2026,
    });
    expect(result.netEarnings).toBe(0);
    expect(result.seTax).toBe(0);
    expect(result.estimatedFederalIncomeTax).toBe(0);
    expect(result.totalEstimatedTax).toBe(0);
    expect(result.effectiveRate).toBe(0);
  });

  it("throws a clear error for an unsupported tax year rather than silently using the wrong year's figures", () => {
    expect(() =>
      calculateFullResult({
        grossEarnings: 50_000,
        businessExpenses: 5_000,
        filingStatus: "single",
        taxYear: 1999,
      })
    ).toThrow(/1999/);
  });

  it("2025 and 2026 produce different results for the same input -- confirms the year parameter actually changes which constants are used", () => {
    const input2025 = { grossEarnings: 60_000, businessExpenses: 5_000, filingStatus: "single" as const, taxYear: 2025 };
    const input2026 = { ...input2025, taxYear: 2026 };
    const result2025 = calculateFullResult(input2025);
    const result2026 = calculateFullResult(input2026);
    expect(result2025.totalEstimatedTax).not.toBeCloseTo(result2026.totalEstimatedTax, 2);
  });
});
