import ProjectsClient from "./projects-client"

export const dynamic = "force-dynamic"

interface Project {
  id: string
  name: string
  description: string
  status: "active" | "completed" | "on-hold"
  progress: number
  dueDate: string
  teamMembers: number
  createdAt: string
}

export default function ProjectsPage() {
  return <ProjectsClient />
}
