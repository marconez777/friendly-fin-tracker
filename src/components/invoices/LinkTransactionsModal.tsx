import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface Transaction {
  id: string
  date: string
  description: string
  category: string
  context: "Pessoal" | "Empresa"
  value: number
}

interface LinkTransactionsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  availableTransactions: Transaction[]
  onLink: (transactions: Transaction[]) => void
  invoiceCardLabel: string
}

export function LinkTransactionsModal({ 
  open, 
  onOpenChange, 
  availableTransactions, 
  onLink, 
  invoiceCardLabel 
}: LinkTransactionsModalProps) {
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const { toast } = useToast()

  const filteredTransactions = availableTransactions.filter(transaction => {
    if (startDate && transaction.date < startDate) return false
    if (endDate && transaction.date > endDate) return false
    return true
  })

  const handleToggleTransaction = (transactionId: string) => {
    setSelectedTransactions(prev => 
      prev.includes(transactionId)
        ? prev.filter(id => id !== transactionId)
        : [...prev, transactionId]
    )
  }

  const handleSubmit = () => {
    const transactionsToLink = availableTransactions.filter(t => 
      selectedTransactions.includes(t.id)
    )
    
    if (transactionsToLink.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos uma transação para vincular"
      })
      return
    }

    onLink(transactionsToLink)
    setSelectedTransactions([])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Vincular Transações - {invoiceCardLabel}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Data Início</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate">Data Fim</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Exibindo apenas transações sem invoice_id (Card Label: {invoiceCardLabel})</p>
            <p>Selecionadas: {selectedTransactions.length} de {filteredTransactions.length}</p>
          </div>

          {/* Tabela de transações */}
          <div className="flex-1 overflow-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedTransactions.length === filteredTransactions.length && filteredTransactions.length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedTransactions(filteredTransactions.map(t => t.id))
                        } else {
                          setSelectedTransactions([])
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Contexto</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedTransactions.includes(transaction.id)}
                        onCheckedChange={() => handleToggleTransaction(transaction.id)}
                      />
                    </TableCell>
                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{transaction.description}</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{transaction.context}</Badge>
                    </TableCell>
                    <TableCell>R$ {transaction.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Vincular Selecionadas ({selectedTransactions.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}