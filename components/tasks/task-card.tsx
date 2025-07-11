"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Edit, Trash2 } from "lucide-react"
import type { Task } from "@/lib/supabase"
import { getInitials } from "@/lib/utils"

interface TaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
  onStatusChange?: (taskId: string, status: string) => void
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      todo: { label: "A Fazer", variant: "outline" as const },
      in_progress: { label: "Em Progresso", variant: "secondary" as const },
      done: { label: "Concluído", variant: "default" as const },
    }
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.todo
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { label: "Baixa", variant: "secondary" as const },
      medium: { label: "Média", variant: "default" as const },
      high: { label: "Alta", variant: "destructive" as const },
    }
    return priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Sem prazo"
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <Card className="bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
      <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold">{task.title}</h3>
          {task.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{task.description}</p>}
          <div className="flex items-center gap-2 mt-3">
            <Badge {...getStatusBadge(task.status)}>{getStatusBadge(task.status).label}</Badge>
            <Badge {...getPriorityBadge(task.priority)}>{getPriorityBadge(task.priority).label}</Badge>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          {task.users && (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={task.users.avatar_url || ""} />
                <AvatarFallback>{getInitials(task.users.name || "")}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{task.users.name}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Prazo: {formatDate(task.due_date)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit?.(task)} className="h-8 w-8">
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete?.(task.id)}
              className="h-8 w-8 text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
