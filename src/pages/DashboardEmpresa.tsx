import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { BusinessBalanceChart } from "@/components/dashboard/BusinessBalanceChart";
import { BusinessExpensesChart } from "@/components/dashboard/BusinessExpensesChart";
import { TransactionHistoryTable } from "@/components/dashboard/TransactionHistoryTable";
import { getMonthlyBalance, MonthlyBalance } from "@/services/transactions";
import { formatCurrency } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

const MOCK_USER_ID = "a1b2c3d4-e5f6-7890-1234-567890abcdef"; // Replace with real user management later

type ViewContext = 'Empresa' | 'Pessoal' | 'Consolidado';

export default function DashboardEmpresa() {
  const [balance, setBalance] = useState<MonthlyBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewContext, setViewContext] = useState<ViewContext>('Empresa');

  const fetchBalance = useCallback(async () => {
    setIsLoading(true);
    try {
      const today = new Date();
      const month = {
        from: format(startOfMonth(today), 'yyyy-MM-dd'),
        to: format(endOfMonth(today), 'yyyy-MM-dd')
      };

      const context = viewContext === 'Consolidado' ? undefined : viewContext;

      const data = await getMonthlyBalance(MOCK_USER_ID, month, context);
      setBalance(data);
    } catch (error) {
      console.error(`Failed to fetch ${viewContext} balance:`, error);
    } finally {
      setIsLoading(false);
    }
  }, [viewContext]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const kpiData = balance ? [
    {
      title: `Saldo do Mês (${viewContext})`,
      value: formatCurrency(balance.saldo),
      trend: { percentage: 0, isPositive: balance.saldo >= 0, previousValue: "" }
    },
    {
      title: `Recebido no Mês (${viewContext})`,
      value: formatCurrency(balance.recebido),
      trend: { percentage: 0, isPositive: true, previousValue: "" }
    },
    {
      title: `A Receber (${viewContext})`,
      value: formatCurrency(balance.aReceber),
      trend: { percentage: 0, isPositive: true, previousValue: "" }
    },
    {
      title: `A Pagar no Mês (${viewContext})`,
      value: formatCurrency(balance.aPagar),
      trend: { percentage: 0, isPositive: false, previousValue: "" }
    }
  ] : [];

  return (
    <DashboardLayout title="Dashboard Consolidado">
      <Tabs value={viewContext} onValueChange={(value) => setViewContext(value as ViewContext)} className="space-y-4">
        <TabsList>
          <TabsTrigger value="Consolidado">Consolidado</TabsTrigger>
          <TabsTrigger value="Empresa">Empresa</TabsTrigger>
          <TabsTrigger value="Pessoal">Pessoal</TabsTrigger>
        </TabsList>

        <TabsContent value={viewContext} className="space-y-6">
           {isLoading ? (
            <p>Carregando dados...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map((kpi, index) => (
                  <KPICard
                    key={index}
                    title={kpi.title}
                    value={kpi.value}
                    trend={kpi.trend}
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BusinessBalanceChart />
                <BusinessExpensesChart />
              </div>

              <TransactionHistoryTable />
            </>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
