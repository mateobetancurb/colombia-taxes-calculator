import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { TaxComputation } from "../../helpers/tax-calculator";
import { formatCopCurrency } from "../../helpers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { grafico } from "../../locales/es";

interface IncomeDonutChartProps {
  computation: TaxComputation;
}

const COLORS = ["#10b981", "#0891b2", "#f59e0b", "#ef4444"];

function IncomeDonutChart({ computation }: IncomeDonutChartProps) {
  const gross = computation.grossIncome;
  const deductions = computation.rentaExenta + computation.otherDeductions;
  const remaining = Math.max(
    gross - deductions - computation.retention - computation.socialSecurity,
    0,
  );

  const data = [
    { name: grafico.ingresoDisponible, value: remaining },
    { name: grafico.rentaExentaYDeducciones, value: deductions },
    { name: grafico.retencion, value: computation.retention },
    { name: grafico.seguridadSocial, value: computation.socialSecurity },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{grafico.titulo}</CardTitle>
        <CardDescription>{grafico.descripcion}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={4}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[data.indexOf(entry)]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCopCurrency(Number(value))}
                contentStyle={{
                  borderRadius: "0.5rem",
                  border: "1px solid #1e293b",
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export { IncomeDonutChart };
