"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AddProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProjectAdded: (project: any) => void
}

export function AddProjectModal({ open, onOpenChange, onProjectAdded }: AddProjectModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dueDate: "",
    teamSize: "1",
    totalTasks: "10",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newProject = {
      name: formData.name,
      description: formData.description,
      dueDate: formData.dueDate,
      teamSize: Number.parseInt(formData.teamSize) || 1,
      totalTasks: Number.parseInt(formData.totalTasks) || 10,
    }

    onProjectAdded(newProject)
    onOpenChange(false)

    setFormData({
      name: "",
      description: "",
      dueDate: "",
      teamSize: "1",
      totalTasks: "10",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Projeto</DialogTitle>
          <DialogDescription>Crie um novo projeto para sua equipe</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Projeto</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Digite o nome do projeto"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o projeto"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Data de Entrega</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalTasks">Total de Tarefas</Label>
                <Input
                  id="totalTasks"
                  type="number"
                  min="1"
                  value={formData.totalTasks}
                  onChange={(e) => setFormData((prev) => ({ ...prev, totalTasks: e.target.value }))}
                  placeholder="10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamSize">Tamanho da Equipe</Label>
              <Input
                id="teamSize"
                type="number"
                min="1"
                value={formData.teamSize}
                onChange={(e) => setFormData((prev) => ({ ...prev, teamSize: e.target.value }))}
                placeholder="1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Criar Projeto
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
