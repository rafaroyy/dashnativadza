export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import DashboardClient from "./dashboard-client"

export default async function DashboardPage() {
  const supabase = await createClient()

  const [{ data: tasks }, { data: projects }, { data: users }, { data: user }] = await Promise.all([
    supabase.from("tasks").select("*"),
    supabase.from("projects").select("*"),
    supabase.from("users").select("*"),
    supabase.auth.getUser(),
  ])

  return <DashboardClient user={user?.user ?? null} tasks={tasks ?? []} projects={projects ?? []} users={users ?? []} />
}
