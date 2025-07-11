import type React from "react"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/dashboard-sidebar"
import { Toaster } from "@/components/ui/toaster"
import { Header } from "@/components/layout/header"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: userData } = await supabase.from("users").select("name, avatar_url").eq("id", user.id).single()

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header user={userData} />
        <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">{children}</main>
      </div>
      <Toaster />
    </div>
  )
}
