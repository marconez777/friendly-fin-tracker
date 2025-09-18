import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from 'date-fns';
import { StagingItem } from "@/services/staging";
import { Category } from "@/services/categories";
import { formatCurrency } from "@/lib/utils";

type StagingItemWithCategoryName = StagingItem & { categories: { name: string } | null };

export type StagingItemDecision = {
  context: 'Pessoal' | 'Empresa';
  category_id: number;
};

interface StagingTableProps {
  items: StagingItemWithCategoryName[];
  categories: Category[];
  selectedItemIds: number[];
  onSelectItem: (id: number, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  decisions: Map<number, StagingItemDecision>;
  onDecisionChange: (itemId: number, decision: StagingItemDecision) => void;
}

export function StagingTable({
  items,
  categories,
  selectedItemIds,
  onSelectItem,
  onSelectAll,
  decisions,
  onDecisionChange,
}: StagingTableProps) {

  const allSelected = items.length > 0 && selectedItemIds.length === items.length;

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox checked={allSelected} onCheckedChange={(checked) => onSelectAll(checked === true)} />
            </TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Sugestão</TableHead>
            <TableHead>Contexto*</TableHead>
            <TableHead>Categoria*</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const isSelected = selectedItemIds.includes(item.id);
            const itemDecision = decisions.get(item.id);
            const type = (item.value || 0) >= 0 ? 'Receita' : 'Despesa';
            const filteredCategories = categories.filter(c => c.type === type);

            return (
              <TableRow key={item.id} className={isSelected ? "bg-muted/50" : ""}>
                <TableCell>
                  <Checkbox checked={isSelected} onCheckedChange={(checked) => onSelectItem(item.id, checked === true)} />
                </TableCell>
                <TableCell>{format(parseISO(item.date), 'dd/MM/yyyy')}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell className={item.value >= 0 ? "text-green-600" : "text-red-600"}>{formatCurrency(item.value)}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge variant="secondary">{item.suggested_context}</Badge>
                    <Badge variant="secondary">{item.categories?.name || 'N/A'}</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={itemDecision?.context}
                    onValueChange={(value: 'Pessoal' | 'Empresa') => {
                      onDecisionChange(item.id, { ...itemDecision!, context: value });
                    }}
                  >
                    <SelectTrigger className="w-32"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pessoal">Pessoal</SelectItem>
                      <SelectItem value="Empresa">Empresa</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={String(itemDecision?.category_id)}
                    onValueChange={(value) => {
                      onDecisionChange(item.id, { ...itemDecision!, category_id: Number(value) });
                    }}
                  >
                    <SelectTrigger className="w-36"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      {filteredCategories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
