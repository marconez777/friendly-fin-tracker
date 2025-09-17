import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, CheckCircle } from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { CategoryModal, Category } from "@/components/setup/CategoryModal"
import { FixedItemSetupModal, FixedItemSetup } from "@/components/setup/FixedItemSetupModal"
import { useToast } from "@/hooks/use-toast"

export default function Setup() {
  const navigate = useNavigate()
  const { toast } = useToast()

  // Mock categories data
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Salário", type: "Receita" },
    { id: "2", name: "Freelance", type: "Receita" },
    { id: "3", name: "Alimentação", type: "Despesa" },
    { id: "4", name: "Transporte", type: "Despesa" },
    { id: "5", name: "Marketing", type: "Despesa" },
    { id: "6", name: "Hospedagem", type: "Despesa" },
  ])

  // Mock fixed items data
  const [fixedItems, setFixedItems] = useState<FixedItemSetup[]>([
    {
      id: "1",
      description: "Aluguel",
      type: "Despesa",
      context: "Pessoal",
      category: "Habitação",
      value: 2000,
      dueDay: 5,
      isActive: true,
    },
    {
      id: "2",
      description: "Internet",
      type: "Despesa",
      context: "Empresa",
      category: "Telecomunicações",
      value: 200,
      dueDay: 15,
      isActive: true,
    },
    {
      id: "3",
      description: "Salário",
      type: "Receita",
      context: "Pessoal",
      category: "Salário",
      value: 8000,
      dueDay: 1,
      isActive: true,
    },
  ])

  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [fixedModalOpen, setFixedModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>()
  const [editingFixedItem, setEditingFixedItem] = useState<FixedItemSetup | undefined>()

  const handleSaveCategory = (categoryData: Omit<Category, "id"> & { id?: string }) => {
    if (categoryData.id) {
      // Edit existing
      setCategories(prev => prev.map(cat => 
        cat.id === categoryData.id 
          ? { ...categoryData, id: categoryData.id }
          : cat
      ))
      toast({
        title: "Categoria atualizada",
        description: "A categoria foi atualizada com sucesso.",
      })
    } else {
      // Add new
      const newCategory: Category = {
        ...categoryData,
        id: Math.random().toString(36).substr(2, 9),
      }
      setCategories(prev => [...prev, newCategory])
      toast({
        title: "Categoria adicionada",
        description: "A nova categoria foi adicionada com sucesso.",
      })
    }
    setEditingCategory(undefined)
  }

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId))
    toast({
      title: "Categoria removida",
      description: "A categoria foi removida com sucesso.",
    })
  }

  const handleSaveFixedItem = (itemData: Omit<FixedItemSetup, "id"> & { id?: string }) => {
    if (itemData.id) {
      // Edit existing
      setFixedItems(prev => prev.map(item => 
        item.id === itemData.id 
          ? { ...itemData, id: itemData.id }
          : item
      ))
      toast({
        title: "Item fixo atualizado",
        description: "O item fixo foi atualizado com sucesso.",
      })
    } else {
      // Add new
      const newItem: FixedItemSetup = {
        ...itemData,
        id: Math.random().toString(36).substr(2, 9),
      }
      setFixedItems(prev => [...prev, newItem])
      toast({
        title: "Item fixo adicionado",
        description: "O novo item fixo foi adicionado com sucesso.",
      })
    }
    setEditingFixedItem(undefined)
  }

  const handleDeleteFixedItem = (itemId: string) => {
    setFixedItems(prev => prev.filter(item => item.id !== itemId))
    toast({
      title: "Item fixo removido",
      description: "O item fixo foi removido com sucesso.",
    })
  }

  const handleToggleFixedItem = (itemId: string) => {
    setFixedItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, isActive: !item.isActive }
        : item
    ))
    toast({
      title: "Status alterado",
      description: "O status do item fixo foi alterado com sucesso.",
    })
  }

  const handleCompleteSetup = () => {
    toast({
      title: "Setup inicial concluído",
      description: "Setup inicial concluído (simulação)",
    })
    navigate("/dashboard-pessoal")
  }

  return (
    <DashboardLayout title="Setup Inicial">
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Setup Inicial</h2>
            <p className="text-muted-foreground">
              Configure as categorias e itens fixos iniciais do sistema
            </p>
          </div>
          <Button onClick={handleCompleteSetup} className="bg-primary hover:bg-primary/90">
            <CheckCircle className="mr-2 h-4 w-4" />
            Concluir Setup
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Categories Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Categorias</CardTitle>
                  <CardDescription>
                    Gerencie as categorias de receitas e despesas
                  </CardDescription>
                </div>
                <Button
                  onClick={() => {
                    setEditingCategory(undefined)
                    setCategoryModalOpen(true)
                  }}
                  size="sm"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Categoria
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {categories.map((category) => (
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
                      onClick={() => {
                        setEditingCategory(category)
                        setCategoryModalOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Fixed Items Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Despesas/Receitas Fixas Iniciais</CardTitle>
                  <CardDescription>
                    Configure os itens fixos recorrentes
                  </CardDescription>
                </div>
                <Button
                  onClick={() => {
                    setEditingFixedItem(undefined)
                    setFixedModalOpen(true)
                  }}
                  size="sm"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Fixa
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {fixedItems.map((item) => (
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
                      onClick={() => {
                        setEditingFixedItem(item)
                        setFixedModalOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleFixedItem(item.id)}
                    >
                      {item.isActive ? "Desativar" : "Ativar"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFixedItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <CategoryModal
        open={categoryModalOpen}
        onOpenChange={setCategoryModalOpen}
        category={editingCategory}
        onSave={handleSaveCategory}
      />

      <FixedItemSetupModal
        open={fixedModalOpen}
        onOpenChange={setFixedModalOpen}
        item={editingFixedItem}
        onSave={handleSaveFixedItem}
        categories={categories}
      />
    </DashboardLayout>
  )
}