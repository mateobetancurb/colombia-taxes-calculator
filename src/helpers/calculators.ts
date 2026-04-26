import { UVT_2026 } from "./index";

export type CalculatorId =
  | "withholdingAdvanced"
  | "withholdingProcedureCompare"
  | "vehicleConsumptionTax"
  | "wealthTax"
  | "serviceExport"
  | "invoiceDeduction"
  | "independentSocialSecurity";

export interface NumberFieldDefinition {
  id: string;
  label: string;
  description?: string;
  defaultValue: number;
}

export interface SelectFieldDefinition {
  id: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  defaultValue: string;
}

export interface CalculatorDefinition {
  id: CalculatorId;
  title: string;
  description: string;
  category: "advanced" | "independent" | "ux";
  numberFields: NumberFieldDefinition[];
  selectFields?: SelectFieldDefinition[];
}

export interface CalculatorInputState {
  numbers: Record<string, number>;
  selects: Record<string, string>;
}

export interface ResultMetric {
  key: string;
  label: string;
  amount: number;
}

export interface CalculationResult {
  calculatorId: CalculatorId;
  title: string;
  description: string;
  referenceAmount: number;
  primaryTaxLabel: string;
  primaryTaxAmount: number;
  socialSecurityLabel: string;
  socialSecurityAmount: number;
  netLabel: string;
  netAmount: number;
  taxableBaseLabel: string;
  taxableBaseAmount: number;
  baseUvtLabel: string;
  baseUVT: number;
  formula: string;
  assumptions: string[];
  metrics: ResultMetric[];
}

const WITHHOLDING_THRESHOLD_UVT = 95;
const WITHHOLDING_RATE = 0.19;
const MONTHS = 12;
const WEALTH_THRESHOLD_UVT = 72000;

const arlRates: Record<string, number> = {
  risk1: 0.00522,
  risk2: 0.01044,
  risk3: 0.02436,
  risk4: 0.0435,
  risk5: 0.0696,
};

function buildResult(
  calculator: CalculatorDefinition,
  payload: Omit<CalculationResult, "calculatorId" | "title" | "description">,
): CalculationResult {
  return {
    calculatorId: calculator.id,
    title: calculator.title,
    description: calculator.description,
    ...payload,
  };
}

function safeRatio(numerator: number, denominator: number): number {
  if (denominator <= 0) {
    return 0;
  }

  return numerator / denominator;
}

function calculateWithholdingByBase(taxableBase: number) {
  const baseUVT = taxableBase / UVT_2026;
  const retention =
    baseUVT > WITHHOLDING_THRESHOLD_UVT
      ? (baseUVT - WITHHOLDING_THRESHOLD_UVT) * WITHHOLDING_RATE * UVT_2026
      : 0;

  return {
    baseUVT,
    retention,
  };
}

function resolveInitialInput(definition: CalculatorDefinition): CalculatorInputState {
  const numbers = Object.fromEntries(
    definition.numberFields.map((field) => [field.id, field.defaultValue]),
  ) as Record<string, number>;
  const selects = Object.fromEntries(
    (definition.selectFields || []).map((field) => [field.id, field.defaultValue]),
  ) as Record<string, string>;

  return {
    numbers,
    selects,
  };
}

