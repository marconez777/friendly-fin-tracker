import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { ExternalLink, CreditCard, AlertTriangle } from "lucide-react"

interface ManageSubscriptionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ManageSubscriptionModal({ open, onOpenChange }: ManageSubscriptionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Gerenciar Assinatura
          </DialogTitle>
          <DialogDescription>
            Portal do cliente Stripe
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
                No sistema real, este botão abrirá o portal do cliente do Stripe, onde você poderá:
              </div>
              <ul className="text-xs text-green-600 space-y-1 ml-4 list-disc">
                <li>Atualizar método de pagamento</li>
                <li>Visualizar histórico de faturas</li>
                <li>Baixar recibos</li>
                <li>Alterar endereço de cobrança</li>
                <li>Gerenciar preferências de email</li>
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

interface CancelSubscriptionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function CancelSubscriptionModal({ open, onOpenChange, onConfirm }: CancelSubscriptionModalProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Cancelar Assinatura
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>Tem certeza que deseja cancelar sua assinatura?</p>
            <div className="bg-amber-50 p-3 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Importante:</strong> Após o cancelamento, você manterá acesso aos recursos premium até o final do período atual de cobrança.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Esta ação pode ser revertida. Você poderá reativar sua assinatura a qualquer momento.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Manter Assinatura</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="bg-red-600 hover:bg-red-700">
            Sim, Cancelar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

interface ChangePlanModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentPlan: string
  onChangePlan: (newPlan: string) => void
}

const mockPlans = [
  { id: "basic", name: "Plano Básico", price: "R$ 29/mês" },
  { id: "pro", name: "Plano Pro", price: "R$ 79/mês" },
  { id: "enterprise", name: "Plano Enterprise", price: "R$ 199/mês" }
]

export function ChangePlanModal({ open, onOpenChange, currentPlan, onChangePlan }: ChangePlanModalProps) {
  const [selectedPlan, setSelectedPlan] = useState(currentPlan)

  const handleSave = () => {
    onChangePlan(selectedPlan)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Alterar Plano</DialogTitle>
          <DialogDescription>
            Selecione um novo plano para sua assinatura
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="plan">Plano</Label>
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockPlans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.name}>
                    {plan.name} - {plan.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Simulação:</strong> No sistema real, mudanças de plano serão processadas através do Stripe e aplicadas no próximo ciclo de cobrança.
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Alterar Plano
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}