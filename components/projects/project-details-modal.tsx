"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Users, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { dbOperations } from "@/lib/supabase"

interface ProjectDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: {
    id: string
    title: string
    description?: string
    status?: string
    progress?: number
    deadline?: string
    members_count?: number
    tasks_total?: number
    created_at?: string
  }
}

interface TaskWithUser {
  id: string
  title: string
  status: string
  priority: string
  due_date: string
  assigned_to_user?: {
    id: string
    name: string
    email: string
    profile_image_url?: string
  }
}

export function ProjectDetailsModal({ open, onOpenChange, project }: ProjectDetailsModalProps) {
  const [tasks, setTasks] = useState<TaskWithUser[]>([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0,
    overdue: 0,
  })

  useEffect(() => {
    if (open && project.id) {
      loadProjectTasks()
    }
  }, [open, project.id])

  const loadProjectTasks = async () => {
    setLoading(true)
    try {
      const allTasks = await dbOperations.getTasks()
      const projectTasks = allTasks.filter((task) => task.project_id === project.id)

      setTasks(projectTasks)

      // Calculate statistics
      const now = new Date()
      const stats = {
        total: projectTasks.length,
        completed: projectTasks.filter((task) => task.status === "completed").length,
        inProgress: projectTasks.filter((task) => task.status === "in-progress").length,
        todo: projectTasks.filter((task) => task.status === "todo").length,
        overdue: projectTasks.filter((task) => {
          const dueDate = new Date(task.due_date)
          return dueDate < now && task.status !== "completed"
        }).length,
      }

      setStats(stats)
    } catch (error) {
      console.error("Error loading project tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "todo":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Concluído"
      case "in-progress":
        return "Em Progresso"
      case "todo":
        return "A Fazer"
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

  const isOverdue = (dueDate: string, status: string) => {
    const due = new Date(dueDate)
    const now = new Date()
    return due < now && status !== "completed"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR")
  }

  const progressPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{project.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Info */}
          <div className="space-y-4">
            {project.description && (
              <div>
                <h3 className="font-medium text-sm text-gray-700 mb-2">Descrição</h3>
                <p className="text-sm text-gray-600">{project.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-xs text-gray-600">Total de Tarefas</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <div className="text-xs text-gray-600">Concluídas</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                <div className="text-xs text-gray-600">Em Progresso</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
                <div className="text-xs text-gray-600">Atrasadas</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progresso do Projeto</span>
                <span className="font-medium">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {project.deadline && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Prazo: {formatDate(project.deadline)}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Membros: {project.members_count || 0}</span>
              </div>
              {project.status && (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-gray-400" />
                  <Badge variant="secondary">{project.status}</Badge>
                </div>
              )}
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Tarefas do Projeto</h3>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-gray-500">Carregando tarefas...</div>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">Nenhuma tarefa encontrada</p>
                <p className="text-xs">Adicione tarefas a este projeto</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-sm truncate">{task.title}</h4>
                        {isOverdue(task.due_date, task.status) && (
                          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <Badge className={getStatusColor(task.status)} variant="secondary">
                          {getStatusText(task.status)}
                        </Badge>
                        <span className={getPriorityColor(task.priority)}>{getPriorityText(task.priority)}</span>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(task.due_date)}</span>
                        </div>
                      </div>
                    </div>

                    {task.assigned_to_user && (
                      <div className="flex items-center space-x-2 ml-4">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={task.assigned_to_user.profile_image_url || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {task.assigned_to_user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-600 hidden sm:inline">{task.assigned_to_user.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
