import { useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Shield, CreditCard, Calendar, Settings, X, RefreshCw } from "lucide-react"
import { ManageSubscriptionModal, CancelSubscriptionModal, ChangePlanModal } from "@/components/account/AccountModals"
import { useToast } from "@/hooks/use-toast"

type UserRole = "User" | "Admin"
type SubscriptionStatus = "Active" | "Trialing" | "Past Due" | "Canceled"
type PaymentMethod = "Stripe" | "Manual"

// Mock user data
const mockUser = {
  name: "João Silva",
  email: "joao@exemplo.com",
  role: "User" as UserRole
}

// Mock subscription data
const mockSubscription = {
  plan: "Plano Pro",
  status: "Active" as SubscriptionStatus,
  expirationDate: "15/01/2025",
  paymentMethod: "Stripe" as PaymentMethod
}

export default function Account() {
  const [user] = useState(mockUser)
  const [subscription, setSubscription] = useState(mockSubscription)
  const [manageModalOpen, setManageModalOpen] = useState(false)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [changePlanModalOpen, setChangePlanModalOpen] = useState(false)
  const { toast } = useToast()

  const handleCancelSubscription = () => {
    setSubscription(prev => ({ ...prev, status: "Canceled" as SubscriptionStatus }))
    toast({
      title: "Assinatura cancelada",
      description: "Sua assinatura foi cancelada com sucesso. (Simulação)",
      variant: "destructive"
    })
  }

  const handleChangePlan = (newPlan: string) => {
    setSubscription(prev => ({ ...prev, plan: newPlan }))
    toast({
      title: "Plano alterado",
      description: `Seu plano foi alterado para ${newPlan}. (Simulação)`
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>
      case 'Trialing':
        return <Badge className="bg-blue-100 text-blue-800">Período de Teste</Badge>
      case 'Past Due':
        return <Badge variant="destructive">Vencido</Badge>
      case 'Canceled':
        return <Badge variant="secondary">Cancelado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentMethodBadge = (method: string) => {
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
    <DashboardLayout title="Minha Conta">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações do Usuário
              </CardTitle>
              <CardDescription>
                Suas informações pessoais no sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{user.name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Permissão</p>
                  <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Status da Assinatura
              </CardTitle>
              <CardDescription>
                Informações sobre sua assinatura atual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Plano Atual</p>
                  <p className="font-medium">{subscription.plan}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(subscription.status)}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Data de Expiração</p>
                  <p className="font-medium">{subscription.expirationDate}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Método de Pagamento</p>
                  {getPaymentMethodBadge(subscription.paymentMethod)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações da Conta</CardTitle>
            <CardDescription>
              Gerencie sua assinatura e configurações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button 
                onClick={() => setManageModalOpen(true)}
                className="w-full"
              >
                <Settings className="h-4 w-4 mr-2" />
                Gerenciar Assinatura
              </Button>

              <Button 
                variant="outline"
                onClick={() => setChangePlanModalOpen(true)}
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Alterar Plano
              </Button>

              <Button 
                variant="destructive"
                onClick={() => setCancelModalOpen(true)}
                className="w-full"
                disabled={subscription.status === 'Canceled'}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar Assinatura
              </Button>
            </div>

            <Separator className="my-6" />

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Informações Importantes</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Você pode cancelar sua assinatura a qualquer momento</li>
                <li>• Mudanças de plano entram em vigor no próximo ciclo de cobrança</li>
                <li>• Todos os dados são mantidos mesmo após cancelamento</li>
                <li>• Suporte está disponível via email: suporte@financesaas.com</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <ManageSubscriptionModal
        open={manageModalOpen}
        onOpenChange={setManageModalOpen}
      />

      <CancelSubscriptionModal
        open={cancelModalOpen}
        onOpenChange={setCancelModalOpen}
        onConfirm={handleCancelSubscription}
      />

      <ChangePlanModal
        open={changePlanModalOpen}
        onOpenChange={setChangePlanModalOpen}
        currentPlan={subscription.plan}
        onChangePlan={handleChangePlan}
      />
    </DashboardLayout>
  )
}