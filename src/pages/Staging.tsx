import { useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Upload, Info, ChevronLeft, ChevronRight } from "lucide-react"
import { StagingTable, type StagingItem } from "@/components/staging/StagingTable"
import { MockUploadModal } from "@/components/staging/MockUploadModal"
import { useToast } from "@/hooks/use-toast"

const mockStagingData: StagingItem[] = [
  {
    id: "1",
    date: "15/12/2024",
    description: "PAG*SUPERMERCADO EXTRA",
    value: -185.40,
    cardLabel: "Cartão ****1234",
    suggestedContext: "Pessoal", 
    suggestedCategory: "Alimentação",
    context: "",
    category: "",
    status: "Pendente"
  },
  {
    id: "2",
    date: "14/12/2024", 
    description: "TED CLIENTE SILVA LTDA",
    value: 2500.00,
    suggestedContext: "Empresa",
    suggestedCategory: "Receita",
    context: "",
    category: "",
    status: "Pendente"
  },
  {
    id: "3",
    date: "13/12/2024",
    description: "UBER *TRIP",
    value: -28.50,
    cardLabel: "Débito ****5678",
    suggestedContext: "Pessoal",
    suggestedCategory: "Transporte",
    context: "Pessoal",
    category: "Transporte", 
    status: "Pendente"
  },
  {
    id: "4",
    date: "12/12/2024",
    description: "ALUGUEL ESCRITORIO",
    value: -1200.00,
    suggestedContext: "Empresa",
    suggestedCategory: "Infraestrutura",
    context: "Empresa",
    category: "Infraestrutura",
    status: "Aprovado"
  },
  {
    id: "5",
    date: "11/12/2024",
    description: "FARMACIA POPULAR",
    value: -45.80,
    cardLabel: "Cartão ****1234",
    suggestedContext: "Pessoal",
    suggestedCategory: "Saúde",
    context: "",
    category: "",
    status: "Pendente"
  },
  {
    id: "6",
    date: "10/12/2024",
    description: "DEPOSITO EM ESPECIE",
    value: 500.00,
    suggestedContext: "Pessoal",
    suggestedCategory: "Receita",
    context: "",
    category: "",
    status: "Ignorado"
  }
]

export default function Staging() {
  const [items, setItems] = useState<StagingItem[]>(mockStagingData)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [contextFilter, setContextFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const { toast } = useToast()

  const itemsPerPage = 10
  
  // Filter items
  const filteredItems = items.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchText.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesContext = contextFilter === "all" || item.suggestedContext === contextFilter
    return matchesSearch && matchesStatus && matchesContext
  })

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredItems.slice(startIndex, endIndex)

  const handleUpdateItem = (id: string, updates: Partial<StagingItem>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ))
  }

  const handleSelectItem = (id: string, selected: boolean) => {
    setSelectedItems(prev => 
      selected 
        ? [...prev, id]
        : prev.filter(itemId => itemId !== id)
    )
  }

  const handleSelectAll = (selected: boolean) => {
    setSelectedItems(selected ? currentItems.map(item => item.id) : [])
  }

  const handleBulkSetContext = (context: string) => {
    selectedItems.forEach(id => {
      handleUpdateItem(id, { context })
    })
    toast({
      title: "Contexto definido",
      description: `${selectedItems.length} itens atualizados para ${context}. (Simulação)`
    })
  }

  const handleBulkApprove = () => {
    const itemsToApprove = items.filter(item => 
      selectedItems.includes(item.id) && item.context && item.context !== ''
    )
    
    itemsToApprove.forEach(item => {
      handleUpdateItem(item.id, { status: 'Aprovado' })
    })
    
    setSelectedItems([])
    toast({
      title: "Itens aprovados",
      description: `${itemsToApprove.length} itens aprovados com sucesso. (Simulação)`
    })
  }

  const handleBulkIgnore = () => {
    selectedItems.forEach(id => {
      handleUpdateItem(id, { status: 'Ignorado' })
    })
    setSelectedItems([])
    toast({
      title: "Itens ignorados",
      description: `${selectedItems.length} itens ignorados. (Simulação)`
    })
  }

  const canBulkApprove = selectedItems.every(id => {
    const item = items.find(i => i.id === id)
    return item && item.context && item.context !== ''
  })

  const pendingCount = items.filter(item => item.status === 'Pendente').length
  const approvedCount = items.filter(item => item.status === 'Aprovado').length
  const ignoredCount = items.filter(item => item.status === 'Ignorado').length

  return (
    <DashboardLayout title="Staging (Triagem)">
      <div className="space-y-6">
        {/* Info Banner */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Aqui você revisa as linhas importadas. Defina o <strong>Contexto</strong> e confirme a <strong>Categoria</strong> antes de Aprovar.
          </AlertDescription>
        </Alert>

        {/* Stats */}
        <div className="flex gap-4">
          <Badge variant="outline" className="px-3 py-1">
            Pendente: {pendingCount}
          </Badge>
          <Badge className="bg-green-100 text-green-800 px-3 py-1">
            Aprovado: {approvedCount}
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            Ignorado: {ignoredCount}
          </Badge>
        </div>

        {/* Upload Button */}
        <div className="flex justify-start">
          <Button onClick={() => setUploadModalOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Extrato (Mock)
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Buscar por descrição..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Aprovado">Aprovado</SelectItem>
              <SelectItem value="Ignorado">Ignorado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={contextFilter} onValueChange={setContextFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por contexto sugerido" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Contextos</SelectItem>
              <SelectItem value="Pessoal">Pessoal</SelectItem>
              <SelectItem value="Empresa">Empresa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">
                {selectedItems.length} selecionados:
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkSetContext('Pessoal')}
              >
                Definir Contexto = Pessoal
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkSetContext('Empresa')}
              >
                Definir Contexto = Empresa
              </Button>
              <Button
                size="sm"
                onClick={handleBulkApprove}
                disabled={!canBulkApprove}
              >
                Aprovar Selecionados
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleBulkIgnore}
              >
                Ignorar Selecionados
              </Button>
            </div>
          </div>
        )}

        {/* Table */}
        <StagingTable
          items={currentItems}
          onUpdateItem={handleUpdateItem}
          selectedItems={selectedItems}
          onSelectItem={handleSelectItem}
          onSelectAll={handleSelectAll}
        />

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages} ({filteredItems.length} itens)
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <MockUploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
      />
    </DashboardLayout>
  )
}