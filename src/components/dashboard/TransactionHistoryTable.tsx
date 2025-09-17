import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const mockTransactions = [
  {
    date: "15/12/2024",
    description: "Venda de Produto A",
    category: "Receita",
    value: 2500.00
  },
  {
    date: "14/12/2024",
    description: "Pagamento Fornecedor X",
    category: "Fornecedores",
    value: -1200.00
  },
  {
    date: "13/12/2024",
    description: "Aluguel Escritório",
    category: "Infraestrutura",
    value: -800.00
  },
  {
    date: "12/12/2024",
    description: "Serviços de Marketing",
    category: "Marketing",
    value: -450.00
  },
  {
    date: "11/12/2024",
    description: "Venda de Serviço B",
    category: "Receita",
    value: 1800.00
  },
  {
    date: "10/12/2024",
    description: "Material de Escritório",
    category: "Operacional",
    value: -320.00
  },
  {
    date: "09/12/2024",
    description: "Consultoria Jurídica",
    category: "Serviços",
    value: -600.00
  },
  {
    date: "08/12/2024",
    description: "Recebimento Cliente Y",
    category: "Receita",
    value: 3200.00
  }
]

export function TransactionHistoryTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Histórico do Mês (Empresa)</CardTitle>
        <CardDescription>
          Últimas transações da empresa no mês atual
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTransactions.map((transaction, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{transaction.date}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-muted text-muted-foreground">
                    {transaction.category}
                  </span>
                </TableCell>
                <TableCell className={`text-right font-medium ${
                  transaction.value > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  R$ {Math.abs(transaction.value).toLocaleString('pt-BR', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}