import { BadgeDollarSign, Landmark, PiggyBank, ShieldCheck } from "lucide-react";
import type { CalculationResult } from "../../helpers/calculators";
import { formatCopCurrency } from "../../helpers";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { resumen, app } from "../../locales/es";

interface SummaryCardsProps {
  computation: CalculationResult;
}

function SummaryCards({ computation }: SummaryCardsProps) {
  const cards = [
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
      icon: ShieldCheck,
    },
    {
      title: computation.netLabel,
      value: computation.netAmount,
      icon: PiggyBank,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tracking-tight">{formatCopCurrency(card.value)}</p>
          </CardContent>
        </Card>
      ))}
      <Card className="sm:col-span-2 xl:col-span-4">
        <CardContent className="pt-4 text-sm text-slate-600 dark:text-slate-300">
          {app.disclaimerContador}
        </CardContent>
      </Card>
    </div>
  );
}

export { SummaryCards };
