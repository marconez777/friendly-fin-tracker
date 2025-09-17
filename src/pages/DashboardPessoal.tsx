import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { KPICard } from "@/components/dashboard/KPICard"
import { BalanceChart } from "@/components/dashboard/BalanceChart"
import { ExpensesChart } from "@/components/dashboard/ExpensesChart"

export default function DashboardPessoal() {
  const kpiData = [
    {
      title: "Saldo Atual",
      value: "R$ 8.900,00",
      trend: {
        percentage: 12.5,
        isPositive: true,
        previousValue: "R$ 7.900,00"
      }
    },
    {
      title: "Recebido no Mês",
      value: "R$ 5.200,00",
      trend: {
        percentage: 8.3,
        isPositive: true,
        previousValue: "R$ 4.800,00"
      }
    },
    {
      title: "A Pagar no Mês",
      value: "R$ 3.100,00",
      trend: {
        percentage: 5.2,
        isPositive: false,
        previousValue: "R$ 2.950,00"
      }
    }
  ]

  return (
    <DashboardLayout title="Dashboard Pessoal">
      <div className="space-y-6">
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
          <BalanceChart />
          <ExpensesChart />
        </div>
      </div>
    </DashboardLayout>
  )
}