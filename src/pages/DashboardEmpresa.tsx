import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { KPICard } from "@/components/dashboard/KPICard"
import { BusinessBalanceChart } from "@/components/dashboard/BusinessBalanceChart"
import { BusinessExpensesChart } from "@/components/dashboard/BusinessExpensesChart"
import { TransactionHistoryTable } from "@/components/dashboard/TransactionHistoryTable"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

export default function DashboardEmpresa() {
  const kpiData = [
    {
      title: "Saldo Atual (Empresa)",
      value: "R$ 56.200,00",
      trend: {
        percentage: 18.2,
        isPositive: true,
        previousValue: "R$ 47.500,00"
      }
    },
    {
      title: "Recebido no Mês (Empresa)",
      value: "R$ 28.400,00",
      trend: {
        percentage: 15.6,
        isPositive: true,
        previousValue: "R$ 24.600,00"
      }
    },
    {
      title: "A Pagar no Mês (Empresa)",
      value: "R$ 18.200,00",
      trend: {
        percentage: 8.9,
        isPositive: false,
        previousValue: "R$ 16.700,00"
      }
    }
  ]

  return (
    <DashboardLayout title="Dashboard Empresa">
      <div className="space-y-6">
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-48">
            <Select defaultValue="atual">
              <SelectTrigger>
                <SelectValue placeholder="Selecionar mês" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="atual">Mês Atual</SelectItem>
                <SelectItem value="anterior">Mês Anterior</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="w-full sm:w-auto">
            <Calendar className="h-4 w-4 mr-2" />
            Período Customizado
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kpiData.map((kpi, index) => (
            <KPICard
              key={index}
              title={kpi.title}
              value={kpi.value}
              trend={kpi.trend}
            />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BusinessBalanceChart />
          <BusinessExpensesChart />
        </div>

        {/* Transaction History Table */}
        <TransactionHistoryTable />
      </div>
    </DashboardLayout>
  )
}