"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FolderOpen, Plus, Calendar, Users, Clock, MoreHorizontal } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

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

export default function ProjectsClient() {
  const [mounted, setMounted] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchProjects = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching projects:", error)
          // Usar dados mock se houver erro
          setProjects([
            {
              id: "1",
              name: "Sistema de Gestão",
              description: "Desenvolvimento de sistema completo de gestão empresarial",
              status: "active",
              progress: 75,
              dueDate: "2024-03-15",
              teamMembers: 5,
              createdAt: "2024-01-10",
            },
            {
              id: "2",
              name: "App Mobile",
              description: "Aplicativo mobile para iOS e Android",
              status: "active",
              progress: 45,
              dueDate: "2024-04-20",
              teamMembers: 3,
              createdAt: "2024-02-01",
            },
            {
              id: "3",
              name: "Website Corporativo",
              description: "Novo website institucional da empresa",
              status: "completed",
              progress: 100,
              dueDate: "2024-02-28",
              teamMembers: 4,
              createdAt: "2024-01-05",
            },
          ])
        } else {
          const formattedProjects =
            data?.map((project: any) => ({
              id: project.id,
              name: project.name || project.title,
              description: project.description || "Sem descrição",
              status: project.status || "active",
              progress: project.progress || 0,
              dueDate: project.deadline || project.created_at,
              teamMembers: project.members_count || 0,
              createdAt: project.created_at,
            })) || []
          setProjects(formattedProjects)
        }
      } catch (error) {
        console.error("Error:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os projetos.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [mounted, toast])

  if (!mounted) {
    return <div>Carregando...</div>
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Projetos</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "on-hold":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo"
      case "completed":
        return "Concluído"
      case "on-hold":
        return "Pausado"
      default:
        return "Desconhecido"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projetos</h1>
          <p className="text-muted-foreground">Gerencie todos os seus projetos em um só lugar</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">+1 desde o mês passado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.filter((p) => p.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <FolderOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.filter((p) => p.status === "completed").length}</div>
            <p className="text-xs text-muted-foreground">Finalizados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso Médio</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.length > 0 ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length) : 0}
              %
            </div>
            <Progress
              value={projects.length > 0 ? projects.reduce((acc, p) => acc + p.progress, 0) / projects.length : 0}
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription className="mt-1">{project.description}</CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(project.status)}>{getStatusText(project.status)}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Progresso</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} />
                </div>

                {/* Project Info */}
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Prazo: {new Date(project.dueDate).toLocaleDateString("pt-BR")}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>{project.teamMembers} membros</span>
                  </div>
                </div>

                {/* Team Avatars */}
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[...Array(Math.min(project.teamMembers, 3))].map((_, i) => (
                      <Avatar key={i} className="h-8 w-8 border-2 border-background">
                        <AvatarFallback className="text-xs">{String.fromCharCode(65 + i)}</AvatarFallback>
                      </Avatar>
                    ))}
                    {project.teamMembers > 3 && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted border-2 border-background text-xs font-medium">
                        +{project.teamMembers - 3}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Ver Detalhes
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {projects.length === 0 && !loading && (
        <Card className="text-center py-12">
          <CardContent>
            <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum projeto encontrado</h3>
            <p className="text-muted-foreground mb-4">Comece criando seu primeiro projeto.</p>
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
