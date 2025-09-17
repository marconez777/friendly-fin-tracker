import { useState } from "react"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MockPayment {
  id: string
  user: string
  amount: number
  currency: string
  method: 'Stripe' | 'Manual'
  status: 'Pendente' | 'Aprovado' | 'Rejeitado'
  date: string
  externalReference?: string
}

const mockPayments: MockPayment[] = [
  {
    id: "1",
    user: "João Silva",
    amount: 29.90,
    currency: "BRL",
    method: "Stripe",
    status: "Aprovado",
    date: "15/12/2024",
    externalReference: "pi_1234567890"
  },
  {
    id: "2",
    user: "Maria Santos", 
    amount: 59.90,
    currency: "BRL",
    method: "Manual",
    status: "Aprovado",
    date: "14/12/2024",
    externalReference: "TED123456"
  },
  {
    id: "3",
    user: "Pedro Costa",
    amount: 29.90,
    currency: "BRL", 
    method: "Stripe",
    status: "Pendente",
    date: "13/12/2024",
    externalReference: "pi_0987654321"
  },
  {
    id: "4",
    user: "Ana Oliveira",
    amount: 89.90,
    currency: "BRL",
    method: "Manual",
    status: "Rejeitado",
    date: "12/12/2024",
    externalReference: "PIX123456"
  }
]

const mockUsers = ["João Silva", "Maria Santos", "Pedro Costa", "Ana Oliveira", "Carlos Pereira"]

export default function AdminPayments() {
  const [payments, setPayments] = useState<MockPayment[]>(mockPayments)
  const [methodFilter, setMethodFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [newPaymentModalOpen, setNewPaymentModalOpen] = useState(false)
  const { toast } = useToast()

  const filteredPayments = payments.filter(payment => {
    const matchesMethod = methodFilter === "all" || payment.method === methodFilter
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    return matchesMethod && matchesStatus
  })

  const handleCreatePayment = () => {
    // Mock create payment
    const newPayment: MockPayment = {
      id: String(payments.length + 1),
      user: "Usuário Mock",
      amount: 29.90,
      currency: "BRL",
      method: "Manual",
      status: "Pendente",
      date: new Date().toLocaleDateString('pt-BR'),
      externalReference: "MANUAL" + Date.now()
    }
    
    setPayments(prev => [newPayment, ...prev])
    setNewPaymentModalOpen(false)
    toast({
      title: "Pagamento registrado",
      description: "Pagamento manual criado com sucesso. (Simulação)"
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>
      case 'Pendente':
        return <Badge variant="secondary">Pendente</Badge>
      case 'Rejeitado':
        return <Badge variant="destructive">Rejeitado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'Stripe':
        return <Badge variant="default">Stripe</Badge>
      case 'Manual':
        return <Badge variant="outline">Manual</Badge>
      default:
        return <Badge variant="secondary">{method}</Badge>
    }
  }

  return (
    <AdminLayout title="Gestão de Pagamentos">
      <div className="space-y-6">
        {/* Action Button */}
        <div className="flex justify-start">
          <Button onClick={() => setNewPaymentModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Registrar Pagamento Manual
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select value={methodFilter} onValueChange={setMethodFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por método" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Métodos</SelectItem>
              <SelectItem value="Stripe">Stripe</SelectItem>
              <SelectItem value="Manual">Manual</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="Aprovado">Aprovado</SelectItem>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Rejeitado">Rejeitado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Payments Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Moeda</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Referência Externa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.user}</TableCell>
                  <TableCell>
                    R$ {payment.amount.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </TableCell>
                  <TableCell>{payment.currency}</TableCell>
                  <TableCell>
                    {getMethodBadge(payment.method)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(payment.status)}
                  </TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {payment.externalReference}
                    </code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="text-sm text-muted-foreground">
          Total de pagamentos: {filteredPayments.length}
        </div>
      </div>

      {/* New Payment Modal */}
      <Dialog open={newPaymentModalOpen} onOpenChange={setNewPaymentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Pagamento Manual</DialogTitle>
            <DialogDescription>
              Adicione um novo pagamento manual ao sistema
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="user">Usuário</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar usuário" />
                </SelectTrigger>
                <SelectContent>
                  {mockUsers.map((user) => (
                    <SelectItem key={user} value={user}>{user}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Valor</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  step="0.01" 
                  placeholder="0,00"
                />
              </div>
              <div>
                <Label htmlFor="currency">Moeda</Label>
                <Select defaultValue="BRL">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRL">BRL</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select defaultValue="Pendente">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Aprovado">Aprovado</SelectItem>
                  <SelectItem value="Rejeitado">Rejeitado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reference">Referência Externa</Label>
              <Input 
                id="reference" 
                placeholder="Ex: TED123456, PIX789012..."
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setNewPaymentModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreatePayment}>
                Registrar Pagamento
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}