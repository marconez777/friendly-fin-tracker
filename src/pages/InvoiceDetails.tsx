import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, Lock, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getInvoiceDetails, updateInvoiceStatus } from "@/services/cards";
import type { CardInvoice, CardInvoiceItem } from "@/services/cards";
import type { Transaction } from "@/services/transactions";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";

type InvoiceDetailsData = CardInvoice & {
  card_invoice_items: (CardInvoiceItem & { transactions: Transaction | null })[];
  cards: { label: string; closing_day: number; due_day: number } | null;
};

export default function InvoiceDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [invoice, setInvoice] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      getInvoiceDetails(Number(id))
        .then(setInvoice)
        .catch(err => toast({ title: "Erro", description: err.message, variant: "destructive" }))
        .finally(() => setIsLoading(false));
    }
  }, [id, toast]);

  const invoiceTotal = useMemo(() => {
    return invoice?.card_invoice_items?.reduce((sum: number, item: any) => sum + (item.transactions?.value || 0), 0) || 0;
  }, [invoice]);
  
  const handleStatusChange = async (status: "Aberta" | "Fechada" | "Paga") => {
    if (!invoice) return;
    try {
        const updatedInvoice = await updateInvoiceStatus(invoice.id, status);
        setInvoice(prev => ({...prev, status: updatedInvoice.status}));
        toast({ title: "Sucesso", description: "Status da fatura alterado." });
    } catch (error) {
        toast({ title: "Erro", description: (error as Error).message, variant: "destructive" });
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = { Aberta: "bg-blue-100 text-blue-800", Fechada: "bg-yellow-100 text-yellow-800", Paga: "bg-green-100 text-green-800" };
    return <Badge className={colors[status as keyof typeof colors]}>{status}</Badge>;
  };

  if (isLoading) {
    return <DashboardLayout title="Detalhes da Fatura"><p>Carregando...</p></DashboardLayout>;
  }

  if (!invoice) {
    return <DashboardLayout title="Detalhes da Fatura"><p>Fatura não encontrada.</p></DashboardLayout>;
  }

  const cardLabel = invoice.cards?.label || "Cartão";
  const invoiceMonth = new Date(invoice.month + '-02');
  const dueDate = invoice.cards ? new Date(invoiceMonth.getFullYear(), invoiceMonth.getMonth(), invoice.cards.due_day) : null;

  return (
    <DashboardLayout title="Detalhes da Fatura">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/invoices')}><ArrowLeft className="h-4 w-4" /></Button>
            <h2 className="text-2xl font-semibold">Fatura {cardLabel} - {format(invoiceMonth, 'MMMM/yyyy')}</h2>
          </div>
        </div>

        <Card>
          <CardHeader><CardTitle>Informações da Fatura</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div><p className="text-sm text-muted-foreground">Vencimento</p><p className="font-medium">{dueDate ? format(dueDate, 'dd/MM/yyyy') : 'N/A'}</p></div>
              <div><p className="text-sm text-muted-foreground">Total</p><p className="text-xl font-bold">{formatCurrency(invoiceTotal)}</p></div>
              <div><p className="text-sm text-muted-foreground">Status</p><div className="mt-1">{getStatusBadge(invoice.status)}</div></div>
            </div>
            <div className="flex gap-3 mt-6">
              {invoice.status === "Aberta" && <Button onClick={() => handleStatusChange("Fechada")}><Lock className="h-4 w-4 mr-2" />Fechar Fatura</Button>}
              {invoice.status === "Fechada" && (
                <>
                  <Button onClick={() => handleStatusChange("Paga")}><Check className="h-4 w-4 mr-2" />Marcar como Paga</Button>
                  <Button variant="outline" onClick={() => handleStatusChange("Aberta")}><RotateCcw className="h-4 w-4 mr-2" />Reabrir</Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Transações da Fatura</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Data</TableHead><TableHead>Descrição</TableHead><TableHead>Valor</TableHead></TableRow></TableHeader>
              <TableBody>
                {invoice.card_invoice_items.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>{format(new Date(item.transactions.date), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{item.transactions.description}</TableCell>
                    <TableCell>{formatCurrency(item.transactions.value)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