function calculateWithholdingAdvanced(
  definition: CalculatorDefinition,
  input: CalculatorInputState,
): CalculationResult {
  const grossIncome = input.numbers.grossIncome || 0;
  const health = input.numbers.healthContribution || 0;
  const pension = input.numbers.pensionContribution || 0;
  const prepaid = input.numbers.prepaidMedicine || 0;
  const dependents = input.numbers.dependentsDeduction || 0;
  const mandatoryDeductions = health + pension + prepaid + dependents;
  const exemptionBase = Math.max(grossIncome - mandatoryDeductions, 0);
  const rentaExenta25 = exemptionBase * 0.25;
  const taxableBase = Math.max(exemptionBase - rentaExenta25, 0);
  const { baseUVT, retention } = calculateWithholdingByBase(taxableBase);
  const socialSecurity = health + pension;
  const totalOutflow = retention + socialSecurity;
  const netIncome = Math.max(grossIncome - totalOutflow, 0);

  return buildResult(definition, {
    referenceAmount: grossIncome,
    primaryTaxLabel: "Retención estimada",
    primaryTaxAmount: retention,
    socialSecurityLabel: "Salud y pensión",
    socialSecurityAmount: socialSecurity,
    netLabel: "Ingreso neto mensual",
    netAmount: netIncome,
    taxableBaseLabel: "Base depurada",
    taxableBaseAmount: taxableBase,
    baseUvtLabel: "Base en UVT",
    baseUVT,
    formula:
      "Base depurada = ingreso - salud - pensión - medicina prepagada - dependientes - 25% renta exenta",
    assumptions: [
      "Modelo práctico para planeación personal 2026.",
      "Se utiliza UVT 2026 de COP 52.374.",
      "El cálculo aplica una tasa de retención lineal para simplificar la simulación.",
    ],
    metrics: [
      { key: "grossIncome", label: "Ingreso bruto", amount: grossIncome },
      { key: "retention", label: "Retención", amount: retention },
      { key: "socialSecurity", label: "Salud + pensión", amount: socialSecurity },
      { key: "netIncome", label: "Ingreso neto", amount: netIncome },
    ],
  });
}

function calculateProcedureComparison(
  definition: CalculatorDefinition,
  input: CalculatorInputState,
): CalculationResult {
  const averageIncome = input.numbers.averageIncome || 0;
  const variability = Math.min(Math.max(input.numbers.variabilityPercent || 0, 0), 90) / 100;
  const fixedBase = input.numbers.fixedProcedure2Base || averageIncome;
  const lowMonthIncome = averageIncome * (1 - variability);
  const highMonthIncome = averageIncome * (1 + variability);
  const proc1Low = calculateWithholdingByBase(lowMonthIncome);
  const proc1High = calculateWithholdingByBase(highMonthIncome);
  const proc1AverageRetention = (proc1Low.retention + proc1High.retention) / 2;
  const proc2 = calculateWithholdingByBase(fixedBase);
  const recommended =
    proc1AverageRetention <= proc2.retention ? "Procedimiento 1" : "Procedimiento 2";
  const annualSavings = Math.abs(proc1AverageRetention - proc2.retention) * MONTHS;

  return buildResult(definition, {
    referenceAmount: averageIncome,
    primaryTaxLabel: "Retención recomendada",
    primaryTaxAmount: Math.min(proc1AverageRetention, proc2.retention),
    socialSecurityLabel: "Ahorro anual potencial",
    socialSecurityAmount: annualSavings,
    netLabel: "Método sugerido",
    netAmount: Math.max(averageIncome - Math.min(proc1AverageRetention, proc2.retention), 0),
    taxableBaseLabel: "Base fija Proc. 2",
    taxableBaseAmount: fixedBase,
    baseUvtLabel: "Base fija en UVT",
    baseUVT: proc2.baseUVT,
    formula: `Proc. 1 mensual promedio: ${proc1AverageRetention.toFixed(0)} COP | Proc. 2 mensual: ${proc2.retention.toFixed(0)} COP`,
    assumptions: [
      `Variabilidad usada: ${(variability * 100).toFixed(0)}%.`,
      `Recomendación práctica: ${recommended}.`,
      "El comparador no reemplaza un concepto tributario formal.",
    ],
    metrics: [
      {
        key: "proc1",
        label: "Retención Proc. 1",
        amount: proc1AverageRetention,
      },
      {
        key: "proc2",
        label: "Retención Proc. 2",
        amount: proc2.retention,
      },
      {
        key: "annualSavings",
        label: "Ahorro anual potencial",
        amount: annualSavings,
      },
      {
        key: "recommendedMonthly",
        label: "Retención sugerida",
        amount: Math.min(proc1AverageRetention, proc2.retention),
      },
    ],
  });
}

