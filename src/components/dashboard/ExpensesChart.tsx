import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const mockData = [
  { name: "Alimentação", value: 1200, fill: "#ff6b35" },
  { name: "Transporte", value: 800, fill: "#f7931e" },
  { name: "Moradia", value: 2000, fill: "#ffd23f" },
  { name: "Saúde", value: 600, fill: "#06d6a0" },
  { name: "Educação", value: 400, fill: "#118ab2" },
  { name: "Lazer", value: 500, fill: "#073b4c" },
]

const chartConfig = {
  alimentacao: { label: "Alimentação", color: "#ff6b35" },
  transporte: { label: "Transporte", color: "#f7931e" },
  moradia: { label: "Moradia", color: "#ffd23f" },
  saude: { label: "Saúde", color: "#06d6a0" },
  educacao: { label: "Educação", color: "#118ab2" },
  lazer: { label: "Lazer", color: "#073b4c" },
}

export function ExpensesChart() {
  const total = mockData.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Despesas por Categoria</CardTitle>
        <CardDescription>
          Distribuição das despesas do mês atual
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mockData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {mockData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value, name) => [
                  `R$ ${Number(value).toLocaleString()}`, 
                  name,
                  `${((Number(value) / total) * 100).toFixed(1)}%`
                ]}
              />
              <ChartLegend 
                content={<ChartLegendContent />}
                className="flex-wrap gap-2 text-sm"
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-4 space-y-2">
          {mockData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="h-3 w-3 rounded-full" 
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-muted-foreground">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">R$ {item.value.toLocaleString()}</span>
                <span className="text-muted-foreground">
                  {((item.value / total) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}