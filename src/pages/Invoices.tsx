import { useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Calculator, Eye, Check, RotateCcw, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { useIsMobile } from "@/hooks/use-mobile"
import { NewInvoiceModal } from "@/components/invoices/NewInvoiceModal"

interface Invoice {
  id: string
  cardLabel: string
  closingDate: string
  dueDate: string
  total: number
  status: "OPEN" | "CLOSED" | "PAID"
}

const mockInvoices: Invoice[] = [
  {
    id: "1",
    cardLabel: "Nubank",
    closingDate: "2024-01-15",
    dueDate: "2024-02-05",
    total: 2543.80,
    status: "OPEN"
  },
  {
    id: "2", 
    cardLabel: "Visa XP",
    closingDate: "2024-01-10",
    dueDate: "2024-01-30",
    total: 1876.45,
    status: "CLOSED"
  },
  {
    id: "3",
    cardLabel: "Mastercard Inter",
    closingDate: "2023-12-25",
    dueDate: "2024-01-15",
    total: 987.32,
    status: "PAID"
  }
]

const cardOptions = ["Nubank", "Visa XP", "Mastercard Inter", "Santander", "Bradesco"]

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)
  const [selectedCard, setSelectedCard] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedPeriod, setSelectedPeriod] = useState<string>("2024-01")
  const [newInvoiceModalOpen, setNewInvoiceModalOpen] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const filteredInvoices = invoices.filter(invoice => {
    if (selectedCard !== "all" && invoice.cardLabel !== selectedCard) return false
    if (selectedStatus !== "all" && invoice.status !== selectedStatus) return false
    return true
  })

  const handleStatusChange = (invoiceId: string, newStatus: "OPEN" | "CLOSED" | "PAID") => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id === invoiceId ? { ...invoice, status: newStatus } : invoice
    ))
    
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

  const handleRecalculate = () => {
    toast({
      title: "Recálculo realizado",
      description: "Totais recalculados com base nas transações vinculadas (simulação)"
    })
  }

  const handleAddInvoice = (invoice: Omit<Invoice, 'id'>) => {
    const newInvoice = {
      ...invoice,
      id: String(invoices.length + 1)
    }
    setInvoices(prev => [...prev, newInvoice])
    toast({
      title: "Fatura criada",
      description: "Nova fatura adicionada com sucesso (simulação)"
    })
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      OPEN: "default",
      CLOSED: "secondary", 
      PAID: "default"
    } as const
    
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
      <DashboardLayout title="Faturas">
        <div className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedCard} onValueChange={setSelectedCard}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cartão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os cartões</SelectItem>
                  {cardOptions.map(card => (
                    <SelectItem key={card} value={card}>{card}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="OPEN">OPEN</SelectItem>
                  <SelectItem value="CLOSED">CLOSED</SelectItem>
                  <SelectItem value="PAID">PAID</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="month"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex flex-col gap-3">
            <Button onClick={() => setNewInvoiceModalOpen(true)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Nova Fatura
            </Button>
            <Button variant="outline" onClick={handleRecalculate} className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              Recalcular Totais (Mock)
            </Button>
          </div>

          {/* Lista de faturas em cards */}
          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <Card key={invoice.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{invoice.cardLabel}</h3>
                        <p className="text-sm text-muted-foreground">
                          Venc: {new Date(invoice.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      {getStatusBadge(invoice.status)}
                    </div>
                    
                    <div className="text-lg font-bold">
                      R$ {invoice.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/invoices/${invoice.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      
                      {invoice.status === "OPEN" && (
                        <Button 
                          size="sm"
                          onClick={() => handleStatusChange(invoice.id, "CLOSED")}
                        >
                          <Lock className="h-4 w-4 mr-1" />
                          Fechar
                        </Button>
                      )}
                      
                      {invoice.status === "CLOSED" && (
                        <>
                          <Button 
                            size="sm"
                            onClick={() => handleStatusChange(invoice.id, "PAID")}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Pagar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleStatusChange(invoice.id, "OPEN")}
                          >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Reabrir
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <NewInvoiceModal
          open={newInvoiceModalOpen}
          onOpenChange={setNewInvoiceModalOpen}
          onSubmit={handleAddInvoice}
          cardOptions={cardOptions}
        />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Faturas">
      <div className="space-y-6">
        {/* Filtros e Ações */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            <Select value={selectedCard} onValueChange={setSelectedCard}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Selecione o cartão" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os cartões</SelectItem>
                {cardOptions.map(card => (
                  <SelectItem key={card} value={card}>{card}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="OPEN">OPEN</SelectItem>
                <SelectItem value="CLOSED">CLOSED</SelectItem>
                <SelectItem value="PAID">PAID</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="month"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-40"
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={() => setNewInvoiceModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Fatura
            </Button>
            <Button variant="outline" onClick={handleRecalculate}>
              <Calculator className="h-4 w-4 mr-2" />
              Recalcular Totais (Mock)
            </Button>
          </div>
        </div>

        {/* Tabela de faturas */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Card Label</TableHead>
                <TableHead>Fechamento</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.cardLabel}</TableCell>
                  <TableCell>{new Date(invoice.closingDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>R$ {invoice.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/invoices/${invoice.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {invoice.status === "OPEN" && (
                        <Button 
                          size="sm"
                          onClick={() => handleStatusChange(invoice.id, "CLOSED")}
                        >
                          <Lock className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {invoice.status === "CLOSED" && (
                        <>
                          <Button 
                            size="sm"
                            onClick={() => handleStatusChange(invoice.id, "PAID")}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleStatusChange(invoice.id, "OPEN")}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <NewInvoiceModal
        open={newInvoiceModalOpen}
        onOpenChange={setNewInvoiceModalOpen}
        onSubmit={handleAddInvoice}
        cardOptions={cardOptions}
      />
    </DashboardLayout>
  )
}