function calculateVehicleTax(
  definition: CalculatorDefinition,
  input: CalculatorInputState,
): CalculationResult {
  const vehicleValue = input.numbers.vehicleValue || 0;
  const selectedTariff = input.selects.tariff === "19" ? 0.19 : 0.08;
  const tax = vehicleValue * selectedTariff;
  const totalPurchase = vehicleValue + tax;

  return buildResult(definition, {
    referenceAmount: vehicleValue,
    primaryTaxLabel: "Impuesto al consumo",
    primaryTaxAmount: tax,
    socialSecurityLabel: "Tarifa aplicada",
    socialSecurityAmount: selectedTariff * 100,
    netLabel: "Costo total estimado",
    netAmount: totalPurchase,
    taxableBaseLabel: "Base del impuesto",
    taxableBaseAmount: vehicleValue,
    baseUvtLabel: "Base en UVT",
    baseUVT: vehicleValue / UVT_2026,
    formula: "Impuesto al consumo = valor comercial × tarifa seleccionada (8% o 19%)",
    assumptions: [
      "Simulación útil para validar cambios por reformas o decretos de emergencia económica.",
      "Para motos de más de 200cc puedes contrastar ambos escenarios de tarifa.",
    ],
    metrics: [
      { key: "vehicleValue", label: "Valor del vehículo", amount: vehicleValue },
      { key: "consumptionTax", label: "Impuesto al consumo", amount: tax },
      { key: "totalPurchase", label: "Costo total", amount: totalPurchase },
      {
        key: "taxWeight",
        label: "Participación del impuesto",
        amount: safeRatio(tax, totalPurchase) * totalPurchase,
      },
    ],
  });
}

function calculateWealthTax(
  definition: CalculatorDefinition,
  input: CalculatorInputState,
): CalculationResult {
  const netWorth = input.numbers.netWorth || 0;
  const wealthUVT = netWorth / UVT_2026;
  const thresholdAmount = WEALTH_THRESHOLD_UVT * UVT_2026;
  const taxableAmount = Math.max(netWorth - thresholdAmount, 0);
  const taxableUVT = Math.max(wealthUVT - WEALTH_THRESHOLD_UVT, 0);
  const firstBandUVT = Math.min(taxableUVT, 50000);
  const secondBandUVT = Math.min(Math.max(taxableUVT - 50000, 0), 100000);
  const thirdBandUVT = Math.max(taxableUVT - 150000, 0);
  const tax =
    firstBandUVT * UVT_2026 * 0.005 +
    secondBandUVT * UVT_2026 * 0.01 +
    thirdBandUVT * UVT_2026 * 0.015;
  const postTaxWorth = Math.max(netWorth - tax, 0);

  return buildResult(definition, {
    referenceAmount: netWorth,
    primaryTaxLabel: "Impuesto al patrimonio",
    primaryTaxAmount: tax,
    socialSecurityLabel: "Umbral exento",
    socialSecurityAmount: thresholdAmount,
    netLabel: "Patrimonio luego del impuesto",
    netAmount: postTaxWorth,
    taxableBaseLabel: "Base gravable patrimonio",
    taxableBaseAmount: taxableAmount,
    baseUvtLabel: "Base gravable en UVT",
    baseUVT: taxableUVT,
    formula: "Modelo progresivo práctico desde 72.000 UVT con tres tramos de tarifa.",
    assumptions: [
      "Esta herramienta proyecta escenarios para perfiles de inversión.",
      "La liquidación oficial depende de la reglamentación y del soporte patrimonial.",
    ],
    metrics: [
      { key: "netWorth", label: "Patrimonio líquido", amount: netWorth },
      { key: "taxableAmount", label: "Base gravable", amount: taxableAmount },
      { key: "wealthTax", label: "Impuesto estimado", amount: tax },
      { key: "postTaxWorth", label: "Patrimonio neto proyectado", amount: postTaxWorth },
    ],
  });
}

