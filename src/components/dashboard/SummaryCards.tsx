import { BadgeDollarSign, Landmark, PiggyBank, ShieldCheck } from "lucide-react";
import type { TaxComputation } from "../../helpers/tax-calculator";
import { formatCopCurrency } from "../../helpers";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { resumen } from "../../locales/es";

interface SummaryCardsProps {
  computation: TaxComputation;
}

function SummaryCards({ computation }: SummaryCardsProps) {
  const cards = [
    {
      title: resumen.totalImpuestos,
      value: computation.totalTax,
      icon: BadgeDollarSign,
    },
    {
      title: resumen.retencion,
      value: computation.retention,
      icon: Landmark,
    },
    {
      title: resumen.seguridadSocial,
      value: computation.socialSecurity,
      icon: ShieldCheck,
    },
    {
      title: resumen.ingresoNeto,
      value: computation.netIncome,
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
    </div>
  );
}

export { SummaryCards };
