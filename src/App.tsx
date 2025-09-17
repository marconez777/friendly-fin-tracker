import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DashboardPessoal from "./pages/DashboardPessoal";
import DashboardEmpresa from "./pages/DashboardEmpresa";
import Transactions from "./pages/Transactions";
import Staging from "./pages/Staging";
import Fixed from "./pages/Fixed";
import Alerts from "./pages/Alerts";
import Pricing from "./pages/Pricing";
import Account from "./pages/Account";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import AdminPlans from "./pages/admin/AdminPlans";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard-pessoal" element={<DashboardPessoal />} />
          <Route path="/dashboard-empresa" element={<DashboardEmpresa />} />
          <Route path="/transacoes" element={<Transactions />} />
          <Route path="/staging" element={<Staging />} />
          <Route path="/fixas" element={<Fixed />} />
          <Route path="/alertas" element={<Alerts />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/account" element={<Account />} />
          
          {/* Admin Routes */}
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
          <Route path="/admin/plans" element={<AdminPlans />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
