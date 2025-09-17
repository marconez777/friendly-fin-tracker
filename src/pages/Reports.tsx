import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { FileText, Download, Save, Share2, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const reportTypes = [
  "Extrato por Período",
  "Despesas por Categoria", 
  "Receitas por Categoria",
  "Parcelados",
  "Faturas de Cartão",
  "Fixas do Mês",
  "Alertas",
  "Fluxo de Caixa"
];

const mockCategories = ["Alimentação", "Transporte", "Marketing", "Serviços", "Vendas"];
const mockCardLabels = ["Nubank", "Visa XP", "Mastercard Itaú"];

interface SavedModel {
  id: string;
  name: string;
  type: string;
  lastUsed: string;
}

const mockModels: SavedModel[] = [
  { id: "1", name: "Relatório Mensal", type: "Extrato por Período", lastUsed: "2024-01-15" },
  { id: "2", name: "Despesas Marketing", type: "Despesas por Categoria", lastUsed: "2024-01-10" }
];

export default function Reports() {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [savedModels, setSavedModels] = useState<SavedModel[]>(mockModels);
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    context: "Ambos",
    categories: [] as string[],
    cardLabel: "Todos",
    status: "Todos",
    negativeAsParentheses: false,
    includeNotes: true
  });

  const handleGeneratePreview = () => {
    if (!selectedType) {
      toast({
        title: "Erro",
        description: "Selecione um tipo de relatório primeiro",
        variant: "destructive"
      });
      return;
    }
    setShowPreview(true);
    toast({
      title: "Prévia gerada",
      description: "Prévia do relatório gerada com dados mock",
    });
  };

  const handleExportPDF = () => {
    toast({
      title: "PDF gerado",
      description: "PDF gerado (simulação)",
    });
  };

  const handleExportExcel = () => {
    toast({
      title: "Excel gerado", 
      description: "Excel gerado (simulação)",
    });
  };

  const handleSaveModel = () => {
    const modelName = prompt("Nome do modelo:");
    if (modelName) {
      const newModel: SavedModel = {
        id: Date.now().toString(),
        name: modelName,
        type: selectedType,
        lastUsed: new Date().toISOString().split('T')[0]
      };
      setSavedModels([...savedModels, newModel]);
      toast({
        title: "Modelo salvo",
        description: `Modelo "${modelName}" salvo com sucesso`,
      });
    }
  };

  const renderPreview = () => {
    if (!showPreview || !selectedType) return null;

    switch (selectedType) {
      case "Extrato por Período":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Contexto</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Card Label</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>15/01/2024</TableCell>
                <TableCell>Almoço restaurante</TableCell>
                <TableCell>Alimentação</TableCell>
                <TableCell>Pessoal</TableCell>
                <TableCell>R$ 45,00</TableCell>
                <TableCell>Nubank</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>14/01/2024</TableCell>
                <TableCell>Combustível</TableCell>
                <TableCell>Transporte</TableCell>
                <TableCell>Pessoal</TableCell>
                <TableCell>R$ 120,00</TableCell>
                <TableCell>Visa XP</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        );

      case "Despesas por Categoria":
        const expenseData = [
          { name: "Alimentação", value: 1200, color: "#8884d8" },
          { name: "Transporte", value: 800, color: "#82ca9d" },
          { name: "Marketing", value: 600, color: "#ffc658" }
        ];
        return (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>% do Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenseData.map(item => (
                  <TableRow key={item.name}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>R$ {item.value.toFixed(2)}</TableCell>
                    <TableCell>{((item.value / expenseData.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%" 
                    outerRadius={80}
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case "Fluxo de Caixa":
        const cashflowData = [
          { date: "Jan", entradas: 5000, saidas: 3500, saldo: 1500 },
          { date: "Fev", entradas: 5500, saidas: 3800, saldo: 3200 },
          { date: "Mar", entradas: 6000, saidas: 4200, saldo: 5000 }
        ];
        return (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Período</TableHead>
                  <TableHead>Entradas</TableHead>
                  <TableHead>Saídas</TableHead>
                  <TableHead>Saldo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cashflowData.map(item => (
                  <TableRow key={item.date}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell className="text-green-600">R$ {item.entradas.toFixed(2)}</TableCell>
                    <TableCell className="text-red-600">R$ {item.saidas.toFixed(2)}</TableCell>
                    <TableCell className="font-medium">R$ {item.saldo.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cashflowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="saldo" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            Prévia não implementada para este tipo de relatório
          </div>
        );
    }
  };

  const shouldShowCategoryFilter = selectedType === "Extrato por Período" || 
                                  selectedType === "Despesas por Categoria" || 
                                  selectedType === "Receitas por Categoria";

  const shouldShowCardLabelFilter = selectedType === "Faturas de Cartão";

  const shouldShowStatusFilter = selectedType === "Faturas de Cartão" || 
                                selectedType === "Alertas" || 
                                selectedType === "Parcelados";

  return (
    <DashboardLayout title="Relatórios Exportáveis">
      <div className="space-y-6">
        {/* Seleção do Relatório */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Tipo de Relatório
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de relatório *</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de relatório" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Modelo Salvo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Carregar modelo existente" />
                  </SelectTrigger>
                  <SelectContent>
                    {savedModels.map(model => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name} ({model.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filtros Dinâmicos */}
        {selectedType && (
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <Label>Contexto</Label>
                  <Select value={filters.context} onValueChange={(value) => setFilters({...filters, context: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ambos">Ambos</SelectItem>
                      <SelectItem value="Pessoal">Pessoal</SelectItem>
                      <SelectItem value="Empresa">Empresa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {shouldShowCategoryFilter && (
                  <div className="space-y-2">
                    <Label>Categorias</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar categorias" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCategories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {shouldShowCardLabelFilter && (
                  <div className="space-y-2">
                    <Label>Card Label</Label>
                    <Select value={filters.cardLabel} onValueChange={(value) => setFilters({...filters, cardLabel: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Todos">Todos</SelectItem>
                        {mockCardLabels.map(label => (
                          <SelectItem key={label} value={label}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {shouldShowStatusFilter && (
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Todos">Todos</SelectItem>
                        {selectedType === "Faturas de Cartão" && (
                          <>
                            <SelectItem value="OPEN">OPEN</SelectItem>
                            <SelectItem value="CLOSED">CLOSED</SelectItem>
                            <SelectItem value="PAID">PAID</SelectItem>
                          </>
                        )}
                        {selectedType === "Alertas" && (
                          <>
                            <SelectItem value="Pendentes">Pendentes</SelectItem>
                            <SelectItem value="Concluídos">Concluídos</SelectItem>
                          </>
                        )}
                        {selectedType === "Parcelados" && (
                          <>
                            <SelectItem value="Ativos">Ativos</SelectItem>
                            <SelectItem value="Inativos">Inativos</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="negative-parentheses"
                    checked={filters.negativeAsParentheses}
                    onCheckedChange={(checked) => setFilters({...filters, negativeAsParentheses: checked})}
                  />
                  <Label htmlFor="negative-parentheses">Mostrar valores negativos como ( )</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="include-notes"
                    checked={filters.includeNotes}
                    onCheckedChange={(checked) => setFilters({...filters, includeNotes: checked})}
                  />
                  <Label htmlFor="include-notes">Incluir observações/notas no rodapé</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2">
            <Button onClick={handleGeneratePreview} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Gerar Prévia
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSaveModel} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Salvar como Modelo
            </Button>
            <Button 
              variant="outline" 
              onClick={handleExportPDF}
              disabled={!showPreview}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar PDF
            </Button>
            <Button 
              variant="outline" 
              onClick={handleExportExcel}
              disabled={!showPreview}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar Excel
            </Button>
          </div>
        </div>

        {/* Área de Prévia */}
        {showPreview && (
          <Card>
            <CardHeader>
              <CardTitle>Prévia do Relatório - {selectedType}</CardTitle>
            </CardHeader>
            <CardContent>
              {renderPreview()}
            </CardContent>
          </Card>
        )}

        {/* Modelos Salvos */}
        <Card>
          <CardHeader>
            <CardTitle>Modelos Salvos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {savedModels.map(model => (
                <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{model.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {model.type} • Último uso: {model.lastUsed}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Aplicar</Button>
                    <Button variant="outline" size="sm">Renomear</Button>
                    <Button variant="outline" size="sm">Excluir</Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => toast({
                        title: "Link compartilhado",
                        description: "Link de relatório compartilhado (simulação)"
                      })}
                      className="flex items-center gap-1"
                    >
                      <Share2 className="h-3 w-3" />
                      Compartilhar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}