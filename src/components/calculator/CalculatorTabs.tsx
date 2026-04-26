import { useEffect, useMemo } from "react";
import {
  calculateForCalculator,
  calculatorDefinitions,
  type CalculationResult,
  type CalculatorId,
  type CalculatorInputState,
} from "../../helpers/calculators";
import { formatCopInput, parseCopInput } from "../../helpers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { calculadora as es } from "../../locales/es";
import { Button } from "../ui/button";

interface CalculatorTabsProps {
  activeCalculatorId: CalculatorId;
  calculatorInputs: Record<CalculatorId, CalculatorInputState>;
  onCalculatorChange: (calculatorId: CalculatorId) => void;
  onInputChange: (calculatorId: CalculatorId, input: CalculatorInputState) => void;
  onCalculationChange: (computation: CalculationResult) => void;
}

function CalculatorTabs({
  activeCalculatorId,
  calculatorInputs,
  onCalculatorChange,
  onInputChange,
  onCalculationChange,
}: CalculatorTabsProps) {
  const activeCalculator = useMemo(
    () =>
      calculatorDefinitions.find((item) => item.id === activeCalculatorId) ||
      calculatorDefinitions[0],
    [activeCalculatorId],
  );

  const computation = useMemo(() => {
    return calculateForCalculator(activeCalculator.id, calculatorInputs[activeCalculator.id]);
  }, [activeCalculator.id, calculatorInputs]);

  useEffect(() => {
    onCalculationChange(computation);
  }, [computation, onCalculationChange]);

  const updateNumberField = (fieldId: string, value: string) => {
    const nextValue = parseCopInput(value);
    const currentInput = calculatorInputs[activeCalculator.id];
    onInputChange(activeCalculator.id, {
      ...currentInput,
      numbers: {
        ...currentInput.numbers,
        [fieldId]: nextValue,
      },
    });
  };

  const updateSelectField = (fieldId: string, value: string) => {
    const currentInput = calculatorInputs[activeCalculator.id];
    onInputChange(activeCalculator.id, {
      ...currentInput,
      selects: {
        ...currentInput.selects,
        [fieldId]: value,
      },
    });
  };

  return (
    <Card id="calculator">
      <CardHeader>
        <CardTitle>{es.titulo}</CardTitle>
        <CardDescription>{es.descripcion}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeCalculator.id}
          onValueChange={(value) => onCalculatorChange(value as CalculatorId)}
        >
          <TabsList className="flex h-auto w-full flex-wrap gap-2 bg-transparent p-0">
            {calculatorDefinitions.map((calculator) => (
              <TabsTrigger
                key={calculator.id}
                value={calculator.id}
                className="rounded-md border border-slate-200 px-3 py-1.5 text-xs data-[state=active]:border-emerald-500 data-[state=active]:bg-emerald-50 dark:border-slate-700 dark:data-[state=active]:bg-emerald-900/30"
              >
                {calculator.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {calculatorDefinitions.map((calculator) => {
            const inputState = calculatorInputs[calculator.id];
            return (
              <TabsContent key={calculator.id} value={calculator.id} className="space-y-4 pt-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {calculator.description}
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  {calculator.numberFields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={`${calculator.id}-${field.id}`}>{field.label}</Label>
                      <Input
                        id={`${calculator.id}-${field.id}`}
                        inputMode="numeric"
                        placeholder="$ 0"
                        value={formatCopInput(inputState.numbers[field.id] || 0)}
                        onChange={(event) => updateNumberField(field.id, event.target.value)}
                      />
                      {field.description ? (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {field.description}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>

                {calculator.selectFields?.length ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    {calculator.selectFields.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <Label>{field.label}</Label>
                        <div className="flex flex-wrap gap-2">
                          {field.options.map((option) => {
                            const isSelected = inputState.selects[field.id] === option.value;
                            return (
                              <Button
                                key={option.value}
                                type="button"
                                variant={isSelected ? "default" : "outline"}
                                size="sm"
                                onClick={() => updateSelectField(field.id, option.value)}
                              >
                                {option.label}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
}

export { CalculatorTabs };
