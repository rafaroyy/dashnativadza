import type React from "react"
import { redirect } from "next/navigation"
import { getUser } from "@/lib/supabase/server"

interface AuthGuardProps {
  children: React.ReactNode
}

export default async function AuthGuard({ children }: AuthGuardProps) {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  return <>{children}</>
}
