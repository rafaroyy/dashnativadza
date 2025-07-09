"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Calendar, Clock, AlertCircle, CheckCircle, Edit, Trash2 } from "lucide-react"
import type { Task } from "@/lib/supabase"

interface TaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
  onStatusChange?: (taskId: string, status: string) => void
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-blue-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      todo: { label: "A Fazer", variant: "secondary" as const },
      in_progress: { label: "Em Progresso", variant: "default" as const },
      done: { label: "Concluído", variant: "default" as const },
    }
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.todo
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { label: "Baixa", variant: "secondary" as const, color: "text-green-600" },
      medium: { label: "Média", variant: "default" as const, color: "text-yellow-600" },
      high: { label: "Alta", variant: "destructive" as const, color: "text-red-600" },
    }
    return priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return `Atrasado ${Math.abs(diffDays)} dia(s)`
    } else if (diffDays === 0) {
      return "Hoje"
    } else if (diffDays === 1) {
      return "Amanhã"
    } else {
      return `Em ${diffDays} dias`
    }
  }

  const isOverdue = task.due_date && new Date(task.due_date) < new Date()

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon(task.status)}
            <h3 className="font-semibold text-sm">{task.title}</h3>
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit?.(task)} className="h-8 w-8 p-0">
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete?.(task.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        {task.description && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{task.description}</p>}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Project Info */}
          {task.project && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: task.project.color }} />
              <span className="text-xs text-muted-foreground">{task.project.name}</span>
            </div>
          )}

          {/* Status and Priority */}
          <div className="flex items-center space-x-2">
            <Badge {...getStatusBadge(task.status)} className="text-xs">
              {getStatusBadge(task.status).label}
            </Badge>
            <Badge {...getPriorityBadge(task.priority)} className="text-xs">
              {getPriorityBadge(task.priority).label}
            </Badge>
          </div>

          {/* Due Date */}
          {task.due_date && (
            <div
              className={`flex items-center space-x-1 text-xs ${isOverdue ? "text-red-600" : "text-muted-foreground"}`}
            >
              <Calendar className="h-3 w-3" />
              <span>{formatDate(task.due_date)}</span>
            </div>
          )}

          {/* Assignee */}
          {task.assignee && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={task.assignee.profile_image_url || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">
                    {task.assignee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">{task.assignee.name}</span>
              </div>
            </div>
          )}

          {/* Quick Status Actions */}
          <div className="flex items-center space-x-1 pt-2 border-t">
            {task.status !== "todo" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onStatusChange?.(task.id, "todo")}
                className="h-6 px-2 text-xs"
              >
                A Fazer
              </Button>
            )}
            {task.status !== "in_progress" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onStatusChange?.(task.id, "in_progress")}
                className="h-6 px-2 text-xs"
              >
                Em Progresso
              </Button>
            )}
            {task.status !== "done" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onStatusChange?.(task.id, "done")}
                className="h-6 px-2 text-xs"
              >
                Concluído
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
