"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"

interface HeaderProps {
  user: {
    name: string | null
    avatar_url: string | null
  } | null
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white dark:bg-gray-950 px-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          Bem-vindo, {user?.name?.split(" ")[0] || "Usuário"}!
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Aqui está um resumo das suas atividades hoje.</p>
      </div>
      <Avatar>
        <AvatarImage src={user?.avatar_url || ""} />
        <AvatarFallback>{getInitials(user?.name || "U")}</AvatarFallback>
      </Avatar>
    </header>
  )
}
