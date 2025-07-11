import { createServerClient } from "@/lib/supabase/server"
import { TasksClient } from "./tasks-client"

export const dynamic = "force-dynamic"

export default async function TasksPage() {
  const supabase = createServerClient()

  const [tasksRes, spacesRes] = await Promise.all([
    supabase.from("tasks").select("*, spaces (name)").order("created_at", { ascending: false }),
    supabase.from("spaces").select("id, name"),
  ])

  if (tasksRes.error) {
    console.error("Erro ao buscar tarefas:", tasksRes.error)
  }
  if (spacesRes.error) {
    console.error("Erro ao buscar espaços:", spacesRes.error)
  }

  return <TasksClient initialTasks={tasksRes.data || []} initialSpaces={spacesRes.data || []} />
}
