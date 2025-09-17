import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { TrendingUp, TrendingDown, DollarSign, Calculator } from "lucide-react"

export default function Analytics() {
  const [period, setPeriod] = useState("30")
  const [context, setContext] = useState("both")

  // Mock data
  const summaryData = {
    totalRevenue: 15000,
    totalExpenses: 8500,
    netBalance: 6500,
    comparison: 12.5,
  }

  const monthlyData = [
    { month: "Jul", receitas: 12000, despesas: 8000 },
    { month: "Ago", receitas: 13500, despesas: 7500 },
    { month: "Set", receitas: 11000, despesas: 9000 },
    { month: "Out", receitas: 14000, despesas: 8200 },
    { month: "Nov", receitas: 15500, despesas: 8800 },
    { month: "Dez", receitas: 15000, despesas: 8500 },
  ]

  const balanceEvolution = [
    { month: "Jul", saldo: 4000 },
    { month: "Ago", saldo: 10000 },
    { month: "Set", saldo: 12000 },
    { month: "Out", saldo: 17800 },
    { month: "Nov", saldo: 24500 },
    { month: "Dez", saldo: 31000 },
  ]

  const expenseCategories = [
    { name: "Alimentação", value: 2500, color: "#8884d8" },
    { name: "Transporte", value: 1200, color: "#82ca9d" },
    { name: "Marketing", value: 1800, color: "#ffc658" },
    { name: "Habitação", value: 2000, color: "#ff7300" },
    { name: "Outros", value: 1000, color: "#8dd1e1" },
  ]

  const revenueCategories = [
    { name: "Vendas", value: 12000, color: "#8884d8" },
    { name: "Serviços", value: 2500, color: "#82ca9d" },
    { name: "Consultoria", value: 500, color: "#ffc658" },
  ]

  const topExpenses = [
    { description: "Aluguel", category: "Habitação", value: 2000 },
    { description: "Marketing Digital", category: "Marketing", value: 1500 },
    { description: "Combustível", category: "Transporte", value: 800 },
    { description: "Supermercado", category: "Alimentação", value: 600 },
    { description: "Internet", category: "Telecomunicações", value: 200 },
  ]

  const topRevenues = [
    { description: "Vendas Produto A", category: "Vendas", value: 8000 },
    { description: "Vendas Produto B", category: "Vendas", value: 4000 },
    { description: "Consultoria", category: "Serviços", value: 2500 },
    { description: "Freelance", category: "Serviços", value: 500 },
  ]

  const activeInstallments = [
    { description: "Notebook Dell", parcelas: "8/12", valorTotal: 3600, valorMensal: 300 },
    { description: "Software Adobe", parcelas: "2/12", valorTotal: 1200, valorMensal: 100 },
    { description: "Curso Online", parcelas: "4/6", valorTotal: 900, valorMensal: 150 },
  ]

  return (
    <DashboardLayout title="Analytics">
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
            <p className="text-muted-foreground">
              Relatórios financeiros detalhados e análises
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Período</label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 90 dias</SelectItem>
                <SelectItem value="365">Últimos 12 meses</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Contexto</label>
            <Select value={context} onValueChange={setContext}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Selecione o contexto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Pessoal</SelectItem>
                <SelectItem value="business">Empresa</SelectItem>
                <SelectItem value="both">Ambos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Receitas</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {summaryData.totalRevenue.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                Últimos {period} dias
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {summaryData.totalExpenses.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                Últimos {period} dias
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Líquido</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {summaryData.netBalance.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                Últimos {period} dias
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comparação</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+{summaryData.comparison}%</div>
              <div className="flex items-center text-xs text-muted-foreground">
                vs. período anterior
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Receitas vs Despesas</CardTitle>
              <CardDescription>Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`R$ ${value.toLocaleString()}`, ""]} />
                  <Bar dataKey="receitas" fill="#8884d8" name="Receitas" />
                  <Bar dataKey="despesas" fill="#82ca9d" name="Despesas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evolução do Saldo</CardTitle>
              <CardDescription>Saldo acumulado</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={balanceEvolution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`R$ ${value.toLocaleString()}`, "Saldo"]} />
                  <Line type="monotone" dataKey="saldo" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Despesas por Categoria</CardTitle>
              <CardDescription>Distribuição das despesas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`R$ ${value.toLocaleString()}`, ""]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Receitas por Categoria</CardTitle>
              <CardDescription>Distribuição das receitas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={revenueCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`R$ ${value.toLocaleString()}`, ""]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Reports */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Despesas</CardTitle>
              <CardDescription>Maiores despesas do período</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topExpenses.map((expense, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{expense.description}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{expense.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right">R$ {expense.value.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top 10 Receitas</CardTitle>
              <CardDescription>Maiores receitas do período</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topRevenues.map((revenue, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{revenue.description}</TableCell>
                      <TableCell>
                        <Badge variant="default">{revenue.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right">R$ {revenue.value.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Parcelados Ativos</CardTitle>
              <CardDescription>Parcelamentos em andamento</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Parcelas</TableHead>
                    <TableHead className="text-right">Mensal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeInstallments.map((installment, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{installment.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{installment.parcelas}</Badge>
                      </TableCell>
                      <TableCell className="text-right">R$ {installment.valorMensal}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}