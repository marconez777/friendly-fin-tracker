import { useState } from "react"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, UserPlus, UserMinus, Shield, User, RotateCcw } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

interface MockUser {
  id: string
  name: string
  email: string
  role: 'User' | 'Admin'
  subscriptionStatus: 'Ativo' | 'Expirado' | 'Cancelado' | 'Nunca Assinou'
  isActive: boolean
}

const mockUsers: MockUser[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@exemplo.com",
    role: "User",
    subscriptionStatus: "Ativo",
    isActive: true
  },
  {
    id: "2", 
    name: "Maria Santos",
    email: "maria@exemplo.com",
    role: "Admin",
    subscriptionStatus: "Ativo",
    isActive: true
  },
  {
    id: "3",
    name: "Pedro Costa",
    email: "pedro@exemplo.com", 
    role: "User",
    subscriptionStatus: "Expirado",
    isActive: false
  },
  {
    id: "4",
    name: "Ana Oliveira",
    email: "ana@exemplo.com",
    role: "User", 
    subscriptionStatus: "Cancelado",
    isActive: true
  },
  {
    id: "5",
    name: "Carlos Pereira",
    email: "carlos@exemplo.com",
    role: "User",
    subscriptionStatus: "Nunca Assinou",
    isActive: true
  }
]

export default function AdminUsers() {
  const [users, setUsers] = useState<MockUser[]>(mockUsers)
  const [roleFilter, setRoleFilter] = useState("all")
  const [subscriptionFilter, setSubscriptionFilter] = useState("all")
  const { toast } = useToast()

  const filteredUsers = users.filter(user => {
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesSubscription = subscriptionFilter === "all" || user.subscriptionStatus === subscriptionFilter
    return matchesRole && matchesSubscription
  })

  const handleToggleActive = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ))
    toast({
      title: "Status alterado",
      description: "Status do usuário atualizado. (Simulação)"
    })
  }

  const handleToggleRole = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: user.role === 'Admin' ? 'User' : 'Admin' } : user
    ))
    toast({
      title: "Role alterado",
      description: "Role do usuário atualizado. (Simulação)"
    })
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId))
    toast({
      title: "Usuário excluído",
      description: "Usuário removido do sistema. (Simulação)"
    })
  }

  const handleResetPassword = (userEmail: string) => {
    toast({
      title: "Senha resetada",
      description: `Email de reset enviado para ${userEmail}. (Simulação)`
    })
  }

  const getSubscriptionBadge = (status: string) => {
    switch (status) {
      case 'Ativo':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>
      case 'Expirado':
        return <Badge variant="destructive">Expirado</Badge>
      case 'Cancelado':
        return <Badge variant="secondary">Cancelado</Badge>
      default:
        return <Badge variant="outline">Nunca Assinou</Badge>
    }
  }

  return (
    <AdminLayout title="Gestão de Usuários">
      <div className="space-y-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Roles</SelectItem>
              <SelectItem value="User">User</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
            </SelectContent>
          </Select>

          <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por assinatura" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="Ativo">Ativo</SelectItem>
              <SelectItem value="Expirado">Expirado</SelectItem>
              <SelectItem value="Cancelado">Cancelado</SelectItem>
              <SelectItem value="Nunca Assinou">Nunca Assinou</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Users Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status da Assinatura</TableHead>
                <TableHead>Status do Usuário</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getSubscriptionBadge(user.subscriptionStatus)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? 'default' : 'destructive'}>
                      {user.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleToggleActive(user.id)}>
                          {user.isActive ? (
                            <>
                              <UserMinus className="mr-2 h-4 w-4" />
                              Desativar
                            </>
                          ) : (
                            <>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Ativar
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleRole(user.id)}>
                          {user.role === 'Admin' ? (
                            <>
                              <User className="mr-2 h-4 w-4" />
                              Tornar User
                            </>
                          ) : (
                            <>
                              <Shield className="mr-2 h-4 w-4" />
                              Tornar Admin
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleResetPassword(user.email)}>
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Resetar Senha
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600"
                        >
                          Excluir Usuário
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="text-sm text-muted-foreground">
          Total de usuários: {filteredUsers.length}
        </div>
      </div>
    </AdminLayout>
  )
}