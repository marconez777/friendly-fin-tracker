import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Check, X } from "lucide-react";
import { StagingTable, StagingItemDecision } from "@/components/staging/StagingTable";
import { useToast } from "@/hooks/use-toast";
import { getStagingItems, approveStagingItems, ignoreStagingItems, StagingItem } from "@/services/staging";
import { getCategories, Category } from "@/services/categories";
import { useNavigate } from "react-router-dom";

const MOCK_USER_ID = "a1b2c3d4-e5f6-7890-1234-567890abcdef";

type StagingItemWithCategoryName = StagingItem & { categories: { name: string } | null };

export default function Staging() {
  const [items, setItems] = useState<StagingItemWithCategoryName[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  const [decisions, setDecisions] = useState<Map<number, StagingItemDecision>>(new Map());
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [stagingData, categoriesData] = await Promise.all([
        getStagingItems(MOCK_USER_ID),
        getCategories(MOCK_USER_ID)
      ]);

      const typedStagingData = stagingData as StagingItemWithCategoryName[];
      setItems(typedStagingData);
      setCategories(categoriesData || []);

      // Initialize decisions based on suggestions
      const initialDecisions = new Map<number, StagingItemDecision>();
      typedStagingData.forEach(item => {
        if (item.suggested_context && item.suggested_category_id) {
          initialDecisions.set(item.id, {
            context: item.suggested_context,
            category_id: item.suggested_category_id,
          });
        }
      });
      setDecisions(initialDecisions);

    } catch (error) {
      toast({ title: "Erro ao buscar dados", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDecisionChange = (itemId: number, decision: StagingItemDecision) => {
    setDecisions(prev => new Map(prev).set(itemId, decision));
  };

  const handleSelectItem = (id: number, selected: boolean) => {
    setSelectedItemIds(prev => selected ? [...prev, id] : prev.filter(itemId => itemId !== id));
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedItemIds(selected ? items.map(item => item.id) : []);
  };

  const handleBulkApprove = async () => {
    const itemsToApprove = selectedItemIds.map(id => {
      const decision = decisions.get(id);
      return {
        id,
        decided_context: decision!.context,
        decided_category_id: decision!.category_id,
      };
    }).filter(item => item.decided_context && item.decided_category_id);

    if (itemsToApprove.length !== selectedItemIds.length) {
      toast({ title: "Ação necessária", description: "Por favor, defina um contexto e categoria para todos os itens selecionados.", variant: "destructive" });
      return;
    }

    try {
      await approveStagingItems(MOCK_USER_ID, itemsToApprove);
      toast({ title: "Sucesso!", description: `${itemsToApprove.length} itens foram aprovados e movidos para transações.` });
      setSelectedItemIds([]);
      fetchData(); // Refresh data
    } catch (error) {
      toast({ title: "Erro ao aprovar", description: (error as Error).message, variant: "destructive" });
    }
  };

  const handleBulkIgnore = async () => {
    try {
      await ignoreStagingItems(selectedItemIds);
      toast({ title: "Sucesso!", description: `${selectedItemIds.length} itens foram ignorados.` });
      setSelectedItemIds([]);
      fetchData(); // Refresh data
    } catch (error) {
      toast({ title: "Erro ao ignorar", description: (error as Error).message, variant: "destructive" });
    }
  };

  return (
    <DashboardLayout title="Staging (Triagem de Transações)">
      <div className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Revise as transações importadas. Ajuste o contexto e a categoria conforme necessário e depois aprove para adicioná-las oficialmente.
          </AlertDescription>
        </Alert>

        {selectedItemIds.length > 0 && (
          <div className="bg-muted p-4 rounded-lg flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">{selectedItemIds.length} selecionados:</span>
            <Button size="sm" onClick={handleBulkApprove}><Check className="mr-2 h-4 w-4"/>Aprovar</Button>
            <Button size="sm" variant="destructive" onClick={handleBulkIgnore}><X className="mr-2 h-4 w-4"/>Ignorar</Button>
          </div>
        )}

        {isLoading ? (
          <p>Carregando itens para triagem...</p>
        ) : items.length > 0 ? (
          <StagingTable
            items={items}
            categories={categories}
            selectedItemIds={selectedItemIds}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            decisions={decisions}
            onDecisionChange={handleDecisionChange}
          />
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">Tudo certo por aqui!</h3>
            <p className="text-muted-foreground mt-2">Não há itens pendentes para triagem.</p>
            <Button onClick={() => navigate('/transactions')} className="mt-4">Voltar para Transações</Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
