import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { format, parseISO } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { UpcomingDueItem } from "@/services/alerts";
import { Badge } from "@/components/ui/badge";

interface AlertCardProps {
  alert: UpcomingDueItem;
  onMarkAsPaid: (sourceId: number, sourceType: 'transaction' | 'invoice') => void;
}

export function AlertCard({ alert, onMarkAsPaid }: AlertCardProps) {
  const isTransaction = alert.type === 'transaction';

  return (
    <Card className={alert.isOverdue ? "border-red-200 bg-red-50" : ""}>
      <CardContent className="p-4 flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="font-medium text-sm leading-none">{alert.description}</h4>
          <p className="text-xs text-muted-foreground">
            Vencimento: {format(parseISO(alert.dueDate), "dd/MM/yyyy")}
          </p>
          {isTransaction && (
            <p className={`text-sm font-medium ${alert.value > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(alert.value)}
            </p>
          )}
           {alert.isOverdue && <Badge variant="destructive">Vencido</Badge>}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onMarkAsPaid(alert.sourceId, alert.sourceType)}
          className="h-8 px-2"
        >
          <Check className="h-4 w-4 mr-1" />
          {alert.value > 0 ? 'Recebido' : 'Pago'}
        </Button>
      </CardContent>
    </Card>
  );
}