function calculateServiceExport(
  definition: CalculatorDefinition,
  input: CalculatorInputState,
): CalculationResult {
  const exportIncome = input.numbers.exportIncome || 0;
  const domesticIncome = input.numbers.domesticIncome || 0;
  const deductibleCosts = input.numbers.deductibleCosts || 0;
  const foreignWithholdingRate = Math.max(input.numbers.foreignWithholdingRate || 0, 0) / 100;
  const totalIncome = exportIncome + domesticIncome;
  const taxableBase = Math.max(totalIncome - deductibleCosts, 0);
  const estimatedTax = taxableBase * 0.1;
  const foreignWithholding = exportIncome * foreignWithholdingRate;
  const netTax = Math.max(estimatedTax - foreignWithholding, 0);
  const netIncome = Math.max(totalIncome - netTax, 0);

  return buildResult(definition, {
    referenceAmount: totalIncome,
    primaryTaxLabel: "Retención neta estimada",
    primaryTaxAmount: netTax,
    socialSecurityLabel: "Retención exterior acreditable",
    socialSecurityAmount: foreignWithholding,
    netLabel: "Ingreso neto proyectado",
    netAmount: netIncome,
    taxableBaseLabel: "Base para renta",
    taxableBaseAmount: taxableBase,
    baseUvtLabel: "Base en UVT",
    baseUVT: taxableBase / UVT_2026,
    formula:
      "Base renta = ingresos totales - costos deducibles; impuesto estimado menos retención exterior.",
    assumptions: [
      "Se asume exención de IVA para exportación de servicios de software.",
      "El efecto de retención exterior se modela como descuento del impuesto estimado.",
    ],
    metrics: [
      { key: "exportIncome", label: "Ingresos del exterior", amount: exportIncome },
      { key: "domesticIncome", label: "Ingresos locales", amount: domesticIncome },
      { key: "netTax", label: "Retención neta", amount: netTax },
      { key: "netIncome", label: "Ingreso neto", amount: netIncome },
    ],
  });
}

function calculateInvoiceDeduction(
  definition: CalculatorDefinition,
  input: CalculatorInputState,
): CalculationResult {
  const annualPurchases = input.numbers.annualPurchases || 0;
  const deduction = annualPurchases * 0.05;
  const taxRate = Math.max(input.numbers.estimatedTaxRate || 35, 1) / 100;
  const taxBenefit = deduction * taxRate;
  const effectiveCost = Math.max(annualPurchases - taxBenefit, 0);

  return buildResult(definition, {
    referenceAmount: annualPurchases,
    primaryTaxLabel: "Beneficio fiscal estimado",
    primaryTaxAmount: taxBenefit,
    socialSecurityLabel: "Deducción aplicable (5%)",
    socialSecurityAmount: deduction,
    netLabel: "Costo neto después del beneficio",
    netAmount: effectiveCost,
    taxableBaseLabel: "Compras con factura electrónica",
    taxableBaseAmount: annualPurchases,
    baseUvtLabel: "Compras en UVT",
    baseUVT: annualPurchases / UVT_2026,
    formula: "Beneficio = compras con factura electrónica × 5% × tasa efectiva de renta estimada.",
    assumptions: [
      "Beneficio transitorio para año fiscal 2026.",
      "La tasa efectiva de renta es un parámetro configurable del usuario.",
    ],
    metrics: [
      { key: "annualPurchases", label: "Compras soportadas", amount: annualPurchases },
      { key: "deduction", label: "Deducción aplicable", amount: deduction },
      { key: "taxBenefit", label: "Ahorro tributario estimado", amount: taxBenefit },
      { key: "effectiveCost", label: "Costo neto", amount: effectiveCost },
    ],
  });
}

