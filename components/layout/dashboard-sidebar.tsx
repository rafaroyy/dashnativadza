"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, CheckSquare, FolderOpen, Users, Settings } from "lucide-react"
import { DigitalzLogo } from "@/components/ui/digitalz-logo"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Tarefas", href: "/tasks", icon: CheckSquare },
  { name: "Projetos", href: "/projects", icon: FolderOpen },
  { name: "Equipe", href: "/teams", icon: Users },
]

const settingsNavigation = [{ name: "Configurações", href: "/settings", icon: Settings }]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 flex-col border-r bg-[hsl(var(--digitalz-sidebar-bg))] text-white md:flex">
      <div className="flex h-16 items-center px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <DigitalzLogo className="h-6 w-6" />
          <span>DigitalZ</span>
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-4 px-4 py-4">
        <div className="flex-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-gray-700 hover:text-white",
                pathname.startsWith(item.href) ? "bg-gray-800 text-white" : "",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </div>
        <div>
          {settingsNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-gray-700 hover:text-white",
                pathname.startsWith(item.href) ? "bg-gray-800 text-white" : "",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  )
}
