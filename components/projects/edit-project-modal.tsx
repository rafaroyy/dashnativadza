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

interface Project {
  id: string
  title: string
  description: string
  status: string
  progress: number
  deadline: string
  members_count: number
  tasks_total: number
}

interface EditProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project
  onProjectUpdate: (project: Project) => void
}

export function EditProjectModal({ open, onOpenChange, project, onProjectUpdate }: EditProjectModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
    progress: "0",
    dueDate: "",
    teamSize: "1",
    totalTasks: "10",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (project && open) {
      setFormData({
        name: project.title,
        description: project.description,
        status: project.status,
        progress: project.progress.toString(),
        dueDate: project.deadline,
        teamSize: project.members_count.toString(),
        totalTasks: project.tasks_total.toString(),
      })
    }
  }, [project, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updatedProject = {
        ...project,
        title: formData.name,
        description: formData.description,
        status: formData.status,
        progress: Number.parseInt(formData.progress) || 0,
        deadline: formData.dueDate,
        members_count: Number.parseInt(formData.teamSize) || 1,
        tasks_total: Number.parseInt(formData.totalTasks) || 10,
      }

      await onProjectUpdate(updatedProject)
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating project:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Projeto</DialogTitle>
          <DialogDescription>Faça alterações no projeto</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome do Projeto</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Digite o nome do projeto"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o projeto"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="on-hold">Pausado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-progress">Progresso (%)</Label>
                <Input
                  id="edit-progress"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData((prev) => ({ ...prev, progress: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-dueDate">Data de Entrega</Label>
                <Input
                  id="edit-dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-totalTasks">Total de Tarefas</Label>
                <Input
                  id="edit-totalTasks"
                  type="number"
                  min="1"
                  value={formData.totalTasks}
                  onChange={(e) => setFormData((prev) => ({ ...prev, totalTasks: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-teamSize">Tamanho da Equipe</Label>
              <Input
                id="edit-teamSize"
                type="number"
                min="1"
                value={formData.teamSize}
                onChange={(e) => setFormData((prev) => ({ ...prev, teamSize: e.target.value }))}
              />
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
