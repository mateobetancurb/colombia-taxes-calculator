import { useEffect, useMemo, useState } from "react";
import { Info } from "lucide-react";
import { calculateTaxSimulation, type ProfileType, type TaxComputation } from "../../helpers/tax-calculator";
import { formatCopInput, parseCopInput } from "../../helpers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface CalculatorTabsProps {
	onCalculationChange: (computation: TaxComputation) => void;
}

interface FormState {
	grossIncome: string;
	rentaExenta: string;
	otherDeductions: string;
}

const defaultFormState: FormState = {
	grossIncome: "",
	rentaExenta: "",
	otherDeductions: "",
};

function formatRawToCopInput(rawValue: string) {
	return formatCopInput(parseCopInput(rawValue));
}

function CalculatorTabs({ onCalculationChange }: CalculatorTabsProps) {
	const [profile, setProfile] = useState<ProfileType>("employee");
	const [formValues, setFormValues] = useState<FormState>(defaultFormState);
	const [isTouched, setIsTouched] = useState<Record<keyof FormState, boolean>>({
		grossIncome: false,
		rentaExenta: false,
		otherDeductions: false,
	});

	const parsedValues = useMemo(() => {
		return {
			grossIncome: parseCopInput(formValues.grossIncome),
			rentaExenta: parseCopInput(formValues.rentaExenta),
			otherDeductions: parseCopInput(formValues.otherDeductions),
		};
	}, [formValues]);

	const errors = useMemo(() => {
		return {
			grossIncome:
				parsedValues.grossIncome <= 0
					? "Gross income must be greater than COP 0."
					: "",
			rentaExenta:
				parsedValues.rentaExenta > parsedValues.grossIncome
					? "Renta exenta cannot be greater than gross income."
					: "",
			otherDeductions:
				parsedValues.otherDeductions > parsedValues.grossIncome
					? "This value cannot exceed gross income."
					: "",
		};
	}, [parsedValues]);

	const computation = useMemo(() => {
		return calculateTaxSimulation({
			profile,
			grossIncome: parsedValues.grossIncome,
			rentaExenta: parsedValues.rentaExenta,
			otherDeductions: parsedValues.otherDeductions,
		});
	}, [parsedValues, profile]);

	useEffect(() => {
		onCalculationChange(computation);
	}, [computation, onCalculationChange]);

	const updateField = (field: keyof FormState, value: string) => {
		setFormValues((prev) => ({
			...prev,
			[field]: formatRawToCopInput(value),
		}));
	};

	const markTouched = (field: keyof FormState) => {
		setIsTouched((prev) => ({ ...prev, [field]: true }));
	};

	const profileLabel =
		profile === "employee" ? "Employee deductions" : "Freelancer deductible costs";

	return (
		<Card id="calculator">
			<CardHeader>
				<CardTitle>Tax Calculator</CardTitle>
				<CardDescription>
					Choose your profile and enter monthly values in COP to simulate taxes.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<TooltipProvider delayDuration={120}>
					<Tabs
						value={profile}
						onValueChange={(value) => setProfile(value as ProfileType)}
					>
						<TabsList className="w-full md:w-auto">
							<TabsTrigger value="employee" className="w-1/2 md:w-auto">
								Employee
							</TabsTrigger>
							<TabsTrigger value="freelancer" className="w-1/2 md:w-auto">
								Freelancer
							</TabsTrigger>
						</TabsList>

						<TabsContent value="employee">
							<p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
								Uses social security base rate of 8%.
							</p>
						</TabsContent>
						<TabsContent value="freelancer">
							<p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
								Uses social security base rate of 16%.
							</p>
						</TabsContent>
					</Tabs>

					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2 md:col-span-2">
							<Label htmlFor="grossIncome">Gross monthly income</Label>
							<Input
								id="grossIncome"
								inputMode="numeric"
								placeholder="$ 0"
								value={formValues.grossIncome}
								onChange={(event) => updateField("grossIncome", event.target.value)}
								onBlur={() => markTouched("grossIncome")}
								hasError={Boolean(isTouched.grossIncome && errors.grossIncome)}
								aria-invalid={Boolean(isTouched.grossIncome && errors.grossIncome)}
								aria-describedby="grossIncome-error"
							/>
							{isTouched.grossIncome && errors.grossIncome ? (
								<p id="grossIncome-error" className="text-sm text-rose-500">
									{errors.grossIncome}
								</p>
							) : null}
						</div>

						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<Label htmlFor="rentaExenta">Renta Exenta</Label>
								<Tooltip>
									<TooltipTrigger asChild>
										<button
											type="button"
											className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
											aria-label="What does Renta Exenta mean?"
										>
											<Info className="h-4 w-4" />
										</button>
									</TooltipTrigger>
									<TooltipContent>
										Income exempt from withholding according to Colombian tax rules.
									</TooltipContent>
								</Tooltip>
							</div>
							<Input
								id="rentaExenta"
								inputMode="numeric"
								placeholder="$ 0"
								value={formValues.rentaExenta}
								onChange={(event) => updateField("rentaExenta", event.target.value)}
								onBlur={() => markTouched("rentaExenta")}
								hasError={Boolean(isTouched.rentaExenta && errors.rentaExenta)}
								aria-invalid={Boolean(isTouched.rentaExenta && errors.rentaExenta)}
								aria-describedby="rentaExenta-error"
							/>
							{isTouched.rentaExenta && errors.rentaExenta ? (
								<p id="rentaExenta-error" className="text-sm text-rose-500">
									{errors.rentaExenta}
								</p>
							) : null}
						</div>

						<div className="space-y-2">
							<Label htmlFor="otherDeductions">{profileLabel}</Label>
							<Input
								id="otherDeductions"
								inputMode="numeric"
								placeholder="$ 0"
								value={formValues.otherDeductions}
								onChange={(event) =>
									updateField("otherDeductions", event.target.value)
								}
								onBlur={() => markTouched("otherDeductions")}
								hasError={Boolean(
									isTouched.otherDeductions && errors.otherDeductions
								)}
								aria-invalid={Boolean(
									isTouched.otherDeductions && errors.otherDeductions
								)}
								aria-describedby="otherDeductions-error"
							/>
							{isTouched.otherDeductions && errors.otherDeductions ? (
								<p id="otherDeductions-error" className="text-sm text-rose-500">
									{errors.otherDeductions}
								</p>
							) : null}
						</div>
					</div>
				</TooltipProvider>
			</CardContent>
		</Card>
	);
}

export { CalculatorTabs };
