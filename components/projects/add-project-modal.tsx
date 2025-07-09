"use client"

import type React from "react"
import { useState } from "react"
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

interface AddProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProjectAdded: (project: any) => void
}

export function AddProjectModal({ open, onOpenChange, onProjectAdded }: AddProjectModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "active",
    deadline: "",
    members_count: 1,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      if (!formData.deadline) {
        throw new Error("Data de entrega é obrigatória")
      }

      // Validate deadline is in the future
      const deadlineDate = new Date(formData.deadline)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (deadlineDate < today) {
        throw new Error("A data de entrega deve ser futura")
      }

      const newProject = await dbOperations.createProject({
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        deadline: formData.deadline,
        members_count: formData.members_count,
        progress: 0,
        tasks_total: 0,
        created_by: "550e8400-e29b-41d4-a716-446655440001", // Mock user ID
      })

      if (newProject) {
        onProjectAdded(newProject)
        onOpenChange(false)
        setFormData({
          title: "",
          description: "",
          status: "active",
          deadline: "",
          members_count: 1,
        })
      }
    } catch (error: any) {
      console.error("Error creating project:", error)
      setError(error.message || "Erro ao criar projeto")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setFormData({
      title: "",
      description: "",
      status: "active",
      deadline: "",
      members_count: 1,
    })
    setError(null)
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0]

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Projeto</DialogTitle>
          <DialogDescription>Crie um novo projeto para sua equipe</DialogDescription>
        </DialogHeader>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project-title">Título do Projeto *</Label>
              <Input
                id="project-title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Digite o título do projeto"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-description">Descrição *</Label>
              <Textarea
                id="project-description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o projeto"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger id="project-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="on-hold">Pausado</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-members">Número de Membros</Label>
                <Input
                  id="project-members"
                  type="number"
                  min="1"
                  max="50"
                  value={formData.members_count}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, members_count: Number.parseInt(e.target.value) || 1 }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-deadline">Data de Entrega *</Label>
              <Input
                id="project-deadline"
                type="date"
                min={today}
                value={formData.deadline}
                onChange={(e) => setFormData((prev) => ({ ...prev, deadline: e.target.value }))}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
              {loading ? "Criando..." : "Criar Projeto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
