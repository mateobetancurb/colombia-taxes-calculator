import { useEffect, useState } from "react";
import { Footer } from "./components/Footer";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { SummaryCards } from "./components/dashboard/SummaryCards";
import { IncomeDonutChart } from "./components/dashboard/IncomeDonutChart";
import { CalculatorTabs } from "./components/calculator/CalculatorTabs";
import { ResultsPanel } from "./components/results/ResultsPanel";
import {
	calculateTaxSimulation,
	type TaxComputation,
} from "./helpers/tax-calculator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";

function App() {
	const [computation, setComputation] = useState<TaxComputation>(
		calculateTaxSimulation({
			profile: "employee",
			grossIncome: 0,
			rentaExenta: 0,
			otherDeductions: 0,
		})
	);
	const [isDark, setIsDark] = useState<boolean>(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
	const [isSaved, setIsSaved] = useState<boolean>(false);

	useEffect(() => {
		const hasDarkClass = document.documentElement.classList.contains("dark");
		setIsDark(hasDarkClass);
	}, []);

	const handleToggleTheme = () => {
		document.documentElement.classList.toggle("dark");
		setIsDark(document.documentElement.classList.contains("dark"));
	};

	const handleSaveSimulation = () => {
		const history = JSON.parse(localStorage.getItem("taxflow_simulations") || "[]");
		const simulation = {
			createdAt: new Date().toISOString(),
			computation,
		};
		localStorage.setItem(
			"taxflow_simulations",
			JSON.stringify([simulation, ...history].slice(0, 25))
		);
		setIsSaved(true);
		setTimeout(() => setIsSaved(false), 1800);
	};

	const handleExportPdf = () => {
		window.print();
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
									Dashboard
								</p>
								<h2 className="text-2xl font-semibold">Financial Overview</h2>
							</div>
							<SummaryCards computation={computation} />
							<IncomeDonutChart computation={computation} />
						</section>

						<section>
							<CalculatorTabs onCalculationChange={setComputation} />
						</section>

						<section className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
							<ResultsPanel
								computation={computation}
								onExportPdf={handleExportPdf}
								onSaveSimulation={handleSaveSimulation}
								isSaved={isSaved}
							/>

							<Card>
								<CardHeader>
									<CardTitle>Profile Context</CardTitle>
									<CardDescription>
										Quick interpretation of your current simulation.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
									<p>
										Profile selected:{" "}
										<span className="font-semibold capitalize text-slate-900 dark:text-slate-100">
											{computation.profile}
										</span>
									</p>
									<p>
										Social security rate applied:{" "}
										<span className="font-semibold text-slate-900 dark:text-slate-100">
											{(computation.socialSecurityRate * 100).toFixed(0)}%
										</span>
									</p>
									<p>
										Use the simulator values as guidance and validate final filing
										with your accountant.
									</p>
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
