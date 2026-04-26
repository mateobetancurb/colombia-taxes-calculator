import type {
  CalculationResult,
  CalculatorId,
  CalculatorInputState,
} from "@/domain/tax/calculators";

const STORAGE_KEY = "taxflow_simulations_v2";
const MAX_ITEMS = 25;

export interface SavedSimulation {
  id: string;
  name: string;
  createdAt: string;
  calculatorId: CalculatorId;
  input: CalculatorInputState;
  result: CalculationResult;
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
