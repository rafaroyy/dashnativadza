"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { dbOperations, type Workspace } from "@/lib/supabase"

interface AddProjectModalProps {
  onProjectAdded?: () => void
}

export function AddProjectModal({ onProjectAdded }: AddProjectModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    workspace_id: "",
    status: "active",
    color: "#3b82f6",
  })

  useEffect(() => {
    if (open) {
      loadWorkspaces()
    }
  }, [open])

  const loadWorkspaces = async () => {
    try {
      const workspacesData = await dbOperations.getWorkspaces()
      setWorkspaces(workspacesData)
    } catch (error) {
      console.error("Error loading workspaces:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.workspace_id) return

    setLoading(true)
    try {
      const projectData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        workspace_id: formData.workspace_id,
        status: formData.status,
        color: formData.color,
      }

      await dbOperations.createProject(projectData)

      // Reset form
      setFormData({
        name: "",
        description: "",
        workspace_id: "",
        status: "active",
        color: "#3b82f6",
      })

      setOpen(false)
      onProjectAdded?.()
    } catch (error) {
      console.error("Error creating project:", error)
    } finally {
      setLoading(false)
    }
  }

  const statusOptions = [
    { value: "active", label: "Ativo" },
    { value: "inactive", label: "Inativo" },
    { value: "completed", label: "Concluído" },
  ]

  const colorOptions = [
    { value: "#3b82f6", label: "Azul", color: "#3b82f6" },
    { value: "#10b981", label: "Verde", color: "#10b981" },
    { value: "#f59e0b", label: "Amarelo", color: "#f59e0b" },
    { value: "#ef4444", label: "Vermelho", color: "#ef4444" },
    { value: "#8b5cf6", label: "Roxo", color: "#8b5cf6" },
    { value: "#06b6d4", label: "Ciano", color: "#06b6d4" },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Projeto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Projeto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Digite o nome do projeto"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva o projeto (opcional)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Workspace *</Label>
            <Select
              value={formData.workspace_id}
              onValueChange={(value) => setFormData({ ...formData, workspace_id: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um workspace" />
              </SelectTrigger>
              <SelectContent>
                {workspaces.length === 0 ? (
                  <SelectItem value="no-workspaces" disabled>
                    Nenhum workspace disponível
                  </SelectItem>
                ) : (
                  workspaces.map((workspace) => (
                    <SelectItem key={workspace.id} value={workspace.id}>
                      {workspace.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cor</Label>
              <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma cor" />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: option.color }} />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !formData.name.trim() || !formData.workspace_id}>
              {loading ? "Criando..." : "Criar Projeto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
