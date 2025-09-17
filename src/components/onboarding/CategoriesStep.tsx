import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2 } from "lucide-react"

interface Category {
  id: string
  name: string
  type: "Receita" | "Despesa"
}

interface CategoriesStepProps {
  data: Category[]
  onChange: (data: Category[]) => void
}

export function CategoriesStep({ data, onChange }: CategoriesStepProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "Despesa" as "Receita" | "Despesa",
  })

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        type: category.type,
      })
    } else {
      setEditingCategory(null)
      setFormData({
        name: "",
        type: "Despesa",
      })
    }
    setModalOpen(true)
  }

  const handleSave = () => {
    if (!formData.name.trim()) return

    if (editingCategory) {
      // Edit existing
      const updatedCategories = data.map(cat =>
        cat.id === editingCategory.id
          ? { ...cat, name: formData.name.trim(), type: formData.type }
          : cat
      )
      onChange(updatedCategories)
    } else {
      // Add new
      const newCategory: Category = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name.trim(),
        type: formData.type,
      }
      onChange([...data, newCategory])
    }

    setModalOpen(false)
    setFormData({ name: "", type: "Despesa" })
  }

  const handleDelete = (categoryId: string) => {
    const updatedCategories = data.filter(cat => cat.id !== categoryId)
    onChange(updatedCategories)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-lg font-medium mb-2">Configure suas categorias</h3>
        <p className="text-muted-foreground">
          Organize suas transações com categorias. Você precisará de pelo menos 2 categorias.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <h4 className="font-medium">Categorias ({data.length})</h4>
        <Button onClick={() => handleOpenModal()} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      <div className="grid gap-3 max-h-80 overflow-y-auto">
        {data.map((category) => (
          <div key={category.id} className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <Badge variant={category.type === "Receita" ? "default" : "secondary"}>
                {category.type}
              </Badge>
              <span className="font-medium">{category.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOpenModal(category)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(category.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {data.length < 2 && (
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Adicione pelo menos 2 categorias para continuar
          </p>
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Editar Categoria" : "Nova Categoria"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory 
                ? "Edite os detalhes da categoria." 
                : "Adicione uma nova categoria."
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category-name">Nome</Label>
              <Input
                id="category-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Digite o nome da categoria"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category-type">Tipo</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: "Receita" | "Despesa") => 
                  setFormData(prev => ({ ...prev, type: value }))
                }
              >
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
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!formData.name.trim()}>
              {editingCategory ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}