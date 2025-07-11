"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EditTaskModal } from "./edit-task-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, User, MoreVertical, Edit, Trash2, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import type { Task } from "@/lib/supabase"

interface TaskCardProps {
  task: Task
  onUpdate: (task: Task) => void
  onDelete: (taskId: string) => void
}

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [showEditModal, setShowEditModal] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-blue-500"
      case "todo":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "todo":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "normal":
        return "bg-blue-500"
      case "low":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
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
        return priority || "Normal"
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Sem prazo"
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const isOverdue = (dateString: string) => {
    if (!dateString || task.completed) return false
    return new Date(dateString) < new Date()
  }

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
      onDelete(task.id)
    }
  }

  const handleStatusToggle = () => {
    const newStatus = task.status === "completed" ? "todo" : "completed"
    const updatedTask = {
      ...task,
      status: newStatus,
      completed: newStatus === "completed",
    }
    onUpdate(updatedTask)
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <Badge className={getStatusColor(task.status)} variant="secondary">
                  <div className="flex items-center gap-1">
                    {getStatusIcon(task.status)}
                    {getStatusText(task.status)}
                  </div>
                </Badge>
                <Badge className={getPriorityColor(task.priority)} variant="secondary">
                  {getPriorityText(task.priority)}
                </Badge>
              </div>

              <p className="text-muted-foreground mb-4 line-clamp-2">{task.description}</p>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className={isOverdue(task.due_date) ? "text-red-600 font-medium" : ""}>
                    {formatDate(task.due_date)}
                    {isOverdue(task.due_date) && " (Atrasado)"}
                  </span>
                </div>

                {task.assigned_to_user && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{task.assigned_to_user.name}</span>
                  </div>
                )}

                {task.project && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-muted px-2 py-1 rounded">{task.project.title}</span>
                  </div>
                )}

                {task.space && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: task.space.space_color }} />
                    <span>{task.space.name}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              {task.assigned_to_user && (
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={task.assigned_to_user.profile_image_url || "/placeholder.svg"}
                    alt={task.assigned_to_user.name}
                  />
                  <AvatarFallback className="text-xs">
                    {task.assigned_to_user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleStatusToggle}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {task.status === "completed" ? "Marcar como Pendente" : "Marcar como Concluída"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-xs text-muted-foreground">
              Criada em {new Date(task.created_at).toLocaleDateString("pt-BR")}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleStatusToggle} className="bg-transparent">
                {task.status === "completed" ? "Reabrir" : "Concluir"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowEditModal(true)} className="bg-transparent">
                Editar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditTaskModal open={showEditModal} onOpenChange={setShowEditModal} task={task} onTaskUpdated={onUpdate} />
    </>
  )
}
