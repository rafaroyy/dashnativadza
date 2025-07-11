"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Calendar, Users, CheckCircle, Clock } from "lucide-react"
import type { Project, Task, User } from "@/lib/supabase"

interface ProjectsClientProps {
  projects: Project[]
  tasks: Task[]
  users: User[]
}

export default function ProjectsClient({ projects, tasks, users }: ProjectsClientProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  // Calcular estatísticas dos projetos
  const getProjectStats = (projectId: string) => {
    const projectTasks = tasks.filter((task) => task.project_id === projectId)
    const completedTasks = projectTasks.filter((task) => task.completed)
    const totalTasks = projectTasks.length
    const progress = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0

    return {
      totalTasks,
      completedTasks: completedTasks.length,
      progress,
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "completed":
        return "bg-blue-500"
      case "on-hold":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo"
      case "completed":
        return "Concluído"
      case "on-hold":
        return "Em Pausa"
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
          <p className="text-muted-foreground">Gerencie seus projetos e acompanhe o progresso</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      {/* Estatísticas gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.filter((p) => p.status === "active").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Concluídos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.filter((p) => p.status === "completed").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de projetos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const stats = getProjectStats(project.id)
          const projectTasks = tasks.filter((task) => task.project_id === project.id)

          return (
            <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(project.status)}`} />
                  <Badge variant="outline">{getStatusLabel(project.status)}</Badge>
                </div>
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Progresso */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Progresso</span>
                      <span>{stats.progress}%</span>
                    </div>
                    <Progress value={stats.progress} className="h-2" />
                  </div>

                  {/* Estatísticas */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Tarefas</div>
                      <div className="font-medium">
                        {stats.completedTasks}/{stats.totalTasks}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Prazo</div>
                      <div className="font-medium">
                        {project.deadline ? new Date(project.deadline).toLocaleDateString("pt-BR") : "Sem prazo"}
                      </div>
                    </div>
                  </div>

                  {/* Membros da equipe */}
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Equipe</div>
                    <div className="flex -space-x-2">
                      {projectTasks
                        .filter((task) => task.assignee)
                        .slice(0, 3)
                        .map((task, index) => (
                          <Avatar key={index} className="w-6 h-6 border-2 border-background">
                            <AvatarImage src={task.assignee?.profile_image_url || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">
                              {task.assignee?.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      {projectTasks.filter((task) => task.assignee).length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                          +{projectTasks.filter((task) => task.assignee).length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {projects.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum projeto encontrado</h3>
            <p className="text-muted-foreground text-center mb-4">
              Comece criando seu primeiro projeto para organizar suas tarefas.
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Projeto
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
