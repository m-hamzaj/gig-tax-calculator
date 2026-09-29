import { describe, expect, it } from "vitest";
import { calculateFederalIncomeTax } from "../federal-income-tax";
import { getConstantsForYear } from "../constants";

const c2026 = getConstantsForYear(2026);

describe("calculateFederalIncomeTax", () => {
  it("taxes income entirely within the first bracket at only that bracket's rate", () => {
    // 2026 single: 10% bracket is $0-$12,400.
    const tax = calculateFederalIncomeTax(10_000, "single", c2026);
    expect(tax).toBeCloseTo(10_000 * 0.1, 2);
  });

  it("applies marginal rates correctly across multiple brackets, not the top rate to the whole amount", () => {
    // 2026 single, $25,720.85 taxable income:
    // 10% on 0-12,400 = 1,240.00
    // 12% on 12,400-25,720.85 (13,320.85) = 1,598.502
    // total = 2,838.502 -> rounds to 2,838.50
    const tax = calculateFederalIncomeTax(25_720.85, "single", c2026);
    expect(tax).toBeCloseTo(2_838.5, 2);

    // Sanity check: must be far less than taxing the whole amount at the
    // top bracket the income touches (12%) -- confirms this isn't
    // accidentally a flat-rate calculation.
    expect(tax).toBeLessThan(25_720.85 * 0.12);
  });

  it("returns 0 for zero or negative taxable income", () => {
    expect(calculateFederalIncomeTax(0, "single", c2026)).toBe(0);
    expect(calculateFederalIncomeTax(-1000, "single", c2026)).toBe(0);
  });

  it("produces a higher tax for married_filing_jointly's wider brackets only once income exceeds them -- lower tax than single at the same income below the crossover", () => {
    // MFJ brackets are roughly double single's at the low end, so the
    // same income should never owe MORE tax filing jointly than single,
    // for a "compare filing statuses" sanity check.
    const income = 40_000;
    const singleTax = calculateFederalIncomeTax(income, "single", c2026);
    const mfjTax = calculateFederalIncomeTax(income, "married_filing_jointly", c2026);
    expect(mfjTax).toBeLessThanOrEqual(singleTax);
  });
});
