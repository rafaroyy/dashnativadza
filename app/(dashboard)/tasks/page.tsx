"use client"
import { createServerClient } from "@/lib/supabase/server"
import { TasksClient } from "./tasks-client"

// Tipagens
interface Task {
  id: string
  title: string
  description: string | null
  status: "todo" | "in_progress" | "completed"
  priority: "low" | "medium" | "high"
  created_at: string
  space_id: string
}

interface Space {
  id: string
  name: string
}

interface TaskFormData {
  title: string
  description: string
  status: "todo" | "in_progress" | "completed"
  priority: "low" | "medium" | "high"
  space_id: string
}

export const dynamic = "force-dynamic"

export default async function TasksPage() {
  const supabase = createServerClient()

  // Busca os dados iniciais no servidor
  const [tasksRes, spacesRes] = await Promise.all([
    supabase.from("tasks").select("*").order("created_at", { ascending: false }),
    supabase.from("spaces").select("id, name"),
  ])

  // Passa os dados para o componente cliente, que cuidará da interatividade
  return <TasksClient initialTasks={tasksRes.data || []} initialSpaces={spacesRes.data || []} />
}
