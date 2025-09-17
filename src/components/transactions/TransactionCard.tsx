import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Transaction {
  id: string
  date: string
  description: string
  category: string
  context: string
  value: number
  cardLabel?: string
}

interface TransactionCardProps {
  transaction: Transaction
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const isPositive = transaction.value > 0

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h4 className="font-medium text-sm leading-none">
                {transaction.description}
              </h4>
              <p className="text-xs text-muted-foreground">
                {transaction.date}
              </p>
            </div>
            <div className={`text-right ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <div className="font-semibold">
                {isPositive ? '+' : '-'}R$ {Math.abs(transaction.value).toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              {transaction.category}
            </Badge>
            <Badge 
              variant={transaction.context === 'Pessoal' ? 'default' : 'outline'} 
              className="text-xs"
            >
              {transaction.context}
            </Badge>
            {transaction.cardLabel && (
              <Badge variant="outline" className="text-xs">
                {transaction.cardLabel}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}