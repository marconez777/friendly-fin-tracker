import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export interface StagingItem {
  id: string
  date: string
  description: string
  value: number
  cardLabel?: string
  suggestedContext: string
  suggestedCategory: string
  context: string
  category: string
  status: 'Pendente' | 'Aprovado' | 'Ignorado'
}

interface StagingTableProps {
  items: StagingItem[]
  onUpdateItem: (id: string, updates: Partial<StagingItem>) => void
  selectedItems: string[]
  onSelectItem: (id: string, selected: boolean) => void
  onSelectAll: (selected: boolean) => void
}

const categories = [
  "Alimentação", "Transporte", "Moradia", "Saúde", "Educação", 
  "Lazer", "Receita", "Infraestrutura", "Operacional", "Marketing",
  "Fornecedores", "Impostos", "Serviços"
]

export function StagingTable({ 
  items, 
  onUpdateItem, 
  selectedItems, 
  onSelectItem, 
  onSelectAll 
}: StagingTableProps) {
  const { toast } = useToast()
  const allSelected = items.length > 0 && selectedItems.length === items.length

  const handleApprove = (id: string) => {
    onUpdateItem(id, { status: 'Aprovado' })
    toast({
      title: "Linha aprovada",
      description: "Transação aprovada com sucesso. (Simulação)"
    })
  }

  const handleIgnore = (id: string) => {
    onUpdateItem(id, { status: 'Ignorado' })
    toast({
      title: "Linha ignorada", 
      description: "Transação marcada como ignorada. (Simulação)"
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>
      case 'Ignorado':
        return <Badge variant="secondary">Ignorado</Badge>
      default:
        return <Badge variant="outline">Pendente</Badge>
    }
  }

  const canApprove = (item: StagingItem) => {
    return item.context && item.context !== '' && item.status === 'Pendente'
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) => onSelectAll(checked === true)}
              />
            </TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead>Card Label</TableHead>
            <TableHead>Sug. Contexto</TableHead>
            <TableHead>Sug. Categoria</TableHead>
            <TableHead>Contexto*</TableHead>
            <TableHead>Categoria*</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const isSelected = selectedItems.includes(item.id)
            const isPositive = item.value > 0
            
            return (
              <TableRow key={item.id} className={isSelected ? "bg-muted/50" : ""}>
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => onSelectItem(item.id, checked === true)}
                  />
                </TableCell>
                <TableCell className="font-medium">{item.date}</TableCell>
                <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                <TableCell className={`text-right font-medium ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isPositive ? '+' : '-'}R$ {Math.abs(item.value).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </TableCell>
                <TableCell>
                  {item.cardLabel && (
                    <Badge variant="outline" className="text-xs">
                      {item.cardLabel}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {item.suggestedContext}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {item.suggestedCategory}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select
                    value={item.context}
                    onValueChange={(value) => onUpdateItem(item.id, { context: value })}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Contexto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pessoal">Pessoal</SelectItem>
                      <SelectItem value="Empresa">Empresa</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={item.category}
                    onValueChange={(value) => onUpdateItem(item.id, { category: value })}
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {getStatusBadge(item.status)}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApprove(item.id)}
                      disabled={!canApprove(item)}
                      className="h-8 w-8 p-0"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleIgnore(item.id)}
                      disabled={item.status !== 'Pendente'}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}