import { UVT_2026 } from "./index";

export type ProfileType = "employee" | "freelancer";

export interface TaxInputValues {
  profile: ProfileType;
  grossIncome: number;
  rentaExenta: number;
  otherDeductions: number;
}

export interface TaxComputation extends TaxInputValues {
  socialSecurityRate: number;
  taxableBaseCOP: number;
  baseUVT: number;
  retention: number;
  socialSecurity: number;
  totalTax: number;
  netIncome: number;
}

export const calculateTaxSimulation = (values: TaxInputValues): TaxComputation => {
  const socialSecurityRate = values.profile === "employee" ? 0.08 : 0.16;
  const socialSecurity = values.grossIncome * socialSecurityRate;
  const taxableBaseCOP = Math.max(
    values.grossIncome - values.rentaExenta - values.otherDeductions - socialSecurity,
    0,
  );
  const baseUVT = taxableBaseCOP / UVT_2026;
  const retention = baseUVT > 95 ? (baseUVT - 95) * 0.19 * UVT_2026 : 0;
  const totalTax = retention + socialSecurity;
  const netIncome = Math.max(values.grossIncome - totalTax, 0);

  return {
    ...values,
    socialSecurityRate,
    taxableBaseCOP,
    baseUVT,
    retention,
    socialSecurity,
    totalTax,
    netIncome,
  };
};
