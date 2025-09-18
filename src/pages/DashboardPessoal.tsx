import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { BalanceChart } from "@/components/dashboard/BalanceChart";
import { ExpensesChart } from "@/components/dashboard/ExpensesChart";
import { getMonthlyBalance, MonthlyBalance } from "@/services/transactions";
import { formatCurrency } from "@/lib/utils";
import { startOfMonth, endOfMonth, format } from 'date-fns';

const MOCK_USER_ID = "a1b2c3d4-e5f6-7890-1234-567890abcdef"; // Replace with real user management later

import { getUpcomingDueItems, markAsPaid, UpcomingDueItem } from "@/services/alerts";
import { AlertCard } from "@/components/alerts/AlertCard";
import { useToast } from "@/components/ui/use-toast";

export default function DashboardPessoal() {
  const [balance, setBalance] = useState<MonthlyBalance | null>(null);
  const [alerts, setAlerts] = useState<UpcomingDueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const today = new Date();
      const month = {
        from: format(startOfMonth(today), 'yyyy-MM-dd'),
        to: format(endOfMonth(today), 'yyyy-MM-dd')
      };
      const balanceData = await getMonthlyBalance(MOCK_USER_ID, 'Pessoal');
      const alertsData = await getUpcomingDueItems(MOCK_USER_ID);

      setBalance(balanceData);
      setAlerts(alertsData);

    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast({ title: "Erro ao carregar dados", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMarkAsPaid = async (sourceId: number, sourceType: 'transaction' | 'invoice') => {
    try {
      await markAsPaid(sourceId, sourceType);
      toast({ title: "Sucesso!", description: "Item marcado como pago." });
      fetchData(); // Refresh all data
    } catch (error) {
      toast({ title: "Erro", description: (error as Error).message, variant: "destructive" });
    }
  };

  const kpiData = balance ? [
    {
      title: "Saldo do Mês",
      value: formatCurrency(balance.saldo),
      trend: { percentage: 0, isPositive: balance.saldo >= 0, previousValue: "" }
    },
    {
      title: "Recebido no Mês",
      value: formatCurrency(balance.recebido),
      trend: { percentage: 0, isPositive: true, previousValue: "" }
    },
    {
      title: "A Receber",
      value: formatCurrency(balance.aReceber),
      trend: { percentage: 0, isPositive: true, previousValue: "" }
    },
    {
      title: "A Pagar no Mês",
      value: formatCurrency(balance.aPagar),
      trend: { percentage: 0, isPositive: false, previousValue: "" }
    }
  ] : [];

  return (
    <DashboardLayout title="Dashboard Pessoal">
      <div className="space-y-6">
        {isLoading ? (
          <p>Carregando dados...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpiData.map((kpi, index) => (
                <KPICard key={index} title={kpi.title} value={kpi.value} trend={kpi.trend} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Próximos Vencimentos (7 dias)</h3>
                {alerts.length > 0 ? (
                  <div className="space-y-2">
                    {alerts.map(alert => (
                      <AlertCard key={`${alert.sourceType}-${alert.sourceId}`} alert={alert} onMarkAsPaid={handleMarkAsPaid} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhum vencimento próximo.</p>
                )}
              </div>
              <BalanceChart />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <ExpensesChart />
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
