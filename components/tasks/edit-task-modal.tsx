"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { dbOperations, type Task } from "@/lib/supabase"

interface EditTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task
  onTaskUpdated?: (task: Task) => void
}

export function EditTaskModal({ open, onOpenChange, task, onTaskUpdated }: EditTaskModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assigned_to: "",
    project_id: "",
    space_id: "",
    status: "todo",
    due_date: "",
    priority: "normal",
  })
  const [users, setUsers] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [spaces, setSpaces] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (task && open) {
      setFormData({
        title: task.title,
        description: task.description,
        assigned_to: task.assigned_to,
        project_id: task.project_id,
        space_id: task.space_id || "",
        status: task.status,
        due_date: task.due_date,
        priority: task.priority || "normal",
      })
      fetchUsers()
      fetchProjects()
      fetchSpaces()
    }
  }, [task, open])

  const fetchUsers = async () => {
    try {
      const data = await dbOperations.getUsers()
      if (data) setUsers(data)
    } catch (error: any) {
      console.error("Error fetching users:", error)
      setError("Erro ao carregar usuários")
    }
  }

  const fetchProjects = async () => {
    try {
      const data = await dbOperations.getProjects()
      if (data) setProjects(data)
    } catch (error: any) {
      console.error("Error fetching projects:", error)
      setError("Erro ao carregar projetos")
    }
  }

  const fetchSpaces = async () => {
    try {
      const data = await dbOperations.getSpaces()
      if (data) setSpaces(data)
    } catch (error: any) {
      console.error("Error fetching spaces:", error)
      setError("Erro ao carregar espaços")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error("Título é obrigatório")
      }
      if (!formData.assigned_to) {
        throw new Error("Usuário responsável é obrigatório")
      }
      if (!formData.project_id) {
        throw new Error("Projeto é obrigatório")
      }

      const updatedTask: Task = {
        ...task,
        title: formData.title,
        description: formData.description,
        assigned_to: formData.assigned_to,
        project_id: formData.project_id,
        space_id: formData.space_id || undefined,
        status: formData.status,
        due_date: formData.due_date,
        priority: formData.priority,
        completed: formData.status === "completed",
      }

      await onTaskUpdated?.(updatedTask)
      onOpenChange(false)
    } catch (error: any) {
      console.error("Error updating task:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
          <DialogDescription>Faça alterações na tarefa</DialogDescription>
        </DialogHeader>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-task-title">Título *</Label>
              <Input
                id="edit-task-title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Digite o título da tarefa"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-task-description">Descrição</Label>
              <Textarea
                id="edit-task-description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva a tarefa"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-task-assigned-to">Usuário Responsável *</Label>
                <Select
                  value={formData.assigned_to}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, assigned_to: value }))}
                  required
                >
                  <SelectTrigger id="edit-task-assigned-to">
                    <SelectValue placeholder="Selecione um usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-task-project">Projeto *</Label>
                <Select
                  value={formData.project_id}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, project_id: value }))}
                  required
                >
                  <SelectTrigger id="edit-task-project">
                    <SelectValue placeholder="Selecione um projeto" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-task-space">Espaço</Label>
                <Select
                  value={formData.space_id}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, space_id: value }))}
                >
                  <SelectTrigger id="edit-task-space">
                    <SelectValue placeholder="Selecione um espaço" />
                  </SelectTrigger>
                  <SelectContent>
                    {spaces.map((space) => (
                      <SelectItem key={space.id} value={space.id}>
                        {space.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-task-priority">Prioridade</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger id="edit-task-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-task-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger id="edit-task-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">A Fazer</SelectItem>
                    <SelectItem value="in-progress">Em Progresso</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-task-due-date">Data de Entrega</Label>
                <Input
                  id="edit-task-due-date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, due_date: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
