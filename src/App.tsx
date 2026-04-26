import { useEffect, useState } from "react";
import { Footer } from "./components/Footer";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { SummaryCards } from "./components/dashboard/SummaryCards";
import { IncomeDonutChart } from "./components/dashboard/IncomeDonutChart";
import { CalculatorTabs } from "./components/calculator/CalculatorTabs";
import { ResultsPanel } from "./components/results/ResultsPanel";
import {
  calculateForCalculator,
  createInitialCalculatorInputs,
  defaultCalculatorId,
  getCalculatorById,
  type CalculationResult,
  type CalculatorId,
  type CalculatorInputState,
} from "./helpers/calculators";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { app as esApp, formatDateLabel } from "./locales/es";
import {
  deleteSimulation,
  readSavedSimulations,
  saveSimulation,
  type SavedSimulation,
} from "./lib/simulation-storage";
import { Button } from "./components/ui/button";
import { formatCopCurrency } from "./helpers";

function App() {
  const [activeCalculatorId, setActiveCalculatorId] = useState<CalculatorId>(defaultCalculatorId);
  const [calculatorInputs, setCalculatorInputs] = useState<Record<CalculatorId, CalculatorInputState>>(
    createInitialCalculatorInputs(),
  );
  const [computation, setComputation] = useState<CalculationResult>(() =>
    calculateForCalculator(defaultCalculatorId, createInitialCalculatorInputs()[defaultCalculatorId]),
  );
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [savedSimulations, setSavedSimulations] = useState<SavedSimulation[]>([]);
  const [saveLabel, setSaveLabel] = useState<string>("Planificación 2026");

  useEffect(() => {
    const hasDarkClass = document.documentElement.classList.contains("dark");
    setIsDark(hasDarkClass);
    setSavedSimulations(readSavedSimulations());
  }, []);

  const handleToggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(document.documentElement.classList.contains("dark"));
  };

  const handleSaveSimulation = () => {
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
  };

  const handleExportPdf = () => {
    window.print();
  };

  const handleExportJson = () => {
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
  };

  const handleCalculatorChange = (calculatorId: CalculatorId) => {
    setActiveCalculatorId(calculatorId);
    setComputation(calculateForCalculator(calculatorId, calculatorInputs[calculatorId]));
  };

  const handleInputChange = (calculatorId: CalculatorId, input: CalculatorInputState) => {
    setCalculatorInputs((prev) => ({
      ...prev,
      [calculatorId]: input,
    }));
  };

  const handleRestoreSimulation = (simulation: SavedSimulation) => {
    setActiveCalculatorId(simulation.calculatorId);
    setCalculatorInputs((prev) => ({
      ...prev,
      [simulation.calculatorId]: simulation.input,
    }));
    setComputation(simulation.result);
    setSaveLabel(simulation.name);
  };

  const handleDeleteSimulation = (simulationId: string) => {
    setSavedSimulations(deleteSimulation(simulationId));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="lg:flex">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onExportPdf={handleExportPdf}
          onSaveSimulation={handleSaveSimulation}
        />

        <div className="min-h-screen flex-1">
          <Header
            isDark={isDark}
            onToggleTheme={handleToggleTheme}
            onOpenSidebar={() => setIsSidebarOpen(true)}
          />

          <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 md:px-8">
            <section id="dashboard" className="space-y-4">
              <div>
                <p className="text-sm uppercase tracking-wide text-emerald-600">
                  {esApp.seccionPanel}
                </p>
                <h2 className="text-2xl font-semibold">{esApp.vistaFinanciera}</h2>
              </div>
              <SummaryCards computation={computation} />
              <IncomeDonutChart computation={computation} />
            </section>

            <section>
              <CalculatorTabs
                activeCalculatorId={activeCalculatorId}
                calculatorInputs={calculatorInputs}
                onCalculatorChange={handleCalculatorChange}
                onInputChange={handleInputChange}
                onCalculationChange={setComputation}
              />
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
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
                  <p>{esApp.disclaimerContador}</p>
                </CardContent>
              </Card>
            </section>

            <section id="history">
              <Card>
                <CardHeader>
                  <CardTitle>{esApp.historialTitulo}</CardTitle>
                  <CardDescription>{esApp.historialDescripcion}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {savedSimulations.length ? (
                    savedSimulations.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 dark:border-slate-800 md:flex-row md:items-center md:justify-between"
                      >
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {getCalculatorById(item.calculatorId).title} - {formatDateLabel(item.createdAt)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleRestoreSimulation(item)}
                          >
                            {esApp.restaurar}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteSimulation(item.id)}
                          >
                            {esApp.eliminar}
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">{esApp.historialVacio}</p>
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
    </div>
  );
}

export default App;
