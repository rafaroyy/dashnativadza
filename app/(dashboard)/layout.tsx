import type React from "react"
import { Header } from "@/components/layout/header"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { getUserFromSession } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserFromSession()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen w-full bg-[hsl(var(--digitalz-bg-secondary))]">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col">
        <Header user={user} />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
