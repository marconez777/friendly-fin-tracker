import { useState } from "react"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, X, Edit, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MockSubscription {
  id: string
  user: string
  plan: string
  status: 'Ativo' | 'Cancelado' | 'Expirado' | 'Pausado'
  expirationDate: string
  method: 'Stripe' | 'Manual'
}

const mockSubscriptions: MockSubscription[] = [
  {
    id: "1",
    user: "João Silva",
    plan: "Plano Premium",
    status: "Ativo",
    expirationDate: "15/01/2025",
    method: "Stripe"
  },
  {
    id: "2",
    user: "Maria Santos",
    plan: "Plano Basic",
    status: "Ativo", 
    expirationDate: "20/01/2025",
    method: "Manual"
  },
  {
    id: "3",
    user: "Pedro Costa",
    plan: "Plano Premium",
    status: "Expirado",
    expirationDate: "10/12/2024",
    method: "Stripe"
  },
  {
    id: "4",
    user: "Ana Oliveira",
    plan: "Plano Basic",
    status: "Cancelado",
    expirationDate: "05/12/2024",
    method: "Manual"
  }
]

const mockUsers = ["João Silva", "Maria Santos", "Pedro Costa", "Ana Oliveira", "Carlos Pereira"]
const mockPlans = ["Plano Basic", "Plano Premium", "Plano Enterprise"]

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<MockSubscription[]>(mockSubscriptions)
  const [newSubscriptionModalOpen, setNewSubscriptionModalOpen] = useState(false)
  const { toast } = useToast()

  const handleForceCancel = (subscriptionId: string) => {
    setSubscriptions(prev => prev.map(sub => 
      sub.id === subscriptionId ? { ...sub, status: 'Cancelado' } : sub
    ))
    toast({
      title: "Assinatura cancelada",
      description: "Assinatura cancelada forçadamente. (Simulação)"
    })
  }

  const handleChangePlan = (subscriptionId: string) => {
    // Mock plan change
    toast({
      title: "Plano alterado",
      description: "Plano da assinatura atualizado. (Simulação)"
    })
  }

  const handleAdjustPeriod = (subscriptionId: string) => {
    // Mock period adjustment
    toast({
      title: "Período ajustado",
      description: "Período da assinatura ajustado. (Simulação)"
    })
  }

  const handleCreateSubscription = () => {
    const newSubscription: MockSubscription = {
      id: String(subscriptions.length + 1),
      user: "Usuário Mock",
      plan: "Plano Basic",
      status: "Ativo",
      expirationDate: "15/02/2025",
      method: "Manual"
    }
    
    setSubscriptions(prev => [newSubscription, ...prev])
    setNewSubscriptionModalOpen(false)
    toast({
      title: "Assinatura criada",
      description: "Assinatura manual criada com sucesso. (Simulação)"
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ativo':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>
      case 'Cancelado':
        return <Badge variant="destructive">Cancelado</Badge>
      case 'Expirado':
        return <Badge variant="secondary">Expirado</Badge>
      case 'Pausado':
        return <Badge variant="outline">Pausado</Badge>
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
    <AdminLayout title="Gestão de Assinaturas">
      <div className="space-y-6">
        {/* Action Button */}
        <div className="flex justify-start">
          <Button onClick={() => setNewSubscriptionModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Assinatura Manual
          </Button>
        </div>

        {/* Subscriptions Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Expiração</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell className="font-medium">{subscription.user}</TableCell>
                  <TableCell>{subscription.plan}</TableCell>
                  <TableCell>
                    {getStatusBadge(subscription.status)}
                  </TableCell>
                  <TableCell>{subscription.expirationDate}</TableCell>
                  <TableCell>
                    {getMethodBadge(subscription.method)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleChangePlan(subscription.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Alterar Plano
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAdjustPeriod(subscription.id)}>
                          <Calendar className="mr-2 h-4 w-4" />
                          Ajustar Período
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleForceCancel(subscription.id)}
                          className="text-red-600"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Forçar Cancelamento
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="text-sm text-muted-foreground">
          Total de assinaturas: {subscriptions.length}
        </div>
      </div>

      {/* New Subscription Modal */}
      <Dialog open={newSubscriptionModalOpen} onOpenChange={setNewSubscriptionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Assinatura Manual</DialogTitle>
            <DialogDescription>
              Adicione uma nova assinatura manual ao sistema
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
            
            <div>
              <Label htmlFor="plan">Plano</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar plano" />
                </SelectTrigger>
                <SelectContent>
                  {mockPlans.map((plan) => (
                    <SelectItem key={plan} value={plan}>{plan}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="period">Período (dias)</Label>
                <Input 
                  id="period" 
                  type="number" 
                  placeholder="30"
                  defaultValue="30"
                />
              </div>
              <div>
                <Label htmlFor="method">Método</Label>
                <Select defaultValue="Manual">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="Stripe">Stripe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setNewSubscriptionModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateSubscription}>
                Criar Assinatura
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}