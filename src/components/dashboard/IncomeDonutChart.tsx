import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import type { CalculationResult } from "../../helpers/calculators";
import { formatCopCurrency } from "../../helpers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { grafico } from "../../locales/es";

interface IncomeDonutChartProps {
  computation: CalculationResult;
}

const COLORS = ["#10b981", "#0891b2", "#f59e0b", "#ef4444"];

function IncomeDonutChart({ computation }: IncomeDonutChartProps) {
  const data = computation.metrics.map((metric) => ({
    name: metric.label,
    value: Math.max(metric.amount, 0),
  }));
  const comparisonData = [
    {
      name: grafico.impuestos,
      value: Math.max(computation.primaryTaxAmount + computation.socialSecurityAmount, 0),
    },
    { name: grafico.ingresoDisponible, value: Math.max(computation.netAmount, 0) },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{grafico.titulo}</CardTitle>
        <CardDescription>{grafico.descripcion}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 xl:grid-cols-2">
        <div className="h-[280px] w-full">
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
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCopCurrency(Number(value))} />
              <Legend verticalAlign="bottom" height={32} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => formatCopCurrency(Number(value))} />
              <Tooltip formatter={(value) => formatCopCurrency(Number(value))} />
              <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export { IncomeDonutChart };
