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

export interface Category {
  id: string
  name: string
  type: "Receita" | "Despesa"
}

interface CategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category
  onSave: (category: Omit<Category, "id"> & { id?: string }) => void
}

export function CategoryModal({ open, onOpenChange, category, onSave }: CategoryModalProps) {
  const [name, setName] = useState("")
  const [type, setType] = useState<"Receita" | "Despesa">("Despesa")

  useEffect(() => {
    if (category) {
      setName(category.name)
      setType(category.type)
    } else {
      setName("")
      setType("Despesa")
    }
  }, [category, open])

  const handleSave = () => {
    if (!name.trim()) return

    onSave({
      id: category?.id,
      name: name.trim(),
      type,
    })

    if (!category) {
      setName("")
      setType("Despesa")
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {category ? "Editar Categoria" : "Nova Categoria"}
          </DialogTitle>
          <DialogDescription>
            {category 
              ? "Edite os detalhes da categoria." 
              : "Adicione uma nova categoria ao sistema."
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome da categoria"
            />
          </div>
          
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            {category ? "Salvar" : "Adicionar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}