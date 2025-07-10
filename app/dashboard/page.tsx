"use client"

import { createClient } from "@/lib/supabase/server"
import DashboardClient from "./dashboard-client"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()

  // Buscar dados do servidor
  const { data: tasks } = await supabase.from("tasks").select("*")
  const { data: projects } = await supabase.from("projects").select("*")
  const { data: users } = await supabase.from("users").select("*")

  return <DashboardClient user={user.user} tasks={tasks || []} projects={projects || []} users={users || []} />
}
