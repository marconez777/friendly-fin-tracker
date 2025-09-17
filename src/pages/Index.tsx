import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, Shield, Users } from "lucide-react"

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            FinanceSaaS
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Simplifique o controle das suas finanças pessoais e empresariais em uma única plataforma
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/auth/register">
                Começar Gratuitamente
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/auth/login">
                Fazer Login
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader className="text-center">
              <DollarSign className="h-8 w-8 mx-auto text-primary" />
              <CardTitle className="text-lg">Controle Total</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Gerencie receitas e despesas pessoais e empresariais de forma inteligente
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto text-primary" />
              <CardTitle className="text-lg">Relatórios</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Dashboards intuitivos com gráficos e métricas financeiras importantes
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Shield className="h-8 w-8 mx-auto text-primary" />
              <CardTitle className="text-lg">Segurança</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Seus dados financeiros protegidos com criptografia bancária
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="h-8 w-8 mx-auto text-primary" />
              <CardTitle className="text-lg">Colaboração</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Gerencie equipes e permissões para uso empresarial
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-muted/50 rounded-lg p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Pronto para organizar suas finanças?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Junte-se a milhares de usuários que já transformaram sua gestão financeira com nossa plataforma.
          </p>
          <Button asChild size="lg">
            <Link to="/auth/register">
              Criar Conta Gratuita
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
