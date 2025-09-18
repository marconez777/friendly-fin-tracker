import { useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useToast } from "@/components/ui/use-toast";
import { getUpcomingDueItems } from "@/services/alerts";
import { isAfter, startOfToday, addDays } from 'date-fns';

const MOCK_USER_ID = "a1b2c3d4-e5f6-7890-1234-567890abcdef";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { toast } = useToast();

  useEffect(() => {
    const checkDues = async () => {
      try {
        const items = await getUpcomingDueItems(MOCK_USER_ID);
        const threeDaysFromNow = addDays(startOfToday(), 3);
        const dueSoonItems = items.filter(item =>
            isAfter(threeDaysFromNow, new Date(item.dueDate))
        );

        if (dueSoonItems.length > 0) {
          toast({
            title: "Atenção!",
            description: `Você tem ${dueSoonItems.length} item(ns) vencendo nos próximos 3 dias.`,
            variant: "destructive"
          });
        }
      } catch (error) {
        // Fail silently, as this is a background check
        console.error("Failed to check for upcoming dues:", error);
      }
    };

    // Prevent running this in development on every re-render
    const hasCheckedDues = sessionStorage.getItem('hasCheckedDues');
    if (!hasCheckedDues) {
      checkDues();
      sessionStorage.setItem('hasCheckedDues', 'true');
    }
  }, [toast]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-between border-b bg-background px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
            </div>
          </header>
          <div className="flex-1 p-6 bg-muted/30">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}