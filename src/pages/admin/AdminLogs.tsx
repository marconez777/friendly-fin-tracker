import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Download, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface LogEntry {
  id: string;
  dateTime: string;
  userName: string;
  userEmail: string;
  eventType: string;
  description: string;
  origin: string;
}

const mockLogs: LogEntry[] = [
  {
    id: "1",
    dateTime: "2024-01-15 14:30:00",
    userName: "João Silva",
    userEmail: "joao@email.com",
    eventType: "Login",
    description: "Login realizado com sucesso",
    origin: "Sistema"
  },
  {
    id: "2", 
    dateTime: "2024-01-15 14:25:00",
    userName: "Maria Santos",
    userEmail: "maria@email.com",
    eventType: "Pagamento",
    description: "Pagamento de assinatura processado - R$ 49,90",
    origin: "Stripe"
  },
  {
    id: "3",
    dateTime: "2024-01-15 14:20:00", 
    userName: "Admin System",
    userEmail: "admin@system.com",
    eventType: "Admin Action",
    description: "Usuário bloqueado por atividade suspeita",
    origin: "Manual"
  },
  {
    id: "4",
    dateTime: "2024-01-15 14:15:00",
    userName: "Carlos Lima", 
    userEmail: "carlos@email.com",
    eventType: "Transação",
    description: "Nova transação criada - Despesa R$ 150,00",
    origin: "Sistema"
  },
  {
    id: "5",
    dateTime: "2024-01-15 14:10:00",
    userName: "Ana Costa",
    userEmail: "ana@email.com", 
    eventType: "Assinatura",
    description: "Assinatura cancelada - Plano Premium",
    origin: "Stripe"
  }
];

const eventTypes = ["Todos", "Login", "Pagamento", "Assinatura", "Transação", "Admin Action"];
const mockUsers = ["Todos", "João Silva", "Maria Santos", "Carlos Lima", "Ana Costa", "Admin System"];

export default function AdminLogs() {
  const { toast } = useToast();
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    eventType: "Todos",
    user: "Todos"
  });

  const handleSelectLog = (logId: string, checked: boolean) => {
    if (checked) {
      setSelectedLogs([...selectedLogs, logId]);
    } else {
      setSelectedLogs(selectedLogs.filter(id => id !== logId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLogs(logs.map(log => log.id));
    } else {
      setSelectedLogs([]);
    }
  };

  const handleExport = () => {
    toast({
      title: "Exportação realizada",
      description: "Exportação realizada (simulação)",
    });
  };

  const handleClearLogs = () => {
    setLogs([]);
    setSelectedLogs([]);
    toast({
      title: "Logs apagados",
      description: "Logs apagados (simulação)",
    });
  };

  const filteredLogs = logs.filter(log => {
    if (filters.eventType !== "Todos" && log.eventType !== filters.eventType) return false;
    if (filters.user !== "Todos" && log.userName !== filters.user) return false;
    return true;
  });

  return (
    <AdminLayout title="Logs de Auditoria">
      <div className="space-y-6">
        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateFrom">Data Inicial</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateTo">Data Final</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo de Evento</Label>
                <Select value={filters.eventType} onValueChange={(value) => setFilters({...filters, eventType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Usuário</Label>
                <Select value={filters.user} onValueChange={(value) => setFilters({...filters, user: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers.map(user => (
                      <SelectItem key={user} value={user}>{user}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedLogs.length === filteredLogs.length && filteredLogs.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-muted-foreground">
              {selectedLogs.length} de {filteredLogs.length} selecionados
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={selectedLogs.length === 0}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar Selecionados (CSV)
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Limpar Logs
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja apagar todos os logs? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearLogs}>Confirmar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Tabela Desktop */}
        <div className="hidden md:block">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedLogs.length === filteredLogs.length && filteredLogs.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Tipo de Evento</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Origem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedLogs.includes(log.id)}
                          onCheckedChange={(checked) => handleSelectLog(log.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm">{log.dateTime}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{log.userName}</div>
                          <div className="text-sm text-muted-foreground">{log.userEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-primary/10 text-primary">
                          {log.eventType}
                        </span>
                      </TableCell>
                      <TableCell>{log.description}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground">
                          {log.origin}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Cards Mobile */}
        <div className="md:hidden space-y-4">
          {filteredLogs.map((log) => (
            <Card key={log.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <Checkbox
                    checked={selectedLogs.includes(log.id)}
                    onCheckedChange={(checked) => handleSelectLog(log.id, checked as boolean)}
                  />
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 space-y-2">
                  <div className="text-sm font-mono">{log.dateTime}</div>
                  <div>
                    <div className="font-medium">{log.userName}</div>
                    <div className="text-sm text-muted-foreground">{log.userEmail}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-primary/10 text-primary">
                      {log.eventType}
                    </span>
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground">
                      {log.origin}
                    </span>
                  </div>
                  <div className="text-sm">{log.description}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}