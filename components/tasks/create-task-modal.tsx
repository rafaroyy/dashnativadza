"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

// Tipagens
interface Space {
  id: string
  name: string
}

interface TaskFormData {
  title: string
  description: string
  status: "todo" | "in_progress" | "completed"
  priority: "low" | "medium" | "high"
  space_id: string
}

interface CreateTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateTask: (taskData: TaskFormData) => Promise<void>
  spaces: Space[]
}

export function CreateTaskModal({ open, onOpenChange, onCreateTask, spaces }: CreateTaskModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    space_id: "",
  })

  const handleFieldChange = (field: keyof TaskFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.space_id) {
      toast({ title: "Erro de Validação", description: "É obrigatório selecionar um espaço.", variant: "destructive" })
      return
    }
    if (!formData.title.trim()) {
      toast({ title: "Erro de Validação", description: "O título é obrigatório.", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      await onCreateTask(formData)
      setFormData({ title: "", description: "", status: "todo", priority: "medium", space_id: "" })
      onOpenChange(false)
    } catch (error) {
      // O erro já é tratado no componente pai, não precisa de toast aqui.
      console.error("Falha ao criar tarefa no modal:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Tarefa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="space_id" className="text-right">
                Espaço
              </Label>
              <Select value={formData.space_id} onValueChange={(value) => handleFieldChange("space_id", value)}>
                <SelectTrigger className="col-span-3">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Título
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                className="col-span-3"
                placeholder="Ex: Revisar documentação"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descrição
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                className="col-span-3"
                placeholder="Detalhes da tarefa (opcional)"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Prioridade
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value: "low" | "medium" | "high") => handleFieldChange("priority", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar Tarefa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateTaskModal
