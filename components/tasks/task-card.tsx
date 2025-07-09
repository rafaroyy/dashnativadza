"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, Clock, MoreVertical, Edit, Trash2, CheckCircle, AlertCircle, User } from "lucide-react"
import type { Task, User as UserType, Project } from "@/lib/supabase"

interface TaskCardProps {
  task: Task
  user?: UserType
  project?: Project
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
  onStatusChange?: (taskId: string, status: string) => void
}

export function TaskCard({ task, user, project, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)

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
        return "text-red-600 bg-red-50 border-red-200"
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "normal":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "low":
        return "text-gray-600 bg-gray-50 border-gray-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
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

  const formatDate = (dateString: string) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const isOverdue = (dateString: string) => {
    if (!dateString || task.completed) return false
    return new Date(dateString) < new Date()
  }

  const handleStatusChange = async (newStatus: string) => {
    if (onStatusChange && !isUpdating) {
      setIsUpdating(true)
      try {
        await onStatusChange(task.id, newStatus)
      } finally {
        setIsUpdating(false)
      }
    }
  }

  const getNextStatus = () => {
    switch (task.status) {
      case "todo":
        return "in-progress"
      case "in-progress":
        return "completed"
      case "completed":
        return "todo"
      default:
        return "in-progress"
    }
  }

  const getNextStatusText = () => {
    const nextStatus = getNextStatus()
    return getStatusText(nextStatus)
  }

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${task.completed ? "opacity-75" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={getStatusColor(task.status)}>{getStatusText(task.status)}</Badge>
              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                {getPriorityText(task.priority)}
              </Badge>
            </div>
            <h3
              className={`font-semibold text-lg leading-tight ${task.completed ? "line-through text-muted-foreground" : ""}`}
            >
              {task.title}
            </h3>
            {task.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleStatusChange(getNextStatus())} disabled={isUpdating}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Marcar como {getNextStatusText()}
              </DropdownMenuItem>
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
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
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Project Info */}
          {project && (
            <div className="flex items-center text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary mr-2" />
              <span className="truncate">{project.title}</span>
            </div>
          )}

          {/* Assigned User */}
          {user && (
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <Avatar className="h-6 w-6">
                <AvatarImage src={user.profile_image_url || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="text-xs">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground truncate">{user.name}</span>
            </div>
          )}

          {/* Due Date */}
          {task.due_date && (
            <div
              className={`flex items-center space-x-2 text-sm ${
                isOverdue(task.due_date) ? "text-red-600" : "text-muted-foreground"
              }`}
            >
              {isOverdue(task.due_date) ? <AlertCircle className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
              <span>
                {isOverdue(task.due_date) ? "Atrasada: " : "Entrega: "}
                {formatDate(task.due_date)}
              </span>
            </div>
          )}

          {/* Created Date */}
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Criada em {formatDate(task.created_at)}</span>
          </div>

          {/* Quick Action Button */}
          <div className="pt-2">
            <Button
              variant={task.completed ? "outline" : "default"}
              size="sm"
              className="w-full"
              onClick={() => handleStatusChange(getNextStatus())}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              {isUpdating ? "Atualizando..." : `Marcar como ${getNextStatusText()}`}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
