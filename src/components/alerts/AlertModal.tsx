import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Alert {
  id: string
  title: string
  dueDate: Date
  value?: number
  status: 'Pendente' | 'Concluído'
  originType: 'Transação' | 'Fixa' | 'Fatura' | 'Genérico'
}

interface AlertModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  alert?: Alert | null
  onSave: (alert: Omit<Alert, 'id'>) => void
}

export function AlertModal({ open, onOpenChange, alert, onSave }: AlertModalProps) {
  const [formData, setFormData] = useState({
    title: alert?.title || '',
    dueDate: alert?.dueDate || new Date(),
    value: alert?.value || undefined,
    status: alert?.status || 'Pendente' as const,
    originType: alert?.originType || 'Genérico' as const
  })

  const handleSave = () => {
    onSave(formData)
    onOpenChange(false)
    // Reset form
    setFormData({
      title: '',
      dueDate: new Date(),
      value: undefined,
      status: 'Pendente',
      originType: 'Genérico'
    })
  }

  const isEdit = !!alert

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Alerta' : 'Novo Alerta'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Edite o alerta de vencimento' : 'Crie um novo alerta de vencimento'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input 
              id="title" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Ex: Pagamento cartão, Vencimento contrato..."
            />
          </div>

          <div>
            <Label>Data de Vencimento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dueDate ? format(formData.dueDate, "dd/MM/yyyy") : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.dueDate}
                  onSelect={(date) => date && setFormData({...formData, dueDate: date})}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="value">Valor (R$) - Opcional</Label>
            <Input 
              id="value" 
              type="number" 
              step="0.01"
              value={formData.value || ''}
              onChange={(e) => setFormData({...formData, value: e.target.value ? parseFloat(e.target.value) : undefined})}
              placeholder="0,00"
            />
          </div>

          <div>
            <Label htmlFor="originType">Tipo de Origem</Label>
            <Select 
              value={formData.originType} 
              onValueChange={(value: Alert['originType']) => setFormData({...formData, originType: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Transação">Transação</SelectItem>
                <SelectItem value="Fixa">Fixa</SelectItem>
                <SelectItem value="Fatura">Fatura</SelectItem>
                <SelectItem value="Genérico">Genérico</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {isEdit ? 'Salvar Alterações' : 'Salvar Alerta'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}