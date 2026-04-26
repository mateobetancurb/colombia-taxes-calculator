import { Check, FileDown, Save } from "lucide-react";
import type { TaxComputation } from "../../helpers/tax-calculator";
import { formatCopCurrency, formatNumber } from "../../helpers";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface ResultsPanelProps {
	computation: TaxComputation;
	onExportPdf: () => void;
	onSaveSimulation: () => void;
	isSaved: boolean;
}

function ResultsPanel({
	computation,
	onExportPdf,
	onSaveSimulation,
	isSaved,
}: ResultsPanelProps) {
	return (
		<Card id="results">
			<CardHeader>
				<CardTitle>Results</CardTitle>
				<CardDescription>
					Math view of your retention simulation for monthly income.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
					<p className="text-sm text-slate-600 dark:text-slate-300">
						Retention = (Base in UVT - 95) x 19%
					</p>
					<p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
						{`Retention = (${formatNumber(computation.baseUVT)} - 95) x 19%`}
					</p>
					<p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
						{formatCopCurrency(computation.retention)}
					</p>
				</div>

				<div className="grid gap-3 sm:grid-cols-2">
					<div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
						<p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
							Taxable base
						</p>
						<p className="text-lg font-semibold">
							{formatCopCurrency(computation.taxableBaseCOP)}
						</p>
					</div>
					<div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
						<p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
							Base in UVT
						</p>
						<p className="text-lg font-semibold">
							{formatNumber(computation.baseUVT)} UVT
						</p>
					</div>
				</div>

				<div className="flex flex-col gap-3 sm:flex-row">
					<Button onClick={onExportPdf} className="w-full sm:w-auto">
						<FileDown className="h-4 w-4" />
						Export PDF
					</Button>
					<Button onClick={onSaveSimulation} variant="outline" className="w-full sm:w-auto">
						{isSaved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
						{isSaved ? "Saved" : "Save Simulation"}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

export { ResultsPanel };
