import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const mockData = [
  { month: "Jan", saldo: 4500 },
  { month: "Fev", saldo: 5200 },
  { month: "Mar", saldo: 4800 },
  { month: "Abr", saldo: 6100 },
  { month: "Mai", saldo: 5700 },
  { month: "Jun", saldo: 6800 },
  { month: "Jul", saldo: 7200 },
  { month: "Ago", saldo: 6900 },
  { month: "Set", saldo: 7800 },
  { month: "Out", saldo: 8500 },
  { month: "Nov", saldo: 9200 },
  { month: "Dez", saldo: 8900 },
]

const chartConfig = {
  saldo: {
    label: "Saldo",
    color: "hsl(var(--primary))",
  },
}

export function BalanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Evolução do Saldo</CardTitle>
        <CardDescription>
          Saldo ao longo dos últimos 12 meses
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