import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

interface PricingPlan {
  id: string
  name: string
  price: number
  currency: string
  period: string
  description: string
  features: string[]
  popular?: boolean
}

interface PricingCardProps {
  plan: PricingPlan
  onSubscribe: (planName: string) => void
}

export function PricingCard({ plan, onSubscribe }: PricingCardProps) {
  return (
    <Card className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
      {plan.popular && (
        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
          Mais Popular
        </Badge>
      )}
      
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">R$ {plan.price}</span>
          <span className="text-muted-foreground">/{plan.period}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button 
          className="w-full" 
          variant={plan.popular ? "default" : "outline"}
          onClick={() => onSubscribe(plan.name)}
        >
          Assinar {plan.name}
        </Button>
      </CardFooter>
    </Card>
  )
}