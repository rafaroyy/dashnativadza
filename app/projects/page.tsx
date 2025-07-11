"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AddProjectModal } from "@/components/projects/add-project-modal"
import { ProjectDetailsModal } from "@/components/projects/project-details-modal"
import { EditProjectModal } from "@/components/projects/edit-project-modal"
import { Plus, Calendar, Users, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Project {
  id: string
  title: string
  description: string
  status: string
  progress: number
  deadline: string
  members_count: number
  tasks_total: number
  created_at: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

      if (error) throw error
      if (data) setProjects(data)
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleProjectAdded = async (newProject: any) => {
    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          title: newProject.name,
          description: newProject.description,
          status: "active",
          progress: 0,
          deadline: newProject.dueDate,
          members_count: newProject.teamSize,
          tasks_total: newProject.totalTasks,
        },
      ])
      .select()

    if (data && data[0]) {
      setProjects([data[0], ...projects])
    }
  }

  const handleProjectUpdate = async (updatedProject: any) => {
    const { data, error } = await supabase
      .from("projects")
      .update({
        title: updatedProject.name || updatedProject.title,
        description: updatedProject.description,
        status: updatedProject.status,
        progress: updatedProject.progress,
        deadline: updatedProject.dueDate || updatedProject.deadline,
        members_count: updatedProject.teamSize || updatedProject.members_count,
        tasks_total: updatedProject.totalTasks || updatedProject.tasks_total,
      })
      .eq("id", updatedProject.id)
      .select()

    if (data && data[0]) {
      setProjects(projects.map((p) => (p.id === updatedProject.id ? data[0] : p)))
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

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo"
      case "completed":
        return "Concluído"
      case "on-hold":
        return "Pausado"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ml-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 ml-64">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Projetos</h1>
          <p className="text-muted-foreground">Gerencie todos os seus projetos</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <Badge className={getStatusColor(project.status)}>{getStatusText(project.status)}</Badge>
              </div>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progresso</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} />
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {new Date(project.deadline).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{project.members_count}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">0/{project.tasks_total}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => setSelectedProject(project)}
                >
                  Ver Detalhes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => setEditingProject(project)}
                >
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Nenhum projeto encontrado</p>
          <Button onClick={() => setShowAddModal(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeiro Projeto
          </Button>
        </div>
      )}

      <AddProjectModal open={showAddModal} onOpenChange={setShowAddModal} onProjectAdded={handleProjectAdded} />

      {selectedProject && (
        <ProjectDetailsModal
          open={!!selectedProject}
          onOpenChange={() => setSelectedProject(null)}
          project={selectedProject}
          onProjectUpdate={handleProjectUpdate}
        />
      )}

      {editingProject && (
        <EditProjectModal
          open={!!editingProject}
          onOpenChange={() => setEditingProject(null)}
          project={editingProject}
          onProjectUpdate={handleProjectUpdate}
        />
      )}
    </div>
  )
}
