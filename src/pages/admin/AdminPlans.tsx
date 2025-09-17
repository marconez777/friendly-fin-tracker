import { useState } from "react"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Edit, Trash, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MockPlan {
  id: string
  name: string
  stripePriceId: string
  status: 'Ativo' | 'Inativo'
  features: string
}

const mockPlans: MockPlan[] = [
  {
    id: "1",
    name: "Plano Basic",
    stripePriceId: "price_1234567890",
    status: "Ativo",
    features: JSON.stringify({
      transacoes: 100,
      usuarios: 1,
      storage: "1GB",
      suporte: "Email"
    }, null, 2)
  },
  {
    id: "2",
    name: "Plano Premium",
    stripePriceId: "price_0987654321",
    status: "Ativo", 
    features: JSON.stringify({
      transacoes: 1000,
      usuarios: 5,
      storage: "10GB",
      suporte: "Email + Chat",
      relatorios: true
    }, null, 2)
  },
  {
    id: "3",
    name: "Plano Enterprise",
    stripePriceId: "price_1122334455",
    status: "Inativo",
    features: JSON.stringify({
      transacoes: "Ilimitado",
      usuarios: "Ilimitado",
      storage: "100GB",
      suporte: "Email + Chat + Telefone",
      relatorios: true,
      api: true
    }, null, 2)
  }
]

export default function AdminPlans() {
  const [plans, setPlans] = useState<MockPlan[]>(mockPlans)
  const [newPlanModalOpen, setNewPlanModalOpen] = useState(false)
  const [editPlanModalOpen, setEditPlanModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<MockPlan | null>(null)
  const { toast } = useToast()

  const handleToggleStatus = (planId: string) => {
    setPlans(prev => prev.map(plan => 
      plan.id === planId ? { 
        ...plan, 
        status: plan.status === 'Ativo' ? 'Inativo' : 'Ativo' 
      } : plan
    ))
    toast({
      title: "Status alterado",
      description: "Status do plano atualizado. (Simulação)"
    })
  }

  const handleEdit = (plan: MockPlan) => {
    setSelectedPlan(plan)
    setEditPlanModalOpen(true)
  }

  const handleDelete = (planId: string) => {
    setPlans(prev => prev.filter(plan => plan.id !== planId))
    toast({
      title: "Plano excluído",
      description: "Plano removido do sistema. (Simulação)"
    })
  }

  const handleCreatePlan = () => {
    const newPlan: MockPlan = {
      id: String(plans.length + 1),
      name: "Novo Plano",
      stripePriceId: "price_mock" + Date.now(),
      status: "Ativo",
      features: JSON.stringify({
        transacoes: 50,
        usuarios: 1,
        storage: "500MB"
      }, null, 2)
    }
    
    setPlans(prev => [newPlan, ...prev])
    setNewPlanModalOpen(false)
    toast({
      title: "Plano criado",
      description: "Novo plano criado com sucesso. (Simulação)"
    })
  }

  const handleUpdatePlan = () => {
    if (!selectedPlan) return
    
    setPlans(prev => prev.map(plan => 
      plan.id === selectedPlan.id ? selectedPlan : plan
    ))
    setEditPlanModalOpen(false)
    setSelectedPlan(null)
    toast({
      title: "Plano atualizado",
      description: "Plano atualizado com sucesso. (Simulação)"
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ativo':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>
      case 'Inativo':
        return <Badge variant="secondary">Inativo</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <AdminLayout title="Gestão de Planos">
      <div className="space-y-6">
        {/* Action Button */}
        <div className="flex justify-start">
          <Button onClick={() => setNewPlanModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Plano
          </Button>
        </div>

        {/* Plans Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Stripe Price ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {plan.stripePriceId}
                    </code>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(plan.status)}
                  </TableCell>
                  <TableCell>
                    <details className="cursor-pointer">
                      <summary className="text-sm text-muted-foreground hover:text-foreground">
                        Ver features
                      </summary>
                      <pre className="text-xs mt-2 p-2 bg-muted rounded max-w-xs overflow-auto">
                        {plan.features}
                      </pre>
                    </details>
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
                        <DropdownMenuItem onClick={() => handleEdit(plan)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(plan.id)}>
                          {plan.status === 'Ativo' ? (
                            <>
                              <EyeOff className="mr-2 h-4 w-4" />
                              Desativar
                            </>
                          ) : (
                            <>
                              <Eye className="mr-2 h-4 w-4" />
                              Ativar
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(plan.id)}
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

        <div className="text-sm text-muted-foreground">
          Total de planos: {plans.length}
        </div>
      </div>

      {/* New Plan Modal */}
      <Dialog open={newPlanModalOpen} onOpenChange={setNewPlanModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Plano</DialogTitle>
            <DialogDescription>
              Crie um novo plano de assinatura
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Plano</Label>
              <Input 
                id="name" 
                placeholder="Ex: Plano Premium"
              />
            </div>
            
            <div>
              <Label htmlFor="stripe-price-id">Stripe Price ID</Label>
              <Input 
                id="stripe-price-id" 
                placeholder="price_1234567890"
              />
            </div>

            <div>
              <Label htmlFor="features">Features (JSON)</Label>
              <Textarea 
                id="features" 
                placeholder='{"transacoes": 100, "usuarios": 1}'
                rows={8}
                defaultValue={JSON.stringify({
                  transacoes: 100,
                  usuarios: 1,
                  storage: "1GB"
                }, null, 2)}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setNewPlanModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreatePlan}>
                Criar Plano
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Plan Modal */}
      <Dialog open={editPlanModalOpen} onOpenChange={setEditPlanModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Plano</DialogTitle>
            <DialogDescription>
              Atualize as informações do plano
            </DialogDescription>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nome do Plano</Label>
                <Input 
                  id="edit-name" 
                  value={selectedPlan.name}
                  onChange={(e) => setSelectedPlan({...selectedPlan, name: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-stripe-price-id">Stripe Price ID</Label>
                <Input 
                  id="edit-stripe-price-id" 
                  value={selectedPlan.stripePriceId}
                  onChange={(e) => setSelectedPlan({...selectedPlan, stripePriceId: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="edit-features">Features (JSON)</Label>
                <Textarea 
                  id="edit-features" 
                  value={selectedPlan.features}
                  onChange={(e) => setSelectedPlan({...selectedPlan, features: e.target.value})}
                  rows={8}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setEditPlanModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleUpdatePlan}>
                  Salvar Alterações
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}