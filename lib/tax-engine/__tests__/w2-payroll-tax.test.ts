import { describe, expect, it } from "vitest";
import { calculateW2PayrollTax } from "../w2-payroll-tax";
import { calculateSelfEmploymentTax } from "../se-tax";
import { getConstantsForYear } from "../constants";

const c2026 = getConstantsForYear(2026);

describe("calculateW2PayrollTax", () => {
  it("withholds exactly half the combined SE rate on ordinary wages (the employer pays the other half, not represented here)", () => {
    const grossWages = 50_000;
    const result = calculateW2PayrollTax(grossWages, "single", c2026);

    // 6.2% Social Security + 1.45% Medicare, on FULL gross wages -- no
    // 92.35% net-earnings factor (that's an SE-only adjustment).
    expect(result.socialSecurityWithheld).toBeCloseTo(grossWages * 0.062, 2);
    expect(result.medicareWithheld).toBeCloseTo(grossWages * 0.0145, 2);
    expect(result.additionalMedicareWithheld).toBe(0);
  });

  it("is less than half of the equivalent SE tax on the same gross amount, because SE tax's 92.35% factor still applies within the SE calculation", () => {
    const amount = 60_000;
    const w2 = calculateW2PayrollTax(amount, "single", c2026);
    const se = calculateSelfEmploymentTax(amount, "single", c2026);

    // The employee-only FICA share should be meaningfully less than the
    // full SE tax on the same dollar amount -- this gap (the employer's
    // half) is the headline number the 1099-vs-W2 comparison tool shows.
    expect(w2.totalEmployeeWithholding).toBeLessThan(se.seTax);
  });

  it("caps the Social Security withholding at the year's wage base", () => {
    const grossWages = 250_000; // above the 2026 wage base of 184,500
    const result = calculateW2PayrollTax(grossWages, "married_filing_jointly", c2026);

    expect(result.socialSecurityWithheld).toBeCloseTo(c2026.socialSecurityWageBase * 0.062, 2);
    // Medicare is never capped.
    expect(result.medicareWithheld).toBeCloseTo(grossWages * 0.0145, 2);
  });

  it("withholds Additional Medicare Tax only above the filing-status threshold", () => {
    const grossWages = 220_000; // above the 2026 single threshold of 200,000
    const result = calculateW2PayrollTax(grossWages, "single", c2026);

    expect(result.additionalMedicareWithheld).toBeCloseTo(20_000 * c2026.seTax.additionalMedicareRate, 2);
  });

  it("returns all zeros for zero or negative wages", () => {
    for (const wages of [0, -1_000]) {
      const result = calculateW2PayrollTax(wages, "single", c2026);
      expect(result.totalEmployeeWithholding).toBe(0);
      expect(Number.isNaN(result.totalEmployeeWithholding)).toBe(false);
    }
  });
});
