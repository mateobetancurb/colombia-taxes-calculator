import type {
  CalculationResult,
  CalculatorId,
  CalculatorInputState,
} from "@/domain/tax/calculators";

const STORAGE_KEY = "taxflow_simulations_v2";
const DRAFT_STORAGE_KEY = "taxflow_current_simulation_v1";
const MAX_ITEMS = 25;

export interface SavedSimulation {
  id: string;
  name: string;
  createdAt: string;
  calculatorId: CalculatorId;
  input: CalculatorInputState;
  result: CalculationResult;
}

export interface CurrentSimulationDraft {
  activeCalculatorId: CalculatorId;
  calculatorInputs: Record<CalculatorId, CalculatorInputState>;
  saveLabel: string;
}

function parseStoredValue(rawValue: string | null): SavedSimulation[] {
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue) as SavedSimulation[];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((item) => Boolean(item?.id && item?.calculatorId && item?.result));
  } catch {
    return [];
  }
}

function parseCurrentSimulationDraft(rawValue: string | null): CurrentSimulationDraft | null {
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<CurrentSimulationDraft>;
    if (
      !parsed ||
      typeof parsed !== "object" ||
      typeof parsed.activeCalculatorId !== "string" ||
      !parsed.calculatorInputs ||
      typeof parsed.calculatorInputs !== "object"
    ) {
      return null;
    }

    return {
      activeCalculatorId: parsed.activeCalculatorId as CalculatorId,
      calculatorInputs: parsed.calculatorInputs as Record<CalculatorId, CalculatorInputState>,
      saveLabel: typeof parsed.saveLabel === "string" ? parsed.saveLabel : "",
    };
  } catch {
    return null;
  }
}

export function readSavedSimulations(): SavedSimulation[] {
  return parseStoredValue(localStorage.getItem(STORAGE_KEY));
}

export function saveSimulation(simulation: SavedSimulation): SavedSimulation[] {
  const current = readSavedSimulations();
  const next = [simulation, ...current].slice(0, MAX_ITEMS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function deleteSimulation(simulationId: string): SavedSimulation[] {
  const current = readSavedSimulations();
  const next = current.filter((item) => item.id !== simulationId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function clearSavedSimulations(): SavedSimulation[] {
  localStorage.removeItem(STORAGE_KEY);
  return [];
}

export function readCurrentSimulationDraft(): CurrentSimulationDraft | null {
  return parseCurrentSimulationDraft(localStorage.getItem(DRAFT_STORAGE_KEY));
}

export function saveCurrentSimulationDraft(draft: CurrentSimulationDraft): void {
  localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
}

export function clearCurrentSimulationDraft(): void {
  localStorage.removeItem(DRAFT_STORAGE_KEY);
}
