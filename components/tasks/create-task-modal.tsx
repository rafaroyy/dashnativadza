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

// Tipagem para os dados do formulário
interface TaskFormData {
  title: string
  description: string
  status: "todo" | "in_progress" | "completed"
  priority: "low" | "medium" | "high"
}

interface CreateTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateTask: (taskData: TaskFormData) => Promise<void>
}

export function CreateTaskModal({ open, onOpenChange, onCreateTask }: CreateTaskModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
  })

  const handleFieldChange = (field: keyof TaskFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast({
        title: "Erro de Validação",
        description: "O título da tarefa é obrigatório.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // A função `onCreateTask` agora é uma Promise, garantindo que esperamos a conclusão
      await onCreateTask(formData)

      // Limpa o formulário e fecha o modal apenas em caso de sucesso
      setFormData({ title: "", description: "", status: "todo", priority: "medium" })
      onOpenChange(false)
    } catch (error) {
      // O erro já é tratado na página pai com um toast, não precisa de outro aqui.
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
              <Label htmlFor="title" className="text-right">
                Título
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                className="col-span-3"
                placeholder="Ex: Revisar documentação da API"
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
                placeholder="Detalhes sobre a tarefa (opcional)"
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
                  <SelectValue placeholder="Selecione a prioridade" />
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
