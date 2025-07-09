"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Users, CheckCircle, Clock, AlertCircle, BarChart3, Edit, Trash2 } from "lucide-react"
import { dbOperations, type Project, type Task, type User } from "@/lib/supabase"

interface ProjectDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project
  onEdit?: (project: Project) => void
  onDelete?: (projectId: string) => void
}

export function ProjectDetailsModal({ open, onOpenChange, project, onEdit, onDelete }: ProjectDetailsModalProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && project) {
      loadProjectData()
    }
  }, [open, project])

  const loadProjectData = async () => {
    setLoading(true)
    setError(null)

    try {
      const [allTasks, allUsers] = await Promise.all([dbOperations.getTasks(), dbOperations.getUsers()])

      // Filter tasks for this project
      const projectTasks = allTasks.filter((task) => task.project_id === project.id)
      setTasks(projectTasks)
      setUsers(allUsers)
    } catch (error: any) {
      console.error("Error loading project data:", error)
      setError("Erro ao carregar dados do projeto")
    } finally {
      setLoading(false)
    }
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
        return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600"
      case "high":
        return "text-orange-600"
      case "normal":
        return "text-blue-600"
      case "low":
        return "text-gray-600"
      default:
        return "text-gray-600"
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "Urgente"
      case "high":
        return "Alta"
      case "normal":
        return "Normal"
      case "low":
        return "Baixa"
      default:
        return priority
    }
  }

  const getTaskStatusText = (status: string) => {
    switch (status) {
      case "todo":
        return "A Fazer"
      case "in-progress":
        return "Em Progresso"
      case "completed":
        return "Concluído"
      default:
        return status
    }
  }

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    return user?.name || "Usuário não encontrado"
  }

  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const formatDate = (dateString: string) => {
    if (!dateString) return "Não definida"
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const isOverdue = (dateString: string) => {
    if (!dateString) return false
    return new Date(dateString) < new Date()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{project.title}</DialogTitle>
            <div className="flex items-center space-x-2">
              {onEdit && (
                <Button variant="outline" size="sm" onClick={() => onEdit(project)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(project.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
        ) : (
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-6">
              {/* Project Info */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(project.status)}>{getStatusText(project.status)}</Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(project.deadline)}
                    {isOverdue(project.deadline) && <AlertCircle className="h-4 w-4 ml-2 text-red-500" />}
                  </div>
                </div>

                {project.description && <p className="text-muted-foreground">{project.description}</p>}

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progresso</span>
                    <span className="text-sm text-muted-foreground">{completionRate}%</span>
                  </div>
                  <Progress value={completionRate} className="h-2" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold">{completedTasks}</div>
                    <div className="text-xs text-muted-foreground">Concluídas</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold">{totalTasks - completedTasks}</div>
                    <div className="text-xs text-muted-foreground">Pendentes</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold">{project.members_count}</div>
                    <div className="text-xs text-muted-foreground">Membros</div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Tasks */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Tarefas ({totalTasks})</h3>
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                </div>

                {tasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma tarefa encontrada</p>
                    <p className="text-sm">As tarefas aparecerão aqui quando forem criadas</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-2 h-2 rounded-full ${task.completed ? "bg-green-500" : "bg-gray-300"}`}
                            />
                            <h4 className="font-medium truncate">{task.title}</h4>
                            <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                              {getPriorityText(task.priority)}
                            </Badge>
                          </div>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1 truncate">{task.description}</p>
                          )}
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <span>{getTaskStatusText(task.status)}</span>
                            {task.assigned_to && <span>Responsável: {getUserName(task.assigned_to)}</span>}
                            {task.due_date && (
                              <span className={isOverdue(task.due_date) ? "text-red-600" : ""}>
                                Entrega: {formatDate(task.due_date)}
                              </span>
                            )}
                          </div>
                        </div>
                        {task.assigned_to && (
                          <Avatar className="h-8 w-8 ml-3">
                            <AvatarImage
                              src={
                                users.find((u) => u.id === task.assigned_to)?.profile_image_url || "/placeholder.svg"
                              }
                              alt={getUserName(task.assigned_to)}
                            />
                            <AvatarFallback className="text-xs">
                              {getUserName(task.assigned_to)
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}
