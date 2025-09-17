import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit, Trash, Check } from "lucide-react"
import { format } from "date-fns"
import type { Alert } from "./AlertModal"

interface AlertCardProps {
  alert: Alert
  onEdit: (alert: Alert) => void
  onDelete: (id: string) => void
  onComplete: (id: string) => void
  isSelected: boolean
  onSelect: (id: string, selected: boolean) => void
}

export function AlertCard({ alert, onEdit, onDelete, onComplete, isSelected, onSelect }: AlertCardProps) {
  const isOverdue = alert.dueDate < new Date() && alert.status === 'Pendente'
  const isCompleted = alert.status === 'Concluído'

  return (
    <Card className={cn(
      "w-full",
      isOverdue && "border-red-200 bg-red-50",
      isCompleted && "opacity-75"
    )}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2 flex-1">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => onSelect(alert.id, checked === true)}
                className="mt-1"
              />
              <div className="space-y-1 flex-1">
                <h4 className="font-medium text-sm leading-none">
                  {alert.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  Vencimento: {format(alert.dueDate, "dd/MM/yyyy")}
                </p>
                {alert.value && (
                  <p className="text-sm font-medium">
                    R$ {alert.value.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant={alert.status === 'Concluído' ? 'default' : 'destructive'} className="text-xs">
              {alert.status}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {alert.originType}
            </Badge>
            {isOverdue && (
              <Badge variant="destructive" className="text-xs">
                Vencido
              </Badge>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            {alert.status === 'Pendente' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onComplete(alert.id)}
                className="h-8 px-2"
              >
                <Check className="h-3 w-3" />
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(alert)}
              className="h-8 px-2"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(alert.id)}
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

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}