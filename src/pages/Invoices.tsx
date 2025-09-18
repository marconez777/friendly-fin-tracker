import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card as UICard, CardContent } from "@/components/ui/card";
import { Eye, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { getCards, Card, getInvoicesForCard, CardInvoice, updateInvoiceStatus } from "@/services/cards";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";

const MOCK_USER_ID = "a1b2c3d4-e5f6-7890-1234-567890abcdef";

export default function Invoices() {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [invoices, setInvoices] = useState<CardInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    getCards(MOCK_USER_ID).then(data => {
      setCards(data || []);
      if (data && data.length > 0) {
        setSelectedCardId(String(data[0].id));
      }
    });
  }, []);

  const fetchInvoices = useCallback(async () => {
    if (!selectedCardId) return;
    setIsLoading(true);
    try {
      const data = await getInvoicesForCard(Number(selectedCardId));
      // TODO: Calculate invoice total by summing items. This should be done in the backend ideally.
      // For now, we'll display 0.
      const invoicesWithTotal = data.map(inv => ({...inv, total: 0}));
      setInvoices(invoicesWithTotal as any);
    } catch (error) {
      toast({ title: "Erro ao buscar faturas", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [selectedCardId, toast]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleStatusChange = async (invoiceId: number, status: "Aberta" | "Fechada" | "Paga") => {
    try {
        await updateInvoiceStatus(invoiceId, status);
        toast({ title: "Sucesso", description: "Status da fatura alterado." });
        fetchInvoices();
    } catch (error) {
        toast({ title: "Erro", description: "Não foi possível alterar o status da fatura.", variant: "destructive" });
    }
  };

  const getStatusBadge = (status: "Aberta" | "Fechada" | "Paga") => {
    const variants = { Aberta: "bg-blue-100 text-blue-800", Fechada: "bg-yellow-100 text-yellow-800", Paga: "bg-green-100 text-green-800" };
    return <Badge className={variants[status]}>{status}</Badge>;
  };

  const renderInvoices = () => {
    if (isLoading) return <p>Carregando faturas...</p>;
    if (invoices.length === 0) return <p>Nenhuma fatura encontrada para este cartão.</p>;

    if (isMobile) {
      return (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <UICard key={invoice.id}>
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">Fatura {format(new Date(invoice.month), 'MMMM/yyyy')}</h3>
                    <p className="text-sm text-muted-foreground">Status: {getStatusBadge(invoice.status)}</p>
                  </div>
                  <span className="text-lg font-bold">{formatCurrency((invoice as any).total)}</span>
                </div>
                <Button size="sm" variant="outline" onClick={() => navigate(`/invoices/${invoice.id}`)}><Eye className="h-4 w-4 mr-1" />Ver Detalhes</Button>
              </CardContent>
            </UICard>
          ))}
        </div>
      );
    }

    return (
      <UICard>
        <Table>
          <TableHeader><TableRow><TableHead>Mês</TableHead><TableHead>Status</TableHead><TableHead>Total</TableHead><TableHead>Ações</TableHead></TableRow></TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{format(new Date(invoice.month), 'MMMM/yyyy')}</TableCell>
                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                <TableCell>{formatCurrency((invoice as any).total)}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => navigate(`/invoices/${invoice.id}`)}><Eye className="h-4 w-4 mr-1" />Ver Detalhes</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </UICard>
    );
  };

  return (
    <DashboardLayout title="Faturas de Cartão de Crédito">
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            <Select value={selectedCardId} onValueChange={setSelectedCardId}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Selecione o cartão" /></SelectTrigger>
              <SelectContent>
                {cards.map(card => <SelectItem key={card.id} value={String(card.id)}>{card.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={() => navigate('/setup')}><Settings className="h-4 w-4 mr-2" />Gerenciar Cartões</Button>
        </div>
        {renderInvoices()}
      </div>
    </DashboardLayout>
  );
}
