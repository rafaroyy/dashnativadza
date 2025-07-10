export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import ProjectsClient from "./projects-client"

/**
 * Server Component.
 * Busca todos os projetos para exibir no dashboard de projetos.
 */
export default async function ProjectsPage() {
  const supabase = await createClient()

  const { data: projects } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

  return <ProjectsClient projects={projects ?? []} />
}
