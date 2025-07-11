import type React from "react"
import { getUserFromSession } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Sidebar from "@/components/layout/sidebar"

export const dynamic = "force-dynamic"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUserFromSession()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
