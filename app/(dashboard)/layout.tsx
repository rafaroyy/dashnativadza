import type React from "react"
import { Header } from "@/components/layout/header"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen w-full bg-digitalz-light-secondary dark:bg-digitalz-dark-secondary">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
