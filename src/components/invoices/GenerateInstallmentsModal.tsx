import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface GenerateInstallmentsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultCardLabel: string
}

export function GenerateInstallmentsModal({ 
  open, 
  onOpenChange, 
  defaultCardLabel 
}: GenerateInstallmentsModalProps) {
  const [description, setDescription] = useState("")
  const [totalValue, setTotalValue] = useState("")
  const [installments, setInstallments] = useState("")
  const [cardLabel, setCardLabel] = useState(defaultCardLabel)
  const [context, setContext] = useState<"Pessoal" | "Empresa">("Pessoal")
  const [splitPercentage, setSplitPercentage] = useState("")
  const [mode, setMode] = useState<"monthly" | "per-invoice">("monthly")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!description || !totalValue || !installments || !cardLabel) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios"
      })
      return
    }

    const numInstallments = parseInt(installments)
    const value = parseFloat(totalValue)
    
    if (isNaN(numInstallments) || numInstallments < 1) {
      toast({
        title: "Erro", 
        description: "Número de parcelas deve ser maior que 0"
      })
      return
    }

    if (isNaN(value) || value <= 0) {
      toast({
        title: "Erro",
        description: "Valor total deve ser maior que 0"
      })
      return
    }

    // Simular geração de parcelas
    const installmentValue = value / numInstallments
    
    toast({
      title: "Parcelas geradas (simulação)",
      description: `${numInstallments} parcelas de R$ ${installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} criadas no modo ${mode === 'monthly' ? 'mensal' : 'por fatura'}`
    })

    // Reset form
    setDescription("")
    setTotalValue("")
    setInstallments("")
    setContext("Pessoal")
    setSplitPercentage("")
    setMode("monthly")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gerar Parcelas (Mock)</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Notebook Dell para trabalho"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalValue">Valor Total (R$)</Label>
              <Input
                id="totalValue"
                type="number"
                step="0.01"
                value={totalValue}
                onChange={(e) => setTotalValue(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Label htmlFor="installments">Nº de Parcelas</Label>
              <Input
                id="installments"
                type="number"
                min="1"
                value={installments}
                onChange={(e) => setInstallments(e.target.value)}
                placeholder="12"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="cardLabel">Card Label</Label>
            <Input
              id="cardLabel"
              value={cardLabel}
              onChange={(e) => setCardLabel(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="context">Contexto</Label>
            <Select value={context} onValueChange={(value: "Pessoal" | "Empresa") => setContext(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pessoal">Pessoal</SelectItem>
                <SelectItem value="Empresa">Empresa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="splitPercentage">Split (% Pessoal) - Opcional</Label>
            <Input
              id="splitPercentage"
              type="number"
              min="0"
              max="100"
              value={splitPercentage}
              onChange={(e) => setSplitPercentage(e.target.value)}
              placeholder="Ex: 70 (70% pessoal, 30% empresa)"
            />
          </div>

          <div>
            <Label htmlFor="mode">Modo de Geração</Label>
            <Select value={mode} onValueChange={(value: "monthly" | "per-invoice") => setMode(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Mensal (uma por mês)</SelectItem>
                <SelectItem value="per-invoice">Por Fatura (distribuído nas próximas faturas)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>• As parcelas serão criadas como transações futuras</p>
            <p>• Serão automaticamente vinculadas às faturas correspondentes</p>
            {splitPercentage && <p>• Split: {splitPercentage}% pessoal, {100 - parseInt(splitPercentage || "0")}% empresa</p>}
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Gerar Parcelas
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}