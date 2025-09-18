import { useState, useEffect, useCallback, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Edit, Trash, ToggleLeft, ToggleRight, Calendar } from "lucide-react";
import { FixedItemModal } from "@/components/fixed/FixedItemModal";
import { FixedItemCard } from "@/components/fixed/FixedItemCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { getFixedItems, createFixedItem, updateFixedItem, deleteFixedItem, generateMonthlyTransactions, FixedItem, NewFixedItem } from "@/services/fixedItems";
import { formatCurrency } from "@/lib/utils";

const MOCK_USER_ID = "a1b2c3d4-e5f6-7890-1234-567890abcdef"; // Replace with real user management later

type FixedItemWithCategory = FixedItem & { categories: { name: string } | null };

export default function Fixed() {
  const [items, setItems] = useState<FixedItemWithCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FixedItemWithCategory | null>(null);

  const [filters, setFilters] = useState({
    type: "all",
    context: "all",
    status: "all",
  });

  const isMobile = useIsMobile();
  const { toast } = useToast();

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getFixedItems(MOCK_USER_ID);
      setItems(data as FixedItemWithCategory[] || []);
    } catch (error) {
      toast({ title: "Erro ao buscar itens fixos", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const filteredItems = useMemo(() => items.filter(item => {
    const matchesType = filters.type === "all" || item.type === filters.type;
    const matchesContext = filters.context === "all" || item.context === filters.context;
    const matchesStatus = filters.status === "all" ||
      (filters.status === "active" && item.active) ||
      (filters.status === "inactive" && !item.active);
    return matchesType && matchesContext && matchesStatus;
  }), [items, filters]);

  const handleSave = async (itemData: NewFixedItem | FixedItem) => {
    try {
      if ('id' in itemData) { // Update
        await updateFixedItem(itemData.id, itemData);
        toast({ title: "Sucesso!", description: "Item fixo atualizado." });
      } else { // Create
        await createFixedItem(itemData);
        toast({ title: "Sucesso!", description: "Novo item fixo criado." });
      }
      fetchItems();
    } catch (error) {
      toast({ title: "Erro ao salvar", description: (error as Error).message, variant: "destructive" });
    }
  };

  const handleEdit = (item: FixedItemWithCategory) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      try {
        await deleteFixedItem(id);
        toast({ title: "Sucesso!", description: "Item fixo excluído." });
        fetchItems();
      } catch (error) {
        toast({ title: "Erro ao excluir", description: (error as Error).message, variant: "destructive" });
      }
    }
  };

  const handleToggleActive = async (item: FixedItem) => {
    try {
      await updateFixedItem(item.id, { active: !item.active });
      toast({ title: "Sucesso!", description: "Status do item alterado." });
      fetchItems();
    } catch (error) {
      toast({ title: "Erro ao alterar status", description: (error as Error).message, variant: "destructive" });
    }
  };

  const handleGenerateMonthlyEntries = async () => {
    try {
      await generateMonthlyTransactions(MOCK_USER_ID);
      toast({ title: "Sucesso!", description: "Lançamentos mensais foram gerados." });
    } catch (error) {
      toast({ title: "Erro ao gerar lançamentos", description: (error as Error).message, variant: "destructive" });
    }
  };

  const handleNewFixed = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  return (
    <DashboardLayout title="Despesas/Receitas Fixas">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleNewFixed}><Plus className="h-4 w-4 mr-2" />Nova Fixa</Button>
          <Button variant="outline" onClick={handleGenerateMonthlyEntries}><Calendar className="h-4 w-4 mr-2" />Gerar Lançamentos do Mês</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select value={filters.type} onValueChange={v => setFilters(f => ({...f, type: v}))}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">Todos Tipos</SelectItem><SelectItem value="Receita">Receita</SelectItem><SelectItem value="Despesa">Despesa</SelectItem></SelectContent></Select>
          <Select value={filters.context} onValueChange={v => setFilters(f => ({...f, context: v}))}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">Todos Contextos</SelectItem><SelectItem value="Pessoal">Pessoal</SelectItem><SelectItem value="Empresa">Empresa</SelectItem></SelectContent></Select>
          <Select value={filters.status} onValueChange={v => setFilters(f => ({...f, status: v}))}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">Todos Status</SelectItem><SelectItem value="active">Ativos</SelectItem><SelectItem value="inactive">Inativos</SelectItem></SelectContent></Select>
        </div>

        {isLoading ? <p>Carregando...</p> : (
          <>
            {isMobile ? (
              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <FixedItemCard key={item.id} item={item} onEdit={handleEdit} onDelete={() => handleDelete(item.id)} onToggleActive={() => handleToggleActive(item)} />
                ))}
              </div>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader><TableRow><TableHead>Descrição</TableHead><TableHead>Tipo</TableHead><TableHead>Contexto</TableHead><TableHead>Categoria</TableHead><TableHead>Valor</TableHead><TableHead>Dia Venc.</TableHead><TableHead>Ativo</TableHead><TableHead>Ações</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell><Badge variant={item.type === 'Receita' ? 'default' : 'destructive'}>{item.type}</Badge></TableCell>
                        <TableCell><Badge variant={item.context === 'Pessoal' ? 'default' : 'outline'}>{item.context}</Badge></TableCell>
                        <TableCell><Badge variant="secondary">{item.categories?.name || 'N/A'}</Badge></TableCell>
                        <TableCell>{formatCurrency(item.value)}</TableCell>
                        <TableCell>{item.due_day}</TableCell>
                        <TableCell><Badge variant={item.active ? 'default' : 'secondary'}>{item.active ? 'Sim' : 'Não'}</Badge></TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(item)}><Edit className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleActive(item)}>{item.active ? <><ToggleLeft className="mr-2 h-4 w-4" />Desativar</> : <><ToggleRight className="mr-2 h-4 w-4" />Ativar</>}</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-red-600"><Trash className="mr-2 h-4 w-4" />Excluir</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            <div className="text-sm text-muted-foreground">{filteredItems.length} item(s) encontrado(s)</div>
          </>
        )}
      </div>

      <FixedItemModal open={modalOpen} onOpenChange={setModalOpen} item={editingItem} onSave={handleSave} userId={MOCK_USER_ID} />
    </DashboardLayout>
  );
}
