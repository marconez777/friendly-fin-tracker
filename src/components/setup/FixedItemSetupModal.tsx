import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export interface FixedItemSetup {
  id: string
  description: string
  type: "Receita" | "Despesa"
  context: "Pessoal" | "Empresa"
  category: string
  value: number
  dueDay: number
  isActive: boolean
}

interface FixedItemSetupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: FixedItemSetup
  onSave: (item: Omit<FixedItemSetup, "id"> & { id?: string }) => void
  categories: Array<{ name: string; type: string }>
}

export function FixedItemSetupModal({ 
  open, 
  onOpenChange, 
  item, 
  onSave, 
  categories 
}: FixedItemSetupModalProps) {
  const [description, setDescription] = useState("")
  const [type, setType] = useState<"Receita" | "Despesa">("Despesa")
  const [context, setContext] = useState<"Pessoal" | "Empresa">("Pessoal")
  const [category, setCategory] = useState("")
  const [value, setValue] = useState("")
  const [dueDay, setDueDay] = useState("1")
  const [isActive, setIsActive] = useState(true)

  const filteredCategories = categories.filter(cat => cat.type === type)

  useEffect(() => {
    if (item) {
      setDescription(item.description)
      setType(item.type)
      setContext(item.context)
      setCategory(item.category)
      setValue(item.value.toString())
      setDueDay(item.dueDay.toString())
      setIsActive(item.isActive)
    } else {
      setDescription("")
      setType("Despesa")
      setContext("Pessoal")
      setCategory("")
      setValue("")
      setDueDay("1")
      setIsActive(true)
    }
  }, [item, open])

  // Reset category when type changes
  useEffect(() => {
    setCategory("")
  }, [type])

  const handleSave = () => {
    if (!description.trim() || !category || !value || !dueDay) return

    onSave({
      id: item?.id,
      description: description.trim(),
      type,
      context,
      category,
      value: parseFloat(value),
      dueDay: parseInt(dueDay),
      isActive,
    })

    if (!item) {
      setDescription("")
      setType("Despesa")
      setContext("Pessoal")
      setCategory("")
      setValue("")
      setDueDay("1")
      setIsActive(true)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {item ? "Editar Item Fixo" : "Novo Item Fixo"}
          </DialogTitle>
          <DialogDescription>
            {item 
              ? "Edite os detalhes do item fixo." 
              : "Adicione um novo item fixo ao sistema."
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite a descrição"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={type} onValueChange={(value: "Receita" | "Despesa") => setType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Receita">Receita</SelectItem>
                  <SelectItem value="Despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="context">Contexto</Label>
              <Select value={context} onValueChange={(value: "Pessoal" | "Empresa") => setContext(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o contexto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pessoal">Pessoal</SelectItem>
                  <SelectItem value="Empresa">Empresa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((cat) => (
                  <SelectItem key={cat.name} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="value">Valor (R$)</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                min="0"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="0,00"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dueDay">Dia do Vencimento</Label>
              <Select value={dueDay} onValueChange={setDueDay}>
                <SelectTrigger>
                  <SelectValue placeholder="Dia" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(checked as boolean)}
            />
            <Label htmlFor="isActive">Ativo</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!description.trim() || !category || !value || !dueDay}
          >
            {item ? "Salvar" : "Adicionar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}