function calculateIndependentSocialSecurity(
  definition: CalculatorDefinition,
  input: CalculatorInputState,
): CalculationResult {
  const grossIncome = input.numbers.monthlyGrossIncome || 0;
  const riskLevel = input.selects.riskLevel || "risk1";
  const ibc = grossIncome * 0.4;
  const health = ibc * 0.125;
  const pension = ibc * 0.16;
  const arl = ibc * (arlRates[riskLevel] || arlRates.risk1);
  const total = health + pension + arl;
  const net = Math.max(grossIncome - total, 0);

  return buildResult(definition, {
    referenceAmount: grossIncome,
    primaryTaxLabel: "Aportes totales",
    primaryTaxAmount: total,
    socialSecurityLabel: "IBC (40%)",
    socialSecurityAmount: ibc,
    netLabel: "Ingreso neto mensual",
    netAmount: net,
    taxableBaseLabel: "ARL mensual",
    taxableBaseAmount: arl,
    baseUvtLabel: "IBC en UVT",
    baseUVT: ibc / UVT_2026,
    formula: "IBC = ingreso mensual × 40%; aportes = salud + pensión + ARL según riesgo.",
    assumptions: [
      "Modelo de proyección mensual para independientes.",
      "Las tarifas de ARL se aproximan por clase de riesgo 1 a 5.",
    ],
    metrics: [
      { key: "health", label: "Salud", amount: health },
      { key: "pension", label: "Pensión", amount: pension },
      { key: "arl", label: "ARL", amount: arl },
      { key: "net", label: "Ingreso neto", amount: net },
    ],
  });
}

