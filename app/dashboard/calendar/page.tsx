export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import CalendarClient from "./calendar-client"

/**
 * Server Component.
 * Busca todos os eventos/tarefas com due_date definido e passa para o Client Component.
 */
export default async function CalendarPage() {
  const supabase = await createClient()

  const { data: tasks } = await supabase.from("tasks").select("*").order("due_date", { ascending: true })

  return <CalendarClient tasks={tasks ?? []} />
}
