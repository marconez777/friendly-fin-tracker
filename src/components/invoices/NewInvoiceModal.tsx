import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NewInvoiceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (invoice: {
    cardLabel: string
    closingDate: string
    dueDate: string
    total: number
    status: "OPEN" | "CLOSED" | "PAID"
  }) => void
  cardOptions: string[]
}

export function NewInvoiceModal({ open, onOpenChange, onSubmit, cardOptions }: NewInvoiceModalProps) {
  const [cardLabel, setCardLabel] = useState("")
  const [closingDate, setClosingDate] = useState("")
  const [dueDate, setDueDate] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!cardLabel || !closingDate || !dueDate) return

    onSubmit({
      cardLabel,
      closingDate,
      dueDate,
      total: 0, // Será calculado baseado nas transações
      status: "OPEN"
    })

    // Reset form
    setCardLabel("")
    setClosingDate("")
    setDueDate("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Fatura</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="cardLabel">Card Label</Label>
            <Select value={cardLabel} onValueChange={setCardLabel}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione ou digite o cartão" />
              </SelectTrigger>
              <SelectContent>
                {cardOptions.map(card => (
                  <SelectItem key={card} value={card}>{card}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="closingDate">Data de Fechamento</Label>
            <Input
              id="closingDate"
              type="date"
              value={closingDate}
              onChange={(e) => setClosingDate(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="dueDate">Data de Vencimento</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div className="text-sm text-muted-foreground">
            <p>• Status inicial: OPEN</p>
            <p>• Total será calculado baseado nas transações vinculadas</p>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Criar Fatura
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}