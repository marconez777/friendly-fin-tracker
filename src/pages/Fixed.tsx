import { useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Edit, Trash, ToggleLeft, ToggleRight, Calendar } from "lucide-react"
import { FixedItemModal, type FixedItem } from "@/components/fixed/FixedItemModal"
import { FixedItemCard } from "@/components/fixed/FixedItemCard"
import { useIsMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"

const mockFixedItems: FixedItem[] = [
  {
    id: "1",
    description: "Salário",
    type: "Receita",
    context: "Pessoal",
    category: "Salário",
    value: 4500.00,
    dueDay: 5,
    isActive: true
  },
  {
    id: "2",
    description: "Aluguel Casa",
    type: "Despesa",
    context: "Pessoal", 
    category: "Moradia",
    value: 1200.00,
    dueDay: 10,
    isActive: true
  },
  {
    id: "3",
    description: "Recebimento Cliente Premium",
    type: "Receita",
    context: "Empresa",
    category: "Receita",
    value: 2800.00,
    dueDay: 15,
    isActive: true
  },
  {
    id: "4",
    description: "Aluguel Escritório",
    type: "Despesa",
    context: "Empresa",
    category: "Infraestrutura",
    value: 800.00,
    dueDay: 5,
    isActive: true
  },
  {
    id: "5",
    description: "Academia",
    type: "Despesa",
    context: "Pessoal",
    category: "Saúde",
    value: 89.90,
    dueDay: 20,
    isActive: false
  },
  {
    id: "6",
    description: "Software de Gestão",
    type: "Despesa",
    context: "Empresa",
    category: "Operacional",
    value: 199.90,
    dueDay: 1,
    isActive: true
  }
]

export default function Fixed() {
  const [items, setItems] = useState<FixedItem[]>(mockFixedItems)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<FixedItem | null>(null)
  const [typeFilter, setTypeFilter] = useState("all")
  const [contextFilter, setContextFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const isMobile = useIsMobile()
  const { toast } = useToast()

  const filteredItems = items.filter(item => {
    const matchesType = typeFilter === "all" || item.type === typeFilter
    const matchesContext = contextFilter === "all" || item.context === contextFilter
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && item.isActive) ||
      (statusFilter === "inactive" && !item.isActive)
    return matchesType && matchesContext && matchesStatus
  })

  const handleSave = (itemData: Omit<FixedItem, 'id'>) => {
    if (editingItem) {
      // Edit existing item
      setItems(prev => prev.map(item => 
        item.id === editingItem.id ? { ...itemData, id: editingItem.id } : item
      ))
      toast({
        title: "Fixa atualizada",
        description: "Despesa/receita fixa atualizada com sucesso. (Simulação)"
      })
    } else {
      // Create new item
      const newItem: FixedItem = {
        ...itemData,
        id: String(items.length + 1)
      }
      setItems(prev => [newItem, ...prev])
      toast({
        title: "Fixa criada",
        description: "Nova despesa/receita fixa criada com sucesso. (Simulação)"
      })
    }
    setEditingItem(null)
  }

  const handleEdit = (item: FixedItem) => {
    setEditingItem(item)
    setModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
    toast({
      title: "Fixa excluída",
      description: "Despesa/receita fixa removida com sucesso. (Simulação)"
    })
  }

  const handleToggleActive = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, isActive: !item.isActive } : item
    ))
    toast({
      title: "Status alterado",
      description: "Status da despesa/receita fixa atualizado. (Simulação)"
    })
  }

  const handleGenerateMonthlyEntries = () => {
    toast({
      title: "Lançamentos gerados",
      description: "Lançamentos do mês gerados com sucesso. (Simulação)"
    })
  }

  const handleNewFixed = () => {
    setEditingItem(null)
    setModalOpen(true)
  }

  return (
    <DashboardLayout title="Despesas/Receitas Fixas">
      <div className="space-y-6">
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleNewFixed}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Fixa
          </Button>
          <Button variant="outline" onClick={handleGenerateMonthlyEntries}>
            <Calendar className="h-4 w-4 mr-2" />
            Gerar Lançamentos do Mês
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              <SelectItem value="Receita">Receita</SelectItem>
              <SelectItem value="Despesa">Despesa</SelectItem>
            </SelectContent>
          </Select>

          <Select value={contextFilter} onValueChange={setContextFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por contexto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Contextos</SelectItem>
              <SelectItem value="Pessoal">Pessoal</SelectItem>
              <SelectItem value="Empresa">Empresa</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Fixed Items Display */}
        {isMobile ? (
          /* Mobile Card Layout */
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <FixedItemCard 
                key={item.id} 
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
              />
            ))}
          </div>
        ) : (
          /* Desktop Table Layout */
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Contexto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Dia Venc.</TableHead>
                  <TableHead>Ativo</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.description}</TableCell>
                    <TableCell>
                      <Badge variant={item.type === 'Receita' ? 'default' : 'destructive'}>
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.context === 'Pessoal' ? 'default' : 'outline'}>
                        {item.context}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      R$ {item.value.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </TableCell>
                    <TableCell>{item.dueDay}</TableCell>
                    <TableCell>
                      <Badge variant={item.isActive ? 'default' : 'secondary'}>
                        {item.isActive ? 'Sim' : 'Não'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(item)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleActive(item.id)}>
                            {item.isActive ? (
                              <>
                                <ToggleLeft className="mr-2 h-4 w-4" />
                                Desativar
                              </>
                            ) : (
                              <>
                                <ToggleRight className="mr-2 h-4 w-4" />
                                Ativar
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          {filteredItems.length} item(s) encontrado(s)
        </div>
      </div>

      <FixedItemModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        item={editingItem}
        onSave={handleSave}
      />
    </DashboardLayout>
  )
}