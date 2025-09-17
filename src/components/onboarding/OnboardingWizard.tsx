import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react"
import { UserProfileStep } from "./UserProfileStep"
import { CategoriesStep } from "./CategoriesStep"
import { FixedItemsStep } from "./FixedItemsStep"
import { useToast } from "@/hooks/use-toast"

export interface OnboardingData {
  userProfile: {
    name: string
    email: string
    context: "Pessoal" | "Empresa" | ""
  }
  categories: Array<{
    id: string
    name: string
    type: "Receita" | "Despesa"
  }>
  fixedItems: Array<{
    id: string
    description: string
    type: "Receita" | "Despesa"
    context: "Pessoal" | "Empresa"
    category: string
    value: number
    dueDay: number
    isActive: boolean
  }>
}

export function OnboardingWizard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    userProfile: {
      name: "",
      email: "usuario@exemplo.com",
      context: "",
    },
    categories: [
      { id: "1", name: "Alimentação", type: "Despesa" },
      { id: "2", name: "Transporte", type: "Despesa" },
      { id: "3", name: "Marketing", type: "Despesa" },
      { id: "4", name: "Serviços", type: "Despesa" },
      { id: "5", name: "Vendas", type: "Receita" },
    ],
    fixedItems: [
      {
        id: "1",
        description: "Aluguel",
        type: "Despesa",
        context: "Pessoal",
        category: "Habitação",
        value: 2000,
        dueDay: 5,
        isActive: true,
      },
      {
        id: "2",
        description: "Internet",
        type: "Despesa",
        context: "Empresa",
        category: "Telecomunicações",
        value: 200,
        dueDay: 15,
        isActive: true,
      },
    ],
  })

  const steps = [
    {
      title: "Perfil do Usuário",
      description: "Configure suas informações básicas",
    },
    {
      title: "Categorias Iniciais",
      description: "Defina as categorias para organizar suas transações",
    },
    {
      title: "Despesas/Receitas Fixas",
      description: "Configure seus lançamentos recorrentes",
    },
  ]

  const updateOnboardingData = (section: keyof OnboardingData, data: any) => {
    setOnboardingData(prev => ({
      ...prev,
      [section]: data,
    }))
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case 0:
        return onboardingData.userProfile.name.trim() !== ""
      case 1:
        return onboardingData.categories.length >= 2
      case 2:
        return onboardingData.fixedItems.length >= 1
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    toast({
      title: "Onboarding concluído",
      description: "Onboarding concluído (simulação)",
    })
    navigate("/dashboard-pessoal")
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <UserProfileStep
            data={onboardingData.userProfile}
            onChange={(data) => updateOnboardingData("userProfile", data)}
          />
        )
      case 1:
        return (
          <CategoriesStep
            data={onboardingData.categories}
            onChange={(data) => updateOnboardingData("categories", data)}
          />
        )
      case 2:
        return (
          <FixedItemsStep
            data={onboardingData.fixedItems}
            categories={onboardingData.categories}
            onChange={(data) => updateOnboardingData("fixedItems", data)}
          />
        )
      default:
        return null
    }
  }

  const progressPercentage = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Bem-vindo ao Sistema Financeiro</CardTitle>
          <CardDescription>
            Vamos configurar sua conta em alguns passos simples
          </CardDescription>
          
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Passo {currentStep + 1} de {steps.length}</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
          </div>
          
          <div className="mt-4">
            <h3 className="text-lg font-semibold">{steps[currentStep].title}</h3>
            <p className="text-muted-foreground">{steps[currentStep].description}</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="min-h-[400px]">
            {renderStepContent()}
          </div>

          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>

            {currentStep === steps.length - 1 ? (
              <Button
                onClick={handleComplete}
                disabled={!canProceedToNext()}
                className="bg-primary hover:bg-primary/90"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Concluir
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceedToNext()}
              >
                Próximo
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}