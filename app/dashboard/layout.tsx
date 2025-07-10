import type React from "react"
import Header from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { getUser } from "@/lib/supabase/server"
import { dbOperations } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const authUser = await getUser()
  const user = authUser ? await dbOperations.getUserById(authUser.id) : null

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  )
}
