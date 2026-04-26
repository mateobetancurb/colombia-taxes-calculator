import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, RotateCcw, Trash2 } from "lucide-react";
import { CalculatorTabs } from "@/components/calculator/CalculatorTabs";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { ResultsPanel } from "@/components/results/ResultsPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  calculateForCalculator,
  createInitialCalculatorInputs,
  defaultCalculatorId,
  getCalculatorById,
  type CalculationResult,
  type CalculatorId,
  type CalculatorInputState,
} from "@/domain/tax/calculators";
import { app as esApp, formatDateLabel } from "@/i18n/es";
import {
  clearCurrentSimulationDraft,
  clearSavedSimulations,
  deleteSimulation,
  readCurrentSimulationDraft,
  readSavedSimulations,
  saveCurrentSimulationDraft,
  saveSimulation,
  type SavedSimulation,
} from "@/services/storage/simulation-storage";
import { formatCopCurrency } from "@/utils/formatters";

const LazyIncomeDonutChart = lazy(async () => {
  const module = await import("@/components/dashboard/IncomeDonutChart");
  return { default: module.IncomeDonutChart };
});

interface CalculatorRuntimeState {
  calculatorInputs: Record<CalculatorId, CalculatorInputState>;
  computation: CalculationResult;
}

function createInitialCalculatorRuntimeState(): CalculatorRuntimeState {
  const initialInputs = createInitialCalculatorInputs();
  return {
    calculatorInputs: initialInputs,
    computation: calculateForCalculator(defaultCalculatorId, initialInputs[defaultCalculatorId]),
  };
}

