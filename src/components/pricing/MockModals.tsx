import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CreditCard, ExternalLink } from "lucide-react"

interface MockSubscriptionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  planName: string
}

export function MockSubscriptionModal({ open, onOpenChange, planName }: MockSubscriptionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Assinatura - {planName}
          </DialogTitle>
          <DialogDescription>
            Simulação do processo de checkout
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
            <ExternalLink className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-2">
              <div className="text-sm font-medium text-blue-900">
                Integração com Stripe
              </div>
              <div className="text-sm text-blue-700">
                Na implementação real, este botão redirecionará para o Stripe Checkout, onde o usuário poderá:
              </div>
              <ul className="text-xs text-blue-600 space-y-1 ml-4 list-disc">
                <li>Inserir dados do cartão de crédito</li>
                <li>Confirmar os detalhes da assinatura</li>
                <li>Processar o pagamento de forma segura</li>
                <li>Receber confirmação por email</li>
                <li>Ativar automaticamente a assinatura</li>
              </ul>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Esta é apenas uma simulação para demonstrar o fluxo da interface.
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
            <Button>
              Simular Checkout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface MockPortalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MockPortalModal({ open, onOpenChange }: MockPortalModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Portal do Cliente
          </DialogTitle>
          <DialogDescription>
            Gerenciamento de assinatura
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
            <ExternalLink className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="space-y-2">
              <div className="text-sm font-medium text-green-900">
                Portal do Cliente Stripe
              </div>
              <div className="text-sm text-green-700">
                Na implementação real, este botão abrirá o portal do cliente do Stripe, onde o usuário poderá:
              </div>
              <ul className="text-xs text-green-600 space-y-1 ml-4 list-disc">
                <li>Atualizar método de pagamento</li>
                <li>Alterar plano de assinatura</li>
                <li>Visualizar histórico de faturas</li>
                <li>Baixar recibos</li>
                <li>Cancelar assinatura</li>
              </ul>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Esta é apenas uma simulação para demonstrar o fluxo da interface.
          </div>

          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)}>
              Entendi
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}