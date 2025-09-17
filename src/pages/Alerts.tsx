import { useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Edit, Trash, Check, CheckCheck } from "lucide-react"
import { AlertModal, type Alert } from "@/components/alerts/AlertModal"
import { AlertCard } from "@/components/alerts/AlertCard"
import { useIsMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"
import { format, addDays, addMonths, isAfter, isBefore } from "date-fns"
import { cn } from "@/lib/utils"

const mockAlerts: Alert[] = [
  {
    id: "1",
    title: "Pagamento Cartão Nubank",
    dueDate: new Date(2024, 11, 20), // 20/12/2024
    value: 850.40,
    status: "Pendente",
    originType: "Fatura"
  },
  {
    id: "2",
    title: "Aluguel Escritório",
    dueDate: new Date(2024, 11, 15), // 15/12/2024
    value: 1200.00,
    status: "Pendente",
    originType: "Fixa"
  },
  {
    id: "3",
    title: "Renovação Software",
    dueDate: new Date(2024, 11, 30), // 30/12/2024
    value: 299.90,
    status: "Pendente",
    originType: "Genérico"
  },
  {
    id: "4",
    title: "Pagamento Fornecedor",
    dueDate: new Date(2024, 11, 10), // 10/12/2024 - overdue
    value: 1500.00,
    status: "Pendente",
    originType: "Transação"
  },
  {
    id: "5",
    title: "Salário Funcionários",
    dueDate: new Date(2024, 11, 5), // 5/12/2024 - completed
    value: 8500.00,
    status: "Concluído",
    originType: "Fixa"
  },
  {
    id: "6",
    title: "Imposto INSS",
    dueDate: new Date(2024, 11, 25), // 25/12/2024
    value: 650.00,
    status: "Pendente",
    originType: "Genérico"
  }
]

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null)
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [periodFilter, setPeriodFilter] = useState("all")
  const isMobile = useIsMobile()
  const { toast } = useToast()

  const getFilteredAlerts = () => {
    let filtered = alerts.filter(alert => {
      const matchesStatus = statusFilter === "all" || 
        (statusFilter === "pending" && alert.status === "Pendente") ||
        (statusFilter === "completed" && alert.status === "Concluído")

      let matchesPeriod = true
      if (periodFilter === "7days") {
        const next7Days = addDays(new Date(), 7)
        matchesPeriod = isBefore(alert.dueDate, next7Days) || alert.dueDate.toDateString() === next7Days.toDateString()
      } else if (periodFilter === "30days") {
        const next30Days = addDays(new Date(), 30)
        matchesPeriod = isBefore(alert.dueDate, next30Days) || alert.dueDate.toDateString() === next30Days.toDateString()
      }

      return matchesStatus && matchesPeriod
    })

    // Sort by due date, with overdue items first
    return filtered.sort((a, b) => {
      const now = new Date()
      const aOverdue = a.dueDate < now && a.status === 'Pendente'
      const bOverdue = b.dueDate < now && b.status === 'Pendente'
      
      if (aOverdue && !bOverdue) return -1
      if (!aOverdue && bOverdue) return 1
      
      return a.dueDate.getTime() - b.dueDate.getTime()
    })
  }

  const filteredAlerts = getFilteredAlerts()

  const handleSave = (alertData: Omit<Alert, 'id'>) => {
    if (editingAlert) {
      // Edit existing alert
      setAlerts(prev => prev.map(alert => 
        alert.id === editingAlert.id ? { ...alertData, id: editingAlert.id } : alert
      ))
      toast({
        title: "Alerta atualizado",
        description: "Alerta de vencimento atualizado com sucesso. (Simulação)"
      })
    } else {
      // Create new alert
      const newAlert: Alert = {
        ...alertData,
        id: String(alerts.length + 1)
      }
      setAlerts(prev => [newAlert, ...prev])
      toast({
        title: "Alerta criado",
        description: "Novo alerta de vencimento criado com sucesso. (Simulação)"
      })
    }
    setEditingAlert(null)
  }

  const handleEdit = (alert: Alert) => {
    setEditingAlert(alert)
    setModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
    setSelectedAlerts(prev => prev.filter(alertId => alertId !== id))
    toast({
      title: "Alerta excluído",
      description: "Alerta de vencimento removido com sucesso. (Simulação)"
    })
  }

  const handleComplete = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, status: 'Concluído' as const } : alert
    ))
    toast({
      title: "Alerta concluído",
      description: "Alerta marcado como concluído. (Simulação)"
    })
  }

  const handleBulkComplete = () => {
    const pendingSelected = selectedAlerts.filter(id => {
      const alert = alerts.find(a => a.id === id)
      return alert && alert.status === 'Pendente'
    })

    setAlerts(prev => prev.map(alert => 
      pendingSelected.includes(alert.id) ? { ...alert, status: 'Concluído' as const } : alert
    ))

    setSelectedAlerts([])
    toast({
      title: "Alertas concluídos",
      description: `${pendingSelected.length} alerta(s) marcado(s) como concluído(s). (Simulação)`
    })
  }

  const handleSelectAlert = (id: string, selected: boolean) => {
    setSelectedAlerts(prev => 
      selected 
        ? [...prev, id]
        : prev.filter(alertId => alertId !== id)
    )
  }

  const handleSelectAll = (selected: boolean) => {
    setSelectedAlerts(selected ? filteredAlerts.map(alert => alert.id) : [])
  }

  const handleNewAlert = () => {
    setEditingAlert(null)
    setModalOpen(true)
  }

  const allSelected = filteredAlerts.length > 0 && selectedAlerts.length === filteredAlerts.length
  const hasSelectedPending = selectedAlerts.some(id => {
    const alert = alerts.find(a => a.id === id)
    return alert && alert.status === 'Pendente'
  })

  return (
    <DashboardLayout title="Alertas de Vencimento">
      <div className="space-y-6">
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleNewAlert}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Alerta
          </Button>
          {selectedAlerts.length > 0 && hasSelectedPending && (
            <Button variant="outline" onClick={handleBulkComplete}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Marcar Selecionados como Concluídos
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="completed">Concluídos</SelectItem>
            </SelectContent>
          </Select>

          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Períodos</SelectItem>
              <SelectItem value="7days">Próximos 7 dias</SelectItem>
              <SelectItem value="30days">Próximos 30 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Alerts Display */}
        {isMobile ? (
          /* Mobile Card Layout */
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <AlertCard 
                key={alert.id} 
                alert={alert}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onComplete={handleComplete}
                isSelected={selectedAlerts.includes(alert.id)}
                onSelect={handleSelectAlert}
              />
            ))}
          </div>
        ) : (
          /* Desktop Table Layout */
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Data de Vencimento</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tipo de Origem</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.map((alert) => {
                  const isOverdue = alert.dueDate < new Date() && alert.status === 'Pendente'
                  const isSelected = selectedAlerts.includes(alert.id)

                  return (
                    <TableRow 
                      key={alert.id} 
                      className={cn(
                        isSelected && "bg-muted/50",
                        isOverdue && "bg-red-50 border-red-200"
                      )}
                    >
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => handleSelectAlert(alert.id, checked === true)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{alert.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {format(alert.dueDate, "dd/MM/yyyy")}
                          {isOverdue && (
                            <Badge variant="destructive" className="text-xs">
                              Vencido
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {alert.value ? (
                          <span className="font-medium">
                            R$ {alert.value.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={alert.status === 'Concluído' ? 'default' : 'destructive'}>
                          {alert.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {alert.originType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {alert.status === 'Pendente' && (
                              <DropdownMenuItem onClick={() => handleComplete(alert.id)}>
                                <Check className="mr-2 h-4 w-4" />
                                Marcar como Concluído
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleEdit(alert)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(alert.id)}
                              className="text-red-600"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          {filteredAlerts.length} alerta(s) encontrado(s)
        </div>
      </div>

      <AlertModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        alert={editingAlert}
        onSave={handleSave}
      />
    </DashboardLayout>
  )
}