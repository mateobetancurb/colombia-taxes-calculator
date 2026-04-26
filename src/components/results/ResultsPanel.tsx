import { memo } from "react";
import { Check, FileDown, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CalculationResult } from "@/domain/tax/calculators";
import { acciones, app, panelResultados } from "@/i18n/es";
import { formatCopCurrency, formatNumber } from "@/utils/formatters";

interface ResultsPanelProps {
  computation: CalculationResult;
  onExportPdf: () => void;
  onExportJson: () => void;
  onSaveSimulation: () => void;
  isSaved: boolean;
  saveLabel: string;
  onSaveLabelChange: (value: string) => void;
}

function ResultsPanel({
  computation,
  onExportPdf,
  onExportJson,
  onSaveSimulation,
  isSaved,
  saveLabel,
  onSaveLabelChange,
}: ResultsPanelProps) {
  return (
    <Card id="results">
      <CardHeader>
        <CardTitle>{computation.title}</CardTitle>
        <CardDescription>{computation.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
          <p className="text-sm text-slate-600 dark:text-slate-300">{panelResultados.formula}</p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{computation.formula}</p>
          <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
            {formatCopCurrency(computation.primaryTaxAmount)}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {computation.taxableBaseLabel}
            </p>
            <p className="text-lg font-semibold">
              {formatCopCurrency(computation.taxableBaseAmount)}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {computation.baseUvtLabel}
            </p>
            <p className="text-lg font-semibold">{formatNumber(computation.baseUVT)} UVT</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="saveLabel">{app.nombreCalculadora}</Label>
          <Input
            id="saveLabel"
            value={saveLabel}
            onChange={(event) => onSaveLabelChange(event.target.value)}
            placeholder={app.nombreCalculadoraPlaceholder}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={onExportPdf} className="w-full sm:w-auto">
            <FileDown className="h-4 w-4" />
            {acciones.exportarPdf}
          </Button>
          <Button onClick={onExportJson} variant="outline" className="w-full sm:w-auto">
            {acciones.exportarJson}
          </Button>
          <Button onClick={onSaveSimulation} variant="outline" className="w-full sm:w-auto">
            {isSaved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {isSaved ? acciones.guardado : acciones.guardarSimulacion}
          </Button>
        </div>

        <div className="space-y-2 rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
          <p className="font-semibold">{panelResultados.supuestos}</p>
          <ul className="list-disc pl-4">
            {computation.assumptions.map((assumption) => (
              <li key={assumption}>{assumption}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

const MemoizedResultsPanel = memo(ResultsPanel);

export { MemoizedResultsPanel as ResultsPanel };
