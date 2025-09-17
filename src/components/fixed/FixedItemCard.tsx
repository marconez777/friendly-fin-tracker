import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash, ToggleLeft, ToggleRight } from "lucide-react"
import type { FixedItem } from "./FixedItemModal"

interface FixedItemCardProps {
  item: FixedItem
  onEdit: (item: FixedItem) => void
  onDelete: (id: string) => void
  onToggleActive: (id: string) => void
}

export function FixedItemCard({ item, onEdit, onDelete, onToggleActive }: FixedItemCardProps) {
  const isIncome = item.type === 'Receita'

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h4 className="font-medium text-sm leading-none">
                {item.description}
              </h4>
              <p className="text-xs text-muted-foreground">
                Vencimento: dia {item.dueDay}
              </p>
            </div>
            <div className={`text-right ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
              <div className="font-semibold">
                R$ {item.value.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant={isIncome ? 'default' : 'destructive'} className="text-xs">
              {item.type}
            </Badge>
            <Badge 
              variant={item.context === 'Pessoal' ? 'default' : 'outline'} 
              className="text-xs"
            >
              {item.context}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {item.category}
            </Badge>
            <Badge variant={item.isActive ? 'default' : 'secondary'} className="text-xs">
              {item.isActive ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(item)}
              className="h-8 px-2"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onToggleActive(item.id)}
              className="h-8 px-2"
            >
              {item.isActive ? (
                <ToggleRight className="h-3 w-3" />
              ) : (
                <ToggleLeft className="h-3 w-3" />
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(item.id)}
              className="h-8 px-2 text-red-600 hover:text-red-700"
            >
              <Trash className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}