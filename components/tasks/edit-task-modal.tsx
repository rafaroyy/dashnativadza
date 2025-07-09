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
  onTaskUpdated: (task: Task) => void
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
    completed: false,
  })
  const [users, setUsers] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [spaces, setSpaces] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && task) {
      // Initialize form with task data
      setFormData({
        title: task.title || "",
        description: task.description || "",
        assigned_to: task.assigned_to || "",
        project_id: task.project_id || "",
        space_id: task.space_id || "",
        status: task.status || "todo",
        due_date: task.due_date ? task.due_date.split("T")[0] : "",
        priority: task.priority || "normal",
        completed: task.completed || false,
      })

      loadInitialData()
    }
  }, [open, task])

  const loadInitialData = async () => {
    setLoadingData(true)
    setError(null)

    try {
      const [usersData, projectsData, spacesData] = await Promise.all([
        dbOperations.getUsers().catch((err) => {
          console.error("Error loading users:", err)
          return []
        }),
        dbOperations.getProjects().catch((err) => {
          console.error("Error loading projects:", err)
          return []
        }),
        dbOperations.getSpaces().catch((err) => {
          console.error("Error loading spaces:", err)
          return []
        }),
      ])

      setUsers(usersData || [])
      setProjects(projectsData || [])
      setSpaces(spacesData || [])

      if (!usersData || usersData.length === 0) {
        setError("Nenhum usuário encontrado")
      } else if (!projectsData || projectsData.length === 0) {
        setError("Nenhum projeto encontrado")
      }
    } catch (error: any) {
      console.error("Error loading initial data:", error)
      setError("Erro ao carregar dados")
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!formData.title.trim()) {
        throw new Error("Título é obrigatório")
      }
      if (!formData.description.trim()) {
        throw new Error("Descrição é obrigatória")
      }
      if (!formData.assigned_to) {
        throw new Error("Usuário responsável é obrigatório")
      }
      if (!formData.project_id) {
        throw new Error("Projeto é obrigatório")
      }
      if (!formData.due_date) {
        throw new Error("Data de entrega é obrigatória")
      }

      const updatedTask = await dbOperations.updateTask(task.id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        assigned_to: formData.assigned_to,
        project_id: formData.project_id,
        space_id: formData.space_id || undefined,
        status: formData.status,
        due_date: formData.due_date,
        priority: formData.priority,
        completed: formData.status === "completed",
      })

      if (updatedTask) {
        onTaskUpdated(updatedTask)
        onOpenChange(false)
      }
    } catch (error: any) {
      console.error("Error updating task:", error)
      setError(error.message || "Erro ao atualizar tarefa")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (newStatus: string) => {
    setFormData((prev) => ({
      ...prev,
      status: newStatus,
      completed: newStatus === "completed",
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
          <DialogDescription>Atualize as informações da tarefa</DialogDescription>
        </DialogHeader>

        {loadingData && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">{error}</div>}

        {!loadingData && (
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
                <Label htmlFor="edit-task-description">Descrição *</Label>
                <Textarea
                  id="edit-task-description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva a tarefa"
                  rows={3}
                  required
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
                      {users.length > 0 ? (
                        users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.email})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-user" disabled>
                          Nenhum usuário disponível
                        </SelectItem>
                      )}
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
                      {projects.length > 0 ? (
                        projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.title}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-project" disabled>
                          Nenhum projeto disponível
                        </SelectItem>
                      )}
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
                      <SelectItem value="">Nenhum espaço</SelectItem>
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
                  <Select value={formData.status} onValueChange={handleStatusChange}>
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
                  <Label htmlFor="edit-task-due-date">Data de Entrega *</Label>
                  <Input
                    id="edit-task-due-date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, due_date: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90"
                disabled={loading || loadingData || users.length === 0 || projects.length === 0}
              >
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
