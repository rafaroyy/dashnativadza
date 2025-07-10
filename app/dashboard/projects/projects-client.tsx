"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FolderOpen } from "lucide-react"

interface Project {
  id: string
  title: string
  description: string | null
  progress: number | null
  members_count: number | null
  deadline: string | null
}

export default function ProjectsClient({ projects }: { projects: Project[] }) {
  return (
    <div className="p-6 ml-64 space-y-6">
      <Card className="digitalz-card">
        <CardHeader>
          <CardTitle className="flex items-center text-white gap-2">
            <FolderOpen className="w-6 h-6 text-digitalz-cyan" />
            Projetos
          </CardTitle>
          <CardDescription className="text-gray-400">Gerencie e acompanhe todos os seus projetos</CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <p className="text-muted-foreground">Nenhum projeto encontrado.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {project.title}
                      <Badge variant="outline">{project.progress ?? 0}%</Badge>
                    </CardTitle>
                    {project.description && <CardDescription>{project.description}</CardDescription>}
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Progress value={project.progress ?? 0} />
                    {project.deadline && (
                      <p className="text-sm text-muted-foreground">
                        Prazo: {new Date(project.deadline).toLocaleDateString("pt-BR")}
                      </p>
                    )}
                    {project.members_count !== null && (
                      <p className="text-sm text-muted-foreground">{project.members_count} membro(s)</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
