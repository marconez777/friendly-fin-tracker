import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export interface FixedItem {
  id: string
  description: string
  type: 'Receita' | 'Despesa'
  context: 'Pessoal' | 'Empresa'
  category: string
  value: number
  dueDay: number
  isActive: boolean
}

interface FixedItemModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: FixedItem | null
  onSave: (item: Omit<FixedItem, 'id'>) => void
}

const categories = [
  "Alimentação", "Transporte", "Moradia", "Saúde", "Educação", 
  "Lazer", "Receita", "Infraestrutura", "Operacional", "Marketing",
  "Fornecedores", "Impostos", "Serviços", "Salário", "Aluguel"
]

export function FixedItemModal({ open, onOpenChange, item, onSave }: FixedItemModalProps) {
  const [formData, setFormData] = useState({
    description: item?.description || '',
    type: item?.type || 'Despesa' as const,
    context: item?.context || 'Pessoal' as const,
    category: item?.category || '',
    value: item?.value || 0,
    dueDay: item?.dueDay || 1,
    isActive: item?.isActive ?? true
  })

  const handleSave = () => {
    onSave(formData)
    onOpenChange(false)
    // Reset form
    setFormData({
      description: '',
      type: 'Despesa',
      context: 'Pessoal',
      category: '',
      value: 0,
      dueDay: 1,
      isActive: true
    })
  }

  const isEdit = !!item

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Fixa' : 'Nova Fixa'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Edite a despesa/receita fixa' : 'Adicione uma nova despesa ou receita fixa'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Input 
              id="description" 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Ex: Aluguel, Salário..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: 'Receita' | 'Despesa') => setFormData({...formData, type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Receita">Receita</SelectItem>
                  <SelectItem value="Despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="context">Contexto</Label>
              <Select 
                value={formData.context} 
                onValueChange={(value: 'Pessoal' | 'Empresa') => setFormData({...formData, context: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pessoal">Pessoal</SelectItem>
                  <SelectItem value="Empresa">Empresa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData({...formData, category: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="value">Valor (R$)</Label>
              <Input 
                id="value" 
                type="number" 
                step="0.01"
                value={formData.value}
                onChange={(e) => setFormData({...formData, value: parseFloat(e.target.value) || 0})}
                placeholder="0,00"
              />
            </div>
            
            <div>
              <Label htmlFor="dueDay">Dia do Vencimento</Label>
              <Input 
                id="dueDay" 
                type="number" 
                min="1" 
                max="31"
                value={formData.dueDay}
                onChange={(e) => setFormData({...formData, dueDay: parseInt(e.target.value) || 1})}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="active" 
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({...formData, isActive: checked === true})}
            />
            <Label htmlFor="active">Ativo</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {isEdit ? 'Salvar Alterações' : 'Salvar Fixa'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}