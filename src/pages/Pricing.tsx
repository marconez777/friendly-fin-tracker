import { useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { PricingCard } from "@/components/pricing/PricingCard"
import { MockSubscriptionModal, MockPortalModal } from "@/components/pricing/MockModals"
import { Settings } from "lucide-react"

const mockPlans = [
  {
    id: "basic",
    name: "Plano Básico",
    price: 29,
    currency: "BRL",
    period: "mês",
    description: "Ideal para uso pessoal",
    features: [
      "Até 100 transações por mês",
      "1 usuário",
      "Dashboard pessoal",
      "Categorização manual",
      "Suporte por email"
    ]
  },
  {
    id: "pro",
    name: "Plano Pro",
    price: 79,
    currency: "BRL", 
    period: "mês",
    description: "Perfeito para pequenas empresas",
    features: [
      "Transações ilimitadas",
      "Até 5 usuários",
      "Dashboard pessoal + empresarial",
      "Categorização com IA",
      "Upload de extratos",
      "Relatórios avançados",
      "Suporte prioritário"
    ],
    popular: true
  },
  {
    id: "enterprise",
    name: "Plano Enterprise",
    price: 199,
    currency: "BRL",
    period: "mês", 
    description: "Para empresas em crescimento",
    features: [
      "Tudo do Plano Pro",
      "Usuários ilimitados",
      "API completa",
      "Automações avançadas",
      "Integrações personalizadas",
      "Suporte dedicado",
      "Consultoria financeira",
      "White-label (sob consulta)"
    ]
  }
]

export default function Pricing() {
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false)
  const [portalModalOpen, setPortalModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState("")

  const handleSubscribe = (planName: string) => {
    setSelectedPlan(planName)
    setSubscriptionModalOpen(true)
  }

  const handleManageSubscription = () => {
    setPortalModalOpen(true)
  }

  return (
    <DashboardLayout title="Planos de Assinatura">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Escolha o plano ideal para você</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simplifique o controle das suas finanças com nossos planos flexíveis. 
            Comece grátis e evolua conforme suas necessidades crescem.
          </p>
        </div>

        {/* Current Subscription Management */}
        <div className="flex justify-center">
          <Button variant="outline" onClick={handleManageSubscription}>
            <Settings className="h-4 w-4 mr-2" />
            Gerenciar Assinatura Atual
          </Button>
        </div>

        {/* Pricing Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {mockPlans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              onSubscribe={handleSubscribe}
            />
          ))}
        </div>

        {/* FAQ Section */}
        <div className="text-center space-y-4 pt-8 border-t">
          <h3 className="text-xl font-semibold">Dúvidas frequentes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
            <div className="space-y-2">
              <h4 className="font-medium">Posso cancelar a qualquer momento?</h4>
              <p className="text-sm text-muted-foreground">
                Sim, você pode cancelar sua assinatura a qualquer momento sem taxas de cancelamento.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Os dados ficam seguros?</h4>
              <p className="text-sm text-muted-foreground">
                Utilizamos criptografia bancária e não armazenamos dados sensíveis de cartão.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Posso mudar de plano?</h4>
              <p className="text-sm text-muted-foreground">
                Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Existe período de teste?</h4>
              <p className="text-sm text-muted-foreground">
                Oferecemos 7 dias grátis para todos os planos pagos. Teste sem compromisso.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <MockSubscriptionModal
        open={subscriptionModalOpen}
        onOpenChange={setSubscriptionModalOpen}
        planName={selectedPlan}
      />
      
      <MockPortalModal
        open={portalModalOpen}
        onOpenChange={setPortalModalOpen}
      />
    </DashboardLayout>
  )
}