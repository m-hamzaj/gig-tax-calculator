import { describe, expect, it } from "vitest";
import { calculateMileageDeduction } from "../mileage-deduction";
import { getConstantsForYear } from "../constants";

const c2025 = getConstantsForYear(2025);
const c2026 = getConstantsForYear(2026);

describe("calculateMileageDeduction", () => {
  it("applies the single flat rate for a year with one rate period (2025: $0.70/mile)", () => {
    const result = calculateMileageDeduction([10_000], c2025);

    expect(result.periods).toHaveLength(1);
    expect(result.totalMiles).toBe(10_000);
    expect(result.totalDeduction).toBeCloseTo(7_000, 2); // 10,000 * 0.70
  });

  it("applies each half-year's own rate separately for 2026's mid-year rate change", () => {
    // Jan 1 - Jun 30, 2026: $0.725/mile. Jul 1 - Dec 31, 2026: $0.76/mile.
    const result = calculateMileageDeduction([6_000, 6_000], c2026);

    expect(result.periods[0].rate).toBeCloseTo(0.725, 3);
    expect(result.periods[0].deduction).toBeCloseTo(4_350, 2); // 6,000 * 0.725
    expect(result.periods[1].rate).toBeCloseTo(0.76, 3);
    expect(result.periods[1].deduction).toBeCloseTo(4_560, 2); // 6,000 * 0.76

    expect(result.totalMiles).toBe(12_000);
    // Sum of the two periods' deductions must equal the total -- never
    // applying one period's rate to the other period's miles.
    expect(result.totalDeduction).toBeCloseTo(4_350 + 4_560, 2);
  });

  it("throws rather than silently misapplying rates when the input array length doesn't match the year's rate periods", () => {
    expect(() => calculateMileageDeduction([10_000], c2026)).toThrow();
    expect(() => calculateMileageDeduction([1_000, 1_000], c2025)).toThrow();
  });

  it("clamps negative mileage to zero instead of producing a negative deduction", () => {
    const result = calculateMileageDeduction([-500], c2025);
    expect(result.totalMiles).toBe(0);
    expect(result.totalDeduction).toBe(0);
  });
});
