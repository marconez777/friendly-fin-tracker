import { useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Upload, ChevronLeft, ChevronRight } from "lucide-react"
import { NewTransactionModal } from "@/components/transactions/NewTransactionModal"
import { UploadExtractModal } from "@/components/transactions/UploadExtractModal"
import { TransactionCard } from "@/components/transactions/TransactionCard"
import { useIsMobile } from "@/hooks/use-mobile"

const mockTransactions = [
  {
    id: "1",
    date: "15/12/2024",
    description: "Supermercado Extra",
    category: "Alimentação",
    context: "Pessoal",
    value: -250.80,
    cardLabel: "Cartão Nubank"
  },
  {
    id: "2", 
    date: "14/12/2024",
    description: "Salário Dezembro",
    category: "Receita",
    context: "Pessoal",
    value: 4500.00
  },
  {
    id: "3",
    date: "13/12/2024",
    description: "Venda Produto A",
    category: "Receita",
    context: "Empresa",
    value: 2800.00
  },
  {
    id: "4",
    date: "12/12/2024",
    description: "Uber",
    category: "Transporte",
    context: "Pessoal",
    value: -28.50,
    cardLabel: "Débito Itaú"
  },
  {
    id: "5",
    date: "11/12/2024",
    description: "Aluguel Escritório",
    category: "Infraestrutura",
    context: "Empresa", 
    value: -1200.00
  },
  {
    id: "6",
    date: "10/12/2024",
    description: "Academia",
    category: "Saúde",
    context: "Pessoal",
    value: -89.90,
    cardLabel: "Cartão Nubank"
  },
  {
    id: "7",
    date: "09/12/2024",
    description: "Material Escritório",
    category: "Operacional",
    context: "Empresa",
    value: -320.00
  },
  {
    id: "8",
    date: "08/12/2024",
    description: "Cinema",
    category: "Lazer",
    context: "Pessoal",
    value: -45.00,
    cardLabel: "Cartão Nubank"
  }
]

export default function Transactions() {
  const [newTransactionModalOpen, setNewTransactionModalOpen] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState("atual")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedContext, setSelectedContext] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const isMobile = useIsMobile()

  const itemsPerPage = 10
  const totalPages = Math.ceil(mockTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTransactions = mockTransactions.slice(startIndex, endIndex)

  return (
    <DashboardLayout title="Transações">
      <div className="space-y-6">
        {/* Action Buttons */}
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

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="atual">Mês Atual</SelectItem>
              <SelectItem value="anterior">Mês Anterior</SelectItem>
              <SelectItem value="todos">Todos os Meses</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Categorias</SelectItem>
              <SelectItem value="alimentacao">Alimentação</SelectItem>
              <SelectItem value="transporte">Transporte</SelectItem>
              <SelectItem value="moradia">Moradia</SelectItem>
              <SelectItem value="saude">Saúde</SelectItem>
              <SelectItem value="educacao">Educação</SelectItem>
              <SelectItem value="lazer">Lazer</SelectItem>
              <SelectItem value="receita">Receita</SelectItem>
              <SelectItem value="infraestrutura">Infraestrutura</SelectItem>
              <SelectItem value="operacional">Operacional</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedContext} onValueChange={setSelectedContext}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por contexto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Contextos</SelectItem>
              <SelectItem value="personal">Pessoal</SelectItem>
              <SelectItem value="business">Empresa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transactions Display */}
        {isMobile ? (
          /* Mobile Card Layout */
          <div className="space-y-4">
            {currentTransactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </div>
        ) : (
          /* Desktop Table Layout */
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Contexto</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Card Label</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTransactions.map((transaction) => {
                  const isPositive = transaction.value > 0
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {transaction.date}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {transaction.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={transaction.context === 'Pessoal' ? 'default' : 'outline'}
                          className="text-xs"
                        >
                          {transaction.context}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-right font-medium ${
                        isPositive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {isPositive ? '+' : '-'}R$ {Math.abs(transaction.value).toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </TableCell>
                      <TableCell>
                        {transaction.cardLabel && (
                          <Badge variant="outline" className="text-xs">
                            {transaction.cardLabel}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages} ({mockTransactions.length} transações)
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

      {/* Modals */}
      <NewTransactionModal 
        open={newTransactionModalOpen}
        onOpenChange={setNewTransactionModalOpen}
      />
      <UploadExtractModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
      />
    </DashboardLayout>
  )
}