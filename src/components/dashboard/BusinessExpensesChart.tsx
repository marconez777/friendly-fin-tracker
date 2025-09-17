import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const mockData = [
  { name: "Fornecedores", value: 8500, fill: "#ff6b35" },
  { name: "Infraestrutura", value: 5200, fill: "#f7931e" },
  { name: "Marketing", value: 3800, fill: "#ffd23f" },
  { name: "Operacional", value: 2400, fill: "#06d6a0" },
  { name: "Serviços", value: 4100, fill: "#118ab2" },
  { name: "Impostos", value: 6300, fill: "#073b4c" },
]

const chartConfig = {
  fornecedores: { label: "Fornecedores", color: "#ff6b35" },
  infraestrutura: { label: "Infraestrutura", color: "#f7931e" },
  marketing: { label: "Marketing", color: "#ffd23f" },
  operacional: { label: "Operacional", color: "#06d6a0" },
  servicos: { label: "Serviços", color: "#118ab2" },
  impostos: { label: "Impostos", color: "#073b4c" },
}

export function BusinessExpensesChart() {
  const total = mockData.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Despesas por Categoria (Empresa)</CardTitle>
        <CardDescription>
          Distribuição das despesas empresariais do mês atual
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