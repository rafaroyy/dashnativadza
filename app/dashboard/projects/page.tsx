export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import { dbOperations } from "@/lib/supabase"
import ProjectsClient from "./projects-client"

export default async function ProjectsPage() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return <div>Usuário não autenticado</div>
    }

    // Buscar projetos e tarefas
    const [projects, tasks, users] = await Promise.all([
      dbOperations.getProjects(),
      dbOperations.getTasks(),
      dbOperations.getUsers(),
    ])

    return <ProjectsClient projects={projects} tasks={tasks} users={users} />
  } catch (error) {
    console.error("Erro ao carregar projetos:", error)
    return <ProjectsClient projects={[]} tasks={[]} users={[]} />
  }
}