export const calculatorDefinitions: CalculatorDefinition[] = [
  {
    id: "withholdingAdvanced",
    title: "Simulador de retención en la fuente 2026",
    description: "Depura la base para salarios u honorarios con UVT 2026.",
    category: "advanced",
    numberFields: [
      { id: "grossIncome", label: "Ingreso bruto mensual", defaultValue: 0 },
      { id: "healthContribution", label: "Aporte a salud", defaultValue: 0 },
      { id: "pensionContribution", label: "Aporte a pensión", defaultValue: 0 },
      { id: "prepaidMedicine", label: "Medicina prepagada", defaultValue: 0 },
      { id: "dependentsDeduction", label: "Deducción por dependientes", defaultValue: 0 },
    ],
    selectFields: [
      {
        id: "incomeType",
        label: "Tipo de ingreso",
        defaultValue: "salary",
        options: [
          { value: "salary", label: "Salario" },
          { value: "fees", label: "Honorarios" },
        ],
      },
    ],
  },
  {
    id: "withholdingProcedureCompare",
    title: "Comparador de procedimientos de retención",
    description: "Compara Procedimiento 1 y Procedimiento 2 según variabilidad.",
    category: "advanced",
    numberFields: [
      { id: "averageIncome", label: "Ingreso mensual promedio", defaultValue: 0 },
      { id: "variabilityPercent", label: "Variabilidad mensual (%)", defaultValue: 20 },
      {
        id: "fixedProcedure2Base",
        label: "Base fija mensual para Procedimiento 2",
        defaultValue: 0,
      },
    ],
  },
  {
    id: "vehicleConsumptionTax",
    title: "Impuesto al consumo para vehículos",
    description: "Valida impacto del 8% o 19% para motos y vehículos.",
    category: "advanced",
    numberFields: [{ id: "vehicleValue", label: "Valor comercial", defaultValue: 0 }],
    selectFields: [
      {
        id: "vehicleType",
        label: "Tipo",
        defaultValue: "motorcycle",
        options: [
          { value: "motorcycle", label: "Motocicleta" },
          { value: "vehicle", label: "Vehículo" },
        ],
      },
      {
        id: "tariff",
        label: "Tarifa",
        defaultValue: "8",
        options: [
          { value: "8", label: "8%" },
          { value: "19", label: "19%" },
        ],
      },
    ],
  },
  {
    id: "wealthTax",
    title: "Simulador de impuesto al patrimonio",
    description: "Proyecta impuesto con umbral inicial en 72.000 UVT.",
    category: "advanced",
    numberFields: [{ id: "netWorth", label: "Patrimonio líquido", defaultValue: 0 }],
  },
  {
    id: "serviceExport",
    title: "Optimización para exportación de servicios",
    description: "Modela exención de IVA y efecto de retención exterior.",
    category: "independent",
    numberFields: [
      { id: "exportIncome", label: "Ingresos mensuales del exterior", defaultValue: 0 },
      { id: "domesticIncome", label: "Ingresos mensuales locales", defaultValue: 0 },
      { id: "deductibleCosts", label: "Costos deducibles", defaultValue: 0 },
      {
        id: "foreignWithholdingRate",
        label: "Retención en el exterior (%)",
        defaultValue: 10,
      },
    ],
  },
  {
    id: "invoiceDeduction",
    title: "Deducción por factura electrónica",
    description: "Calcula beneficio transitorio de deducción 5% en renta (2026).",
    category: "independent",
    numberFields: [
      { id: "annualPurchases", label: "Compras anuales con factura electrónica", defaultValue: 0 },
      { id: "estimatedTaxRate", label: "Tasa efectiva de renta estimada (%)", defaultValue: 35 },
    ],
  },
  {
    id: "independentSocialSecurity",
    title: "Seguridad social para independientes",
    description: "Calcula IBC al 40% y aportes de salud, pensión y ARL.",
    category: "independent",
    numberFields: [{ id: "monthlyGrossIncome", label: "Ingreso bruto mensual", defaultValue: 0 }],
    selectFields: [
      {
        id: "riskLevel",
        label: "Nivel de riesgo ARL",
        defaultValue: "risk1",
        options: [
          { value: "risk1", label: "Riesgo I" },
          { value: "risk2", label: "Riesgo II" },
          { value: "risk3", label: "Riesgo III" },
          { value: "risk4", label: "Riesgo IV" },
          { value: "risk5", label: "Riesgo V" },
        ],
      },
    ],
  },
];

export const defaultCalculatorId: CalculatorId = "withholdingAdvanced";

const calculatorMap = Object.fromEntries(
  calculatorDefinitions.map((item) => [item.id, item]),
) as Record<CalculatorId, CalculatorDefinition>;

type CalculatorResolver = (
  definition: CalculatorDefinition,
  input: CalculatorInputState,
) => CalculationResult;

const calculatorResolvers: Record<CalculatorId, CalculatorResolver> = {
  withholdingAdvanced: calculateWithholdingAdvanced,
  withholdingProcedureCompare: calculateProcedureComparison,
  vehicleConsumptionTax: calculateVehicleTax,
  wealthTax: calculateWealthTax,
  serviceExport: calculateServiceExport,
  invoiceDeduction: calculateInvoiceDeduction,
  independentSocialSecurity: calculateIndependentSocialSecurity,
};

export function getCalculatorById(calculatorId: CalculatorId): CalculatorDefinition {
  return calculatorMap[calculatorId];
}

export function createInitialCalculatorInputs(): Record<CalculatorId, CalculatorInputState> {
  return Object.fromEntries(
    calculatorDefinitions.map((definition) => [definition.id, resolveInitialInput(definition)]),
  ) as Record<CalculatorId, CalculatorInputState>;
}

export function calculateForCalculator(
  calculatorId: CalculatorId,
  input: CalculatorInputState,
): CalculationResult {
  const definition = getCalculatorById(calculatorId);
  const resolver = calculatorResolvers[calculatorId];
  return resolver(definition, input);
}
