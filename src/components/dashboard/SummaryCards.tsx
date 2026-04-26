import { memo, useCallback, useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeDollarSign,
  Check,
  Copy,
  Landmark,
  PiggyBank,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CalculationResult } from "@/domain/tax/calculators";
import { app, resumen } from "@/i18n/es";
import { formatCopCurrency, formatPercentageValue } from "@/utils/formatters";

interface SummaryCardsProps {
  computation: CalculationResult;
}

type SummaryCardItem = {
  title: string;
  value: number;
  valueFormat?: "percentage" | "currency";
  icon: typeof BadgeDollarSign;
};

function SummaryCards({ computation }: SummaryCardsProps) {
  const [copiedCardTitle, setCopiedCardTitle] = useState<string | null>(null);
  const cards = useMemo<SummaryCardItem[]>(
    () => [
      {
        title: resumen.baseReferencia,
        value: computation.referenceAmount,
        icon: BadgeDollarSign,
      },
      {
        title: computation.primaryTaxLabel,
        value: computation.primaryTaxAmount,
        icon: Landmark,
      },
      {
        title: computation.socialSecurityLabel,
        value: computation.socialSecurityAmount,
        valueFormat:
          computation.calculatorId === "vehicleConsumptionTax" ? "percentage" : "currency",
        icon: ShieldCheck,
      },
      {
        title: computation.netLabel,
        value: computation.netAmount,
        icon: PiggyBank,
      },
    ],
    [
      computation.calculatorId,
      computation.netAmount,
      computation.netLabel,
      computation.primaryTaxAmount,
      computation.primaryTaxLabel,
      computation.referenceAmount,
      computation.socialSecurityAmount,
      computation.socialSecurityLabel,
    ],
  );
  const formatCardValue = useCallback((value: number, valueFormat?: "percentage" | "currency") => {
    return valueFormat === "percentage" ? formatPercentageValue(value) : formatCopCurrency(value);
  }, []);

  const handleCopyCardValue = useCallback(
    async (cardTitle: string, value: number, valueFormat?: "percentage" | "currency") => {
      try {
        const formattedValue = formatCardValue(value, valueFormat);
        await navigator.clipboard.writeText(formattedValue);
        setCopiedCardTitle(cardTitle);
        window.setTimeout(() => {
          setCopiedCardTitle((currentTitle) => (currentTitle === cardTitle ? null : currentTitle));
        }, 1500);
      } catch {
        // Skip visual feedback when clipboard write is unavailable or blocked.
      }
    },
    [formatCardValue],
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-10">
      <Card className="sm:col-span-2 xl:col-span-4 border-amber-300 bg-amber-50 shadow-none dark:border-amber-500/50 dark:bg-amber-950/50">
        <CardContent className="flex items-center gap-3 p-4 text-sm text-amber-950 dark:text-amber-100/95">
          <AlertTriangle
            className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
            aria-hidden
          />
          <p>{app.disclaimerContador}</p>
        </CardContent>
      </Card>
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {card.title}
            </CardTitle>
            <div className="flex items-center gap-1">
              <card.icon className="h-4 w-4 text-emerald-500" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleCopyCardValue(card.title, card.value, card.valueFormat)}
                aria-label={`${resumen.copiarValor}: ${card.title}`}
              >
                {copiedCardTitle === card.title ? (
                  <Check className="h-3.5 w-3.5" aria-hidden />
                ) : (
                  <Copy className="h-3.5 w-3.5" aria-hidden />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tracking-tight">
              {formatCardValue(card.value, card.valueFormat)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

const MemoizedSummaryCards = memo(SummaryCards);

export { MemoizedSummaryCards as SummaryCards };
