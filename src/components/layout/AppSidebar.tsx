import { Home, Building2, Receipt, Calendar, Bell, Shield, RefreshCw, CreditCard, User } from "lucide-react"
import { NavLink } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const items = [
  { title: "Dashboard Pessoal", url: "/dashboard-pessoal", icon: Home },
  { title: "Dashboard Empresa", url: "/dashboard-empresa", icon: Building2 },
  { title: "Transações", url: "/transacoes", icon: Receipt },
  { title: "Staging", url: "/staging", icon: RefreshCw },
  { title: "Fixas", url: "/fixas", icon: Calendar },
  { title: "Alertas", url: "/alertas", icon: Bell },
  { title: "Invoices", url: "/invoices", icon: CreditCard },
  { title: "Pricing", url: "/pricing", icon: CreditCard },
  { title: "Account", url: "/account", icon: User },
  { title: "Admin", url: "/admin", icon: Shield },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground font-semibold">
            FinanceSaaS
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) =>
                        isActive 
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}