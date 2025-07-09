"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, Clock, MoreHorizontal, Edit, Trash2, CheckCircle, AlertCircle } from "lucide-react"

interface TaskCardProps {
  task: {
    id: string
    title: string
    description: string
    status: string
    priority: string
    due_date: string
    completed: boolean
    assigned_to_user?: {
      id: string
      name: string
      email: string
      profile_image_url?: string
    }
    project?: {
      id: string
      title: string
    }
    space?: {
      id: string
      name: string
      space_color?: string
    }
  }
  onEdit?: (task: any) => void
  onDelete?: (taskId: string) => void
  onStatusChange?: (taskId: string, status: string) => void
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "todo":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
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
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "normal":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
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

  const isOverdue = () => {
    const dueDate = new Date(task.due_date)
    const now = new Date()
    return dueDate < now && task.status !== "completed"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return "Hoje"
    } else if (diffDays === 1) {
      return "Amanhã"
    } else if (diffDays === -1) {
      return "Ontem"
    } else if (diffDays > 1) {
      return `Em ${diffDays} dias`
    } else {
      return `${Math.abs(diffDays)} dias atrás`
    }
  }

  const handleStatusChange = (newStatus: string) => {
    if (onStatusChange) {
      onStatusChange(task.id, newStatus)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate mb-1">{task.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
            )}
            {onStatusChange && task.status !== "completed" && (
              <DropdownMenuItem onClick={() => handleStatusChange("completed")}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Marcar como Concluído
              </DropdownMenuItem>
            )}
            {onStatusChange && task.status === "completed" && (
              <DropdownMenuItem onClick={() => handleStatusChange("todo")}>
                <Clock className="h-4 w-4 mr-2" />
                Reabrir Tarefa
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-red-600 focus:text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Status and Priority */}
      <div className="flex items-center space-x-2 mb-3">
        <Badge className={getStatusColor(task.status)} variant="outline">
          {getStatusText(task.status)}
        </Badge>
        <Badge className={getPriorityColor(task.priority)} variant="outline">
          {getPriorityText(task.priority)}
        </Badge>
      </div>

      {/* Project and Space */}
      <div className="space-y-1 mb-3 text-xs text-gray-500">
        {task.project && (
          <div className="flex items-center space-x-1">
            <span>📁</span>
            <span>{task.project.title}</span>
          </div>
        )}
        {task.space && (
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: task.space.space_color || "#3B82F6" }} />
            <span>{task.space.name}</span>
          </div>
        )}
      </div>

      {/* Due Date */}
      <div className="flex items-center justify-between">
        <div className={`flex items-center space-x-1 text-xs ${isOverdue() ? "text-red-600" : "text-gray-500"}`}>
          {isOverdue() ? <AlertCircle className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
          <span>{formatDate(task.due_date)}</span>
        </div>

        {/* Assigned User */}
        {task.assigned_to_user && (
          <div className="flex items-center space-x-2">
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
    </div>
  )
}