function App() {
  const [activeCalculatorId, setActiveCalculatorId] = useState<CalculatorId>(defaultCalculatorId);
  const [calculatorRuntimeState, setCalculatorRuntimeState] = useState<CalculatorRuntimeState>(
    createInitialCalculatorRuntimeState,
  );
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [savedSimulations, setSavedSimulations] = useState<SavedSimulation[]>([]);
  const [saveLabel, setSaveLabel] = useState<string>(esApp.nombreCalculadoraPlaceholder);
  const [isDraftReady, setIsDraftReady] = useState<boolean>(false);
  const [isClearHistoryModalOpen, setIsClearHistoryModalOpen] = useState<boolean>(false);
  const [isResetSimulationModalOpen, setIsResetSimulationModalOpen] = useState<boolean>(false);
  const { calculatorInputs, computation } = calculatorRuntimeState;
  const hasUserEnteredData = useMemo(() => {
    const initialInputs = createInitialCalculatorInputs();
    return (Object.keys(calculatorInputs) as CalculatorId[]).some(
      (calculatorId) =>
        JSON.stringify(calculatorInputs[calculatorId]) !== JSON.stringify(initialInputs[calculatorId]),
    );
  }, [calculatorInputs]);

  useEffect(() => {
    const hasDarkClass = document.documentElement.classList.contains("dark");
    setIsDark(hasDarkClass);
    setSavedSimulations(readSavedSimulations());

    const draft = readCurrentSimulationDraft();
    if (draft) {
      const restoredInput = draft.calculatorInputs[draft.activeCalculatorId];
      if (restoredInput) {
        setActiveCalculatorId(draft.activeCalculatorId);
        setCalculatorRuntimeState({
          calculatorInputs: draft.calculatorInputs,
          computation: calculateForCalculator(draft.activeCalculatorId, restoredInput),
        });
        if (draft.saveLabel.trim()) {
          setSaveLabel(draft.saveLabel);
        }
      } else {
        clearCurrentSimulationDraft();
      }
    }

    setIsDraftReady(true);
  }, []);

  useEffect(() => {
    if (!isDraftReady) {
      return;
    }

    saveCurrentSimulationDraft({
      activeCalculatorId,
      calculatorInputs,
      saveLabel,
    });
  }, [activeCalculatorId, calculatorInputs, isDraftReady, saveLabel]);

  const handleToggleTheme = useCallback(() => {
    document.documentElement.classList.toggle("dark");
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const handleSaveSimulation = useCallback(() => {
    const activeInput = calculatorInputs[activeCalculatorId];
    const simulation: SavedSimulation = {
      id: `${Date.now()}`,
      name: saveLabel.trim() || getCalculatorById(activeCalculatorId).title,
      createdAt: new Date().toISOString(),
      calculatorId: activeCalculatorId,
      input: activeInput,
      result: computation,
    };
    const next = saveSimulation(simulation);
    setSavedSimulations(next);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 1800);
  }, [activeCalculatorId, calculatorInputs, computation, saveLabel]);

  const handleExportPdf = useCallback(() => {
    window.print();
  }, []);

  const handleExportJson = useCallback(() => {
    const payload = {
      exportedAt: new Date().toISOString(),
      calculator: getCalculatorById(activeCalculatorId),
      input: calculatorInputs[activeCalculatorId],
      result: computation,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${activeCalculatorId}-${Date.now()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }, [activeCalculatorId, calculatorInputs, computation]);

  const handleCalculatorChange = useCallback((calculatorId: CalculatorId) => {
    setActiveCalculatorId(calculatorId);
    setCalculatorRuntimeState((prev) => ({
      calculatorInputs: prev.calculatorInputs,
      computation: calculateForCalculator(calculatorId, prev.calculatorInputs[calculatorId]),
    }));
  }, []);

  const handleInputChange = useCallback(
    (calculatorId: CalculatorId, input: CalculatorInputState) => {
      setCalculatorRuntimeState((prev) => {
        const nextInputs = {
          ...prev.calculatorInputs,
          [calculatorId]: input,
        };
        return {
          calculatorInputs: nextInputs,
          computation:
            calculatorId === activeCalculatorId
              ? calculateForCalculator(calculatorId, input)
              : prev.computation,
        };
      });
    },
    [activeCalculatorId],
  );

  const handleRestoreSimulation = useCallback((simulation: SavedSimulation) => {
    setActiveCalculatorId(simulation.calculatorId);
    setCalculatorRuntimeState((prev) => ({
      calculatorInputs: {
        ...prev.calculatorInputs,
        [simulation.calculatorId]: simulation.input,
      },
      computation: simulation.result,
    }));
    setSaveLabel(simulation.name);
  }, []);

  const handleDeleteSimulation = useCallback((simulationId: string) => {
    setSavedSimulations(deleteSimulation(simulationId));
  }, []);

  const handleClearSavedHistory = useCallback(() => {
    setSavedSimulations(clearSavedSimulations());
  }, []);

  const handleConfirmClearSavedHistory = useCallback(() => {
    handleClearSavedHistory();
    setIsClearHistoryModalOpen(false);
  }, [handleClearSavedHistory]);

  const handleResetCurrentSimulation = useCallback(() => {
    setActiveCalculatorId(defaultCalculatorId);
    setCalculatorRuntimeState(createInitialCalculatorRuntimeState());
    setSaveLabel(esApp.nombreCalculadoraPlaceholder);
    setIsSaved(false);
    clearCurrentSimulationDraft();
  }, []);

  const handleConfirmResetCurrentSimulation = useCallback(() => {
    handleResetCurrentSimulation();
    setIsResetSimulationModalOpen(false);
  }, [handleResetCurrentSimulation]);

  const handleCloseSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const handleOpenSidebar = useCallback(() => setIsSidebarOpen(true), []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="lg:flex">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
          onExportPdf={handleExportPdf}
          onSaveSimulation={handleSaveSimulation}
        />

        <div className="min-h-screen flex-1">
          <Header
            isDark={isDark}
            onToggleTheme={handleToggleTheme}
            onOpenSidebar={handleOpenSidebar}
          />

          <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 md:px-8">
            <section id="dashboard" className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold mb-5">{esApp.vistaFinanciera}</h2>
                <p className="mt-2 max-w-3xl text-sm mb-10 text-slate-600 dark:text-slate-300">
                  {esApp.vistaFinancieraDescripcion}
                </p>
              </div>
              <SummaryCards computation={computation} />
              <section>
                <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <h2 className="text-2xl font-semibold">{esApp.seccionCalculadora}</h2>
                  {hasUserEnteredData ? (
                    <Button
                      type="button"
                      variant="warning"
                      onClick={() => setIsResetSimulationModalOpen(true)}
                    >
                      <AlertTriangle className="h-4 w-4" aria-hidden />
                      {esApp.reiniciarSimulacionActual}
                    </Button>
                  ) : null}
                </div>
                <p className="mb-5 text-sm text-slate-600 dark:text-slate-300">
                  {esApp.reiniciarSimulacionActualDescripcion}
                </p>
                <CalculatorTabs
                  activeCalculatorId={activeCalculatorId}
                  calculatorInputs={calculatorInputs}
                  onCalculatorChange={handleCalculatorChange}
                  onInputChange={handleInputChange}
                />
              </section>
              <Suspense
                fallback={
                  <Card className="h-full">
                    <CardContent className="h-[280px] pt-6 text-sm text-slate-500 dark:text-slate-400">
                      {esApp.cargandoGrafico}
                    </CardContent>
                  </Card>
                }
              >
                <LazyIncomeDonutChart computation={computation} />
              </Suspense>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
              <h2 className="sr-only">{esApp.seccionResultados}</h2>
              <ResultsPanel
                computation={computation}
                onExportPdf={handleExportPdf}
                onExportJson={handleExportJson}
                onSaveSimulation={handleSaveSimulation}
                isSaved={isSaved}
                saveLabel={saveLabel}
                onSaveLabelChange={setSaveLabel}
              />

              <Card>
                <CardHeader>
                  <CardTitle>{esApp.contextoPerfil}</CardTitle>
                  <CardDescription>{esApp.contextoPerfilDescripcion}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <p>
                    {esApp.calculadoraActiva}:{" "}
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {getCalculatorById(computation.calculatorId).title}
                    </span>
                  </p>
                  <p>
                    {computation.primaryTaxLabel}:{" "}
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {formatCopCurrency(computation.primaryTaxAmount)}
                    </span>
                  </p>
                  <p>
                    {computation.socialSecurityLabel}:{" "}
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {formatCopCurrency(computation.socialSecurityAmount)}
                    </span>
                  </p>
                </CardContent>
              </Card>
            </section>

            <section id="history">
              <h2 className="sr-only">{esApp.seccionHistorial}</h2>
              <Card>
                <CardHeader>
                  <CardTitle>{esApp.historialTitulo}</CardTitle>
                  <CardDescription>{esApp.historialDescripcion}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {savedSimulations.length ? (
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => setIsClearHistoryModalOpen(true)}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                        {esApp.eliminarTodoHistorial}
                      </Button>
                    </div>
                  ) : null}
                  {savedSimulations.length ? (
                    savedSimulations.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 dark:border-slate-800 md:flex-row md:items-center md:justify-between"
                      >
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {getCalculatorById(item.calculatorId).title} -{" "}
                            {formatDateLabel(item.createdAt)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="default"
                            onClick={() => handleRestoreSimulation(item)}
                          >
                            <RotateCcw className="h-4 w-4" aria-hidden />
                            {esApp.restaurar}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteSimulation(item.id)}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden />
                            {esApp.eliminar}
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {esApp.historialVacio}
                    </p>
                  )}
                </CardContent>
              </Card>
            </section>
          </main>
          <div className="px-4 md:px-8">
            <Footer />
          </div>
        </div>
      </div>

      {isClearHistoryModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-history-title"
          aria-describedby="clear-history-description"
          onClick={() => setIsClearHistoryModalOpen(false)}
        >
          <Card className="w-full max-w-md" onClick={(event) => event.stopPropagation()}>
            <CardHeader>
              <CardTitle id="clear-history-title">{esApp.confirmarEliminarHistorialTitulo}</CardTitle>
              <CardDescription id="clear-history-description">
                {esApp.confirmarEliminarHistorialDescripcion}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsClearHistoryModalOpen(false)}
              >
                {esApp.cancelar}
              </Button>
              <Button type="button" variant="destructive" onClick={handleConfirmClearSavedHistory}>
                <Trash2 className="h-4 w-4" aria-hidden />
                {esApp.confirmarEliminar}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {isResetSimulationModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-simulation-title"
          aria-describedby="reset-simulation-description"
          onClick={() => setIsResetSimulationModalOpen(false)}
        >
          <Card className="w-full max-w-md" onClick={(event) => event.stopPropagation()}>
            <CardHeader>
              <CardTitle id="reset-simulation-title">{esApp.confirmarReiniciarSimulacionTitulo}</CardTitle>
              <CardDescription id="reset-simulation-description">
                {esApp.confirmarReiniciarSimulacionDescripcion}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsResetSimulationModalOpen(false)}
              >
                {esApp.cancelar}
              </Button>
              <Button type="button" variant="warning" onClick={handleConfirmResetCurrentSimulation}>
                <AlertTriangle className="h-4 w-4" aria-hidden />
                {esApp.confirmarReiniciar}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

export default App;
