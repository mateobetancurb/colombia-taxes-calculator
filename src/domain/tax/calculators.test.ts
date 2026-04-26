import { describe, expect, it } from "vitest";
import {
  calculateForCalculator,
  createInitialCalculatorInputs,
  type CalculatorId,
} from "@/domain/tax/calculators";

function runCalculator(
  calculatorId: CalculatorId,
  numbers: Record<string, number>,
  selects: Record<string, string> = {},
) {
  const seed = createInitialCalculatorInputs();
  return calculateForCalculator(calculatorId, {
    numbers: {
      ...seed[calculatorId].numbers,
      ...numbers,
    },
    selects: {
      ...seed[calculatorId].selects,
      ...selects,
    },
  });
}

describe("calculator engines", () => {
  it("computes advanced withholding with depurated base", () => {
    const result = runCalculator("withholdingAdvanced", {
      grossIncome: 12_000_000,
      healthContribution: 480_000,
      pensionContribution: 480_000,
      prepaidMedicine: 250_000,
      dependentsDeduction: 300_000,
    });

    expect(result.taxableBaseAmount).toBeGreaterThan(0);
    expect(result.primaryTaxAmount).toBeGreaterThan(0);
    expect(result.netAmount).toBeLessThan(result.referenceAmount);
  });

  it("compares withholding procedures and returns savings metric", () => {
    const result = runCalculator("withholdingProcedureCompare", {
      averageIncome: 18_000_000,
      variabilityPercent: 35,
      fixedProcedure2Base: 16_000_000,
    });

    const savings = result.metrics.find((metric) => metric.key === "annualSavings");
    expect(savings).toBeDefined();
    expect(savings?.amount).toBeGreaterThanOrEqual(0);
    expect(result.assumptions.join(" ")).toContain("Recomendación de conveniencia");
  });

  it("computes independent social security with ARL risk level", () => {
    const result = runCalculator(
      "independentSocialSecurity",
      { monthlyGrossIncome: 10_000_000 },
      { riskLevel: "risk5" },
    );

    expect(result.socialSecurityAmount).toBe(4_000_000);
    expect(result.taxableBaseAmount).toBeGreaterThan(200_000);
    expect(result.primaryTaxAmount).toBeGreaterThan(1_000_000);
  });

  it("computes wealth tax above 72.000 UVT threshold", () => {
    const result = runCalculator("wealthTax", {
      netWorth: 6_500_000_000,
    });

    expect(result.taxableBaseAmount).toBeGreaterThan(0);
    expect(result.primaryTaxAmount).toBeGreaterThan(0);
  });
});
