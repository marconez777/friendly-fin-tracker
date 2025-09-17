import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface UserProfileData {
  name: string
  email: string
  context: "Pessoal" | "Empresa" | ""
}

interface UserProfileStepProps {
  data: UserProfileData
  onChange: (data: UserProfileData) => void
}

export function UserProfileStep({ data, onChange }: UserProfileStepProps) {
  const updateField = (field: keyof UserProfileData, value: string) => {
    onChange({
      ...data,
      [field]: value,
    })
  }

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-lg font-medium mb-2">Vamos começar com suas informações básicas</h3>
        <p className="text-muted-foreground">
          Essas informações nos ajudarão a personalizar sua experiência
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Nome Completo *</Label>
          <Input
            id="name"
            type="text"
            value={data.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Digite seu nome completo"
            required
          />
          {!data.name.trim() && (
            <p className="text-sm text-muted-foreground">
              O nome é obrigatório para continuar
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="seu@email.com"
            disabled
          />
          <p className="text-sm text-muted-foreground">
            Email já configurado na conta
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="context">Contexto Principal</Label>
          <Select 
            value={data.context} 
            onValueChange={(value: "Pessoal" | "Empresa") => updateField("context", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o contexto principal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pessoal">Pessoal</SelectItem>
              <SelectItem value="Empresa">Empresa</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Você pode usar ambos os contextos, mas escolha o principal
          </p>
        </div>
      </div>
    </div>
  )
}