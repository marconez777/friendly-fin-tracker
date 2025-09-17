import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, Lock, RotateCcw, Trash2, Plus, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"
import { LinkTransactionsModal } from "@/components/invoices/LinkTransactionsModal"
import { GenerateInstallmentsModal } from "@/components/invoices/GenerateInstallmentsModal"

interface Transaction {
  id: string
  date: string
  description: string
  category: string
  context: "Pessoal" | "Empresa"
  value: number
}

interface Invoice {
  id: string
  cardLabel: string
  closingDate: string
  dueDate: string
  total: number
  status: "OPEN" | "CLOSED" | "PAID"
}

const mockInvoice: Invoice = {
  id: "1",
  cardLabel: "Nubank",
  closingDate: "2024-01-15",
  dueDate: "2024-02-05",
  total: 2543.80,
  status: "OPEN"
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2024-01-10",
    description: "Supermercado Extra",
    category: "Alimentação",
    context: "Pessoal",
    value: 245.67
  },
  {
    id: "2", 
    date: "2024-01-12",
    description: "Posto Shell",
    category: "Combustível",
    context: "Empresa",
    value: 180.50
  },
  {
    id: "3",
    date: "2024-01-14",
    description: "Netflix",
    category: "Entretenimento", 
    context: "Pessoal",
    value: 39.90
  }
]

const availableTransactions: Transaction[] = [
  {
    id: "4",
    date: "2024-01-16",
    description: "Farmácia Droga Raia",
    category: "Saúde",
    context: "Pessoal",
    value: 87.45
  },
  {
    id: "5",
    date: "2024-01-18", 
    description: "Uber",
    category: "Transporte",
    context: "Empresa",
    value: 25.80
  }
]

export default function InvoiceDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const isMobile = useIsMobile()
  
  const [invoice, setInvoice] = useState<Invoice>(mockInvoice)
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [linkModalOpen, setLinkModalOpen] = useState(false)
  const [installmentsModalOpen, setInstallmentsModalOpen] = useState(false)

  const handleStatusChange = (newStatus: "OPEN" | "CLOSED" | "PAID") => {
    setInvoice(prev => ({ ...prev, status: newStatus }))
    
    const messages = {
      CLOSED: "Fatura fechada (simulação)",
      PAID: "Fatura paga (simulação)",
      OPEN: "Fatura reaberta (simulação)"
    }
    
    toast({
      title: "Sucesso",
      description: messages[newStatus]
    })
  }

  const handleRemoveTransaction = (transactionId: string) => {
    setTransactions(prev => prev.filter(t => t.id !== transactionId))
    toast({
      title: "Transação removida",
      description: "Transação removida da fatura (simulação)"
    })
  }

  const handleLinkTransactions = (selectedTransactions: Transaction[]) => {
    setTransactions(prev => [...prev, ...selectedTransactions])
    toast({
      title: "Transações vinculadas",
      description: `${selectedTransactions.length} transações vinculadas à fatura (simulação)`
    })
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      OPEN: "bg-blue-100 text-blue-800",
      CLOSED: "bg-yellow-100 text-yellow-800", 
      PAID: "bg-green-100 text-green-800"
    }
    
    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status}
      </Badge>
    )
  }

  if (isMobile) {
    return (
      <DashboardLayout title="Detalhes da Fatura">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/invoices')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold">Fatura #{invoice.id}</h2>
          </div>

          {/* Informações da fatura */}
          <Card>
            <CardHeader>
              <CardTitle>{invoice.cardLabel}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Fechamento</p>
                  <p>{new Date(invoice.closingDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Vencimento</p>
                  <p>{new Date(invoice.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="text-xl font-bold">R$ {invoice.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                {getStatusBadge(invoice.status)}
              </div>

              <div className="grid grid-cols-1 gap-2">
                {invoice.status === "OPEN" && (
                  <Button onClick={() => handleStatusChange("CLOSED")}>
                    <Lock className="h-4 w-4 mr-2" />
                    Fechar Fatura
                  </Button>
                )}
                
                {invoice.status === "CLOSED" && (
                  <>
                    <Button onClick={() => handleStatusChange("PAID")}>
                      <Check className="h-4 w-4 mr-2" />
                      Marcar como Paga
                    </Button>
                    <Button variant="outline" onClick={() => handleStatusChange("OPEN")}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reabrir
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="grid grid-cols-1 gap-3">
            <Button variant="outline" onClick={() => setLinkModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Vincular Transações
            </Button>
            <Button variant="outline" onClick={() => setInstallmentsModalOpen(true)}>
              <CreditCard className="h-4 w-4 mr-2" />
              Gerar Parcelas (Mock)
            </Button>
          </div>

          {/* Transações */}
          <Card>
            <CardHeader>
              <CardTitle>Transações da Fatura</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{transaction.description}</h4>
                        <p className="text-sm text-muted-foreground">{transaction.category}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRemoveTransaction(transaction.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{new Date(transaction.date).toLocaleDateString()}</span>
                      <span className="font-medium">R$ {transaction.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <Badge variant="outline" className="mt-2">
                      {transaction.context}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <LinkTransactionsModal
          open={linkModalOpen}
          onOpenChange={setLinkModalOpen}
          availableTransactions={availableTransactions}
          onLink={handleLinkTransactions}
          invoiceCardLabel={invoice.cardLabel}
        />

        <GenerateInstallmentsModal
          open={installmentsModalOpen}
          onOpenChange={setInstallmentsModalOpen}
          defaultCardLabel={invoice.cardLabel}
        />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Detalhes da Fatura">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/invoices')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-semibold">Fatura #{invoice.id} - {invoice.cardLabel}</h2>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setLinkModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Vincular Transações
            </Button>
            <Button variant="outline" onClick={() => setInstallmentsModalOpen(true)}>
              <CreditCard className="h-4 w-4 mr-2" />
              Gerar Parcelas (Mock)
            </Button>
          </div>
        </div>

        {/* Informações da fatura */}
        <Card>
          <CardHeader>
            <CardTitle>Informações da Fatura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Fechamento</p>
                <p className="font-medium">{new Date(invoice.closingDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vencimento</p>
                <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-bold">R$ {invoice.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="mt-1">{getStatusBadge(invoice.status)}</div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              {invoice.status === "OPEN" && (
                <Button onClick={() => handleStatusChange("CLOSED")}>
                  <Lock className="h-4 w-4 mr-2" />
                  Fechar Fatura
                </Button>
              )}
              
              {invoice.status === "CLOSED" && (
                <>
                  <Button onClick={() => handleStatusChange("PAID")}>
                    <Check className="h-4 w-4 mr-2" />
                    Marcar como Paga
                  </Button>
                  <Button variant="outline" onClick={() => handleStatusChange("OPEN")}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reabrir
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Transações da fatura */}
        <Card>
          <CardHeader>
            <CardTitle>Transações da Fatura</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Contexto</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{transaction.description}</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{transaction.context}</Badge>
                    </TableCell>
                    <TableCell>R$ {transaction.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRemoveTransaction(transaction.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <LinkTransactionsModal
        open={linkModalOpen}
        onOpenChange={setLinkModalOpen}
        availableTransactions={availableTransactions}
        onLink={handleLinkTransactions}
        invoiceCardLabel={invoice.cardLabel}
      />

      <GenerateInstallmentsModal
        open={installmentsModalOpen}
        onOpenChange={setInstallmentsModalOpen}
        defaultCardLabel={invoice.cardLabel}
      />
    </DashboardLayout>
  )
}