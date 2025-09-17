import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { FixedItemSetupModal, FixedItemSetup } from "@/components/setup/FixedItemSetupModal"

interface Category {
  id: string
  name: string
  type: "Receita" | "Despesa"
}

interface FixedItemsStepProps {
  data: FixedItemSetup[]
  categories: Category[]
  onChange: (data: FixedItemSetup[]) => void
}

export function FixedItemsStep({ data, categories, onChange }: FixedItemsStepProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<FixedItemSetup | undefined>()

  const handleOpenModal = (item?: FixedItemSetup) => {
    setEditingItem(item)
    setModalOpen(true)
  }

  const handleSave = (itemData: Omit<FixedItemSetup, "id"> & { id?: string }) => {
    if (itemData.id) {
      // Edit existing
      const updatedItems = data.map(item =>
        item.id === itemData.id
          ? { ...itemData, id: itemData.id }
          : item
      )
      onChange(updatedItems)
    } else {
      // Add new
      const newItem: FixedItemSetup = {
        ...itemData,
        id: Math.random().toString(36).substr(2, 9),
      }
      onChange([...data, newItem])
    }
    setEditingItem(undefined)
  }

  const handleDelete = (itemId: string) => {
    const updatedItems = data.filter(item => item.id !== itemId)
    onChange(updatedItems)
  }

  const handleToggleActive = (itemId: string) => {
    const updatedItems = data.map(item =>
      item.id === itemId
        ? { ...item, isActive: !item.isActive }
        : item
    )
    onChange(updatedItems)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-lg font-medium mb-2">Configure suas despesas e receitas fixas</h3>
        <p className="text-muted-foreground">
          Adicione seus lançamentos recorrentes. Você precisará de pelo menos 1 item para continuar.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <h4 className="font-medium">Itens Fixos ({data.length})</h4>
        <Button onClick={() => handleOpenModal()} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Fixa
        </Button>
      </div>

      <div className="grid gap-3 max-h-80 overflow-y-auto">
        {data.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={item.type === "Receita" ? "default" : "secondary"}>
                  {item.type}
                </Badge>
                <Badge variant="outline">{item.context}</Badge>
                {!item.isActive && <Badge variant="destructive">Inativo</Badge>}
              </div>
              <div className="font-medium">{item.description}</div>
              <div className="text-sm text-muted-foreground">
                {item.category} • Dia {item.dueDay} • R$ {item.value.toFixed(2)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOpenModal(item)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleActive(item.id)}
              >
                {item.isActive ? "Desativar" : "Ativar"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Adicione pelo menos 1 item fixo para continuar
          </p>
        </div>
      )}

      <FixedItemSetupModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        item={editingItem}
        onSave={handleSave}
        categories={categories}
      />
    </div>
  )
}