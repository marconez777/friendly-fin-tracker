import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

interface NewTransactionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewTransactionModal({ open, onOpenChange }: NewTransactionModalProps) {
  const [useSplit, setUseSplit] = useState(false)
  const [splitPercentage, setSplitPercentage] = useState([50])

  const handleSave = () => {
    // Mock save - just close modal
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
          <DialogDescription>
            Adicione uma nova transação ao sistema
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Data</Label>
              <Input 
                id="date" 
                type="date" 
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label htmlFor="value">Valor (R$)</Label>
              <Input 
                id="value" 
                type="number" 
                step="0.01" 
                placeholder="0,00"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea 
              id="description" 
              placeholder="Descreva a transação..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alimentacao">Alimentação</SelectItem>
                  <SelectItem value="transporte">Transporte</SelectItem>
                  <SelectItem value="moradia">Moradia</SelectItem>
                  <SelectItem value="saude">Saúde</SelectItem>
                  <SelectItem value="educacao">Educação</SelectItem>
                  <SelectItem value="lazer">Lazer</SelectItem>
                  <SelectItem value="receita">Receita</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="context">Contexto</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar contexto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Pessoal</SelectItem>
                  <SelectItem value="business">Empresa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="card-label">Card Label (opcional)</Label>
            <Input 
              id="card-label" 
              placeholder="Ex: Cartão Nubank, Débito Itaú..."
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="split" 
                checked={useSplit}
                onCheckedChange={(checked) => setUseSplit(checked === true)}
              />
              <Label htmlFor="split">Dividir entre Pessoal e Empresa</Label>
            </div>
            
            {useSplit && (
              <div className="space-y-2">
                <Label>Porcentagem Pessoal: {splitPercentage[0]}%</Label>
                <Slider
                  value={splitPercentage}
                  onValueChange={setSplitPercentage}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="text-sm text-muted-foreground">
                  Empresa: {100 - splitPercentage[0]}%
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar Transação
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}