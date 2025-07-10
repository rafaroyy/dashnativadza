export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import { dbOperations } from "@/lib/supabase"
import CalendarClient from "./calendar-client"

export default async function CalendarPage() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return <div>Usuário não autenticado</div>
    }

    // Buscar tarefas com datas de vencimento
    const tasks = await dbOperations.getTasks()
    const tasksWithDates = tasks.filter((task) => task.due_date)

    return <CalendarClient tasks={tasksWithDates} />
  } catch (error) {
    console.error("Erro ao carregar calendário:", error)
    return <CalendarClient tasks={[]} />
  }
}
