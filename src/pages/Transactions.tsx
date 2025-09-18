import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Upload, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { NewTransactionModal } from "@/components/transactions/NewTransactionModal";
import { UploadExtractModal } from "@/components/transactions/UploadExtractModal";
import { TransactionCard } from "@/components/transactions/TransactionCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { getTransactions, deleteTransaction, Transaction } from "@/services/transactions";
import { getCategories, Category } from "@/services/categories";
import { useToast } from "@/components/ui/use-toast";
import { subMonths, startOfMonth, endOfMonth, format } from 'date-fns';

const MOCK_USER_ID = "a1b2c3d4-e5f6-7890-1234-567890abcdef"; // Replace with real user management later

export default function Transactions() {
  const [newTransactionModalOpen, setNewTransactionModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState({
    period: 'current_month',
    categoryId: 'all',
    context: 'all',
    status: 'all',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const { toast } = useToast();
  const isMobile = useIsMobile();

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      let periodFilter;
      const today = new Date();
      if (filters.period === 'current_month') {
        periodFilter = { from: format(startOfMonth(today), 'yyyy-MM-dd'), to: format(endOfMonth(today), 'yyyy-MM-dd') };
      } else if (filters.period === 'last_month') {
        const lastMonth = subMonths(today, 1);
        periodFilter = { from: format(startOfMonth(lastMonth), 'yyyy-MM-dd'), to: format(endOfMonth(lastMonth), 'yyyy-MM-dd') };
      }

      const { data, count } = await getTransactions({
        page: pagination.page,
        pageSize: pagination.pageSize,
        filters: {
          period: periodFilter,
          category_id: filters.categoryId === 'all' ? undefined : Number(filters.categoryId),
          context: filters.context === 'all' ? undefined : (filters.context as 'Pessoal' | 'Empresa'),
          status: filters.status === 'all' ? undefined : (filters.status as 'Pendente' | 'Pago' | 'Recebido'),
        }
      });
      setTransactions(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      toast({ title: "Erro ao buscar transações", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [pagination, filters, toast]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    getCategories(MOCK_USER_ID)
      .then(setCategories)
      .catch(error => toast({ title: "Erro ao buscar categorias", description: (error as Error).message, variant: "destructive" }));
  }, [toast]);

  const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on filter change
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        await deleteTransaction(id);
        toast({ title: "Sucesso!", description: "Transação excluída." });
        fetchTransactions(); // Refresh list
      } catch (error) {
        toast({ title: "Erro ao excluir", description: (error as Error).message, variant: "destructive" });
      }
    }
  };

  const totalPages = Math.ceil(totalCount / pagination.pageSize);

  return (
    <DashboardLayout title="Transações">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={() => setNewTransactionModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Transação
          </Button>
          <Button variant="outline" onClick={() => setUploadModalOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Extrato
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select value={filters.period} onValueChange={value => handleFilterChange('period', value)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="current_month">Mês Atual</SelectItem>
              <SelectItem value="last_month">Mês Anterior</SelectItem>
              <SelectItem value="all">Todo o Período</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.categoryId} onValueChange={value => handleFilterChange('categoryId', value)}>
            <SelectTrigger><SelectValue placeholder="Filtrar por categoria" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Categorias</SelectItem>
              {categories.map(cat => <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.context} onValueChange={value => handleFilterChange('context', value)}>
            <SelectTrigger><SelectValue placeholder="Filtrar por contexto" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Contextos</SelectItem>
              <SelectItem value="Pessoal">Pessoal</SelectItem>
              <SelectItem value="Empresa">Empresa</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.status} onValueChange={value => handleFilterChange('status', value)}>
            <SelectTrigger><SelectValue placeholder="Filtrar por status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Pago">Pago</SelectItem>
              <SelectItem value="Recebido">Recebido</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? <p>Carregando...</p> : (
          <>
            {isMobile ? (
              <div className="space-y-4">
                {transactions.map((t) => <TransactionCard key={t.id} transaction={t} onEdit={() => {}} onDelete={() => handleDelete(t.id)} />)}
              </div>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Contexto</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="w-[40px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell>{format(new Date(t.date), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>{t.description}</TableCell>
                        <TableCell><Badge variant="secondary">{t.categories?.name || 'N/A'}</Badge></TableCell>
                        <TableCell><Badge variant={t.context === 'Pessoal' ? 'default' : 'outline'}>{t.context}</Badge></TableCell>
                        <TableCell><Badge variant="outline">{t.status}</Badge></TableCell>
                        <TableCell className={`text-right font-medium ${t.type === 'Receita' ? 'text-green-600' : 'text-red-600'}`}>
                          {t.type === 'Receita' ? '+' : '-'} R$ {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { /* TODO: Implement Edit */ }}>Editar</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(t.id)} className="text-red-500">Excluir</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Página {pagination.page} de {totalPages} ({totalCount} transações)
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => setPagination(p => ({...p, page: p.page - 1}))} disabled={pagination.page <= 1}>
                  <ChevronLeft className="h-4 w-4" /> Anterior
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPagination(p => ({...p, page: p.page + 1}))} disabled={pagination.page >= totalPages}>
                  Próxima <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <NewTransactionModal
        open={newTransactionModalOpen}
        onOpenChange={setNewTransactionModalOpen}
        userId={MOCK_USER_ID}
        onTransactionAdded={fetchTransactions}
      />
      <UploadExtractModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
      />
    </DashboardLayout>
  );
}
