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
import { dbOperations } from "@/lib/supabase"

interface AddTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTaskAdded: (task: any) => void
}

export function AddTaskModal({ open, onOpenChange, onTaskAdded }: AddTaskModalProps) {
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
  const [loadingData, setLoadingData] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      loadInitialData()
    }
  }, [open])

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
        setError("Nenhum usuário encontrado. Adicione usuários primeiro.")
      } else if (!projectsData || projectsData.length === 0) {
        setError("Nenhum projeto encontrado. Adicione projetos primeiro.")
      }
    } catch (error: any) {
      console.error("Error loading initial data:", error)
      setError("Erro ao carregar dados iniciais. Tente novamente.")
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

      const newTask = await dbOperations.createTask({
        title: formData.title.trim(),
        description: formData.description.trim(),
        assigned_to: formData.assigned_to,
        project_id: formData.project_id,
        space_id: formData.space_id || undefined,
        status: formData.status,
        due_date: formData.due_date,
        priority: formData.priority,
      })

      onTaskAdded(newTask)
      onOpenChange(false)
      setFormData({
        title: "",
        description: "",
        assigned_to: "",
        project_id: "",
        space_id: "",
        status: "todo",
        due_date: "",
        priority: "normal",
      })
    } catch (error: any) {
      console.error("Error creating task:", error)
      setError(error.message || "Erro ao criar tarefa")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Tarefa</DialogTitle>
          <DialogDescription>Crie uma nova tarefa para sua equipe</DialogDescription>
        </DialogHeader>

        {loadingData && (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-gray-500">Carregando dados...</div>
          </div>
        )}

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">{error}</div>}

        {!loadingData && (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">Título *</Label>
                <Input
                  id="task-title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Digite o título da tarefa"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="task-description">Descrição *</Label>
                <Textarea
                  id="task-description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva a tarefa"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="task-assigned-to">Usuário Responsável *</Label>
                  <Select
                    value={formData.assigned_to}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, assigned_to: value }))}
                    required
                  >
                    <SelectTrigger id="task-assigned-to">
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
                        <SelectItem value="no-users" disabled>
                          Nenhum usuário disponível
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-project">Projeto *</Label>
                  <Select
                    value={formData.project_id}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, project_id: value }))}
                    required
                  >
                    <SelectTrigger id="task-project">
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
                        <SelectItem value="no-projects" disabled>
                          Nenhum projeto disponível
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="task-space">Espaço</Label>
                  <Select
                    value={formData.space_id}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, space_id: value }))}
                  >
                    <SelectTrigger id="task-space">
                      <SelectValue placeholder="Selecione um espaço (opcional)" />
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
                  <Label htmlFor="task-priority">Prioridade</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger id="task-priority">
                      <SelectValue placeholder="Selecione a prioridade" />
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
                  <Label htmlFor="task-status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger id="task-status">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">A Fazer</SelectItem>
                      <SelectItem value="in-progress">Em Progresso</SelectItem>
                      <SelectItem value="completed">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-due-date">Data de Entrega *</Label>
                  <Input
                    id="task-due-date"
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
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
