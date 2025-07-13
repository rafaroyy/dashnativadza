"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Home, CheckSquare, FolderOpen, Users, Calendar, Settings, BarChart3 } from "lucide-react"
import { DigitalzLogo } from "@/components/ui/digitalz-logo"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Tarefas", href: "/dashboard/tasks", icon: CheckSquare },
  { name: "Projetos", href: "/dashboard/projects", icon: FolderOpen },
  { name: "Equipe", href: "/dashboard/teams", icon: Users },
  { name: "Calendário", href: "/dashboard/calendar", icon: Calendar },
  { name: "Relatórios", href: "/dashboard/reports", icon: BarChart3 },
  { name: "Configurações", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar() {
  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <DigitalzLogo className="h-8 w-8" />
          <span className="text-lg font-semibold">ClickUp Clone</span>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => (
            <SidebarLink key={item.name} href={item.href} icon={item.icon}>
              {item.name}
            </SidebarLink>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}

function SidebarLink({
  href,
  icon: Icon,
  children,
}: {
  href: string
  icon: any
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link href={href}>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn("w-full justify-start", isActive && "bg-secondary")}
      >
        <Icon className="mr-2 h-4 w-4" />
        {children}
      </Button>
    </Link>
  )
}
