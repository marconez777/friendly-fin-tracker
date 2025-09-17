import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const mockData = [
  { month: "Jan", saldo: 25000 },
  { month: "Fev", saldo: 28500 },
  { month: "Mar", saldo: 32100 },
  { month: "Abr", saldo: 29800 },
  { month: "Mai", saldo: 35200 },
  { month: "Jun", saldo: 38900 },
  { month: "Jul", saldo: 42300 },
  { month: "Ago", saldo: 45600 },
  { month: "Set", saldo: 48200 },
  { month: "Out", saldo: 52800 },
  { month: "Nov", saldo: 49500 },
  { month: "Dez", saldo: 56200 },
]

const chartConfig = {
  saldo: {
    label: "Saldo",
    color: "hsl(var(--primary))",
  },
}

export function BusinessBalanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Evolução do Saldo (Empresa)</CardTitle>
        <CardDescription>
          Saldo da empresa ao longo dos últimos 12 meses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `R$ ${value.toLocaleString()}`}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value) => [`R$ ${value.toLocaleString()}`, "Saldo"]}
              />
              <Line 
                type="monotone" 
                dataKey="saldo" 
                stroke="var(--color-saldo)" 
                strokeWidth={3}
                dot={{ fill: "var(--color-saldo)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}