"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export interface CreateTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: TaskFormData) => Promise<void> | void
  users: { id: string; name: string }[]
  projects: { id: string; name: string }[]
}

interface TaskFormData {
  title: string
  description?: string
  priority: "high" | "medium" | "low"
  status: "todo" | "in_progress" | "done"
  assignee_id?: string | null
  project_id?: string | null
}

function CreateTaskModal(props: CreateTaskModalProps) {
  const { open, onOpenChange, onSubmit, users, projects } = props
  const { toast } = useToast()

  const [form, setForm] = useState<TaskFormData>({
    title: "",
    description: "",
    priority: "medium",
    status: "todo",
    assignee_id: null,
    project_id: null,
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (key: keyof TaskFormData, value: unknown) => setForm((prev) => ({ ...prev, [key]: value }))

  const validateForm = () => {
    if (!form.title || form.title.trim().length < 3) {
      toast({
        title: "Erro no formulário",
        description: "O título deve ter pelo menos 3 caracteres",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      setLoading(true)
      await onSubmit(form)
      onOpenChange(false)
      setForm({
        title: "",
        description: "",
        priority: "medium",
        status: "todo",
        assignee_id: null,
        project_id: null,
      })
      toast({
        title: "Sucesso",
        description: "Tarefa criada com sucesso!",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar a tarefa",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Criar Nova Tarefa</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Título da tarefa"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={form.description ?? ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Descrição da tarefa (opcional)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Prioridade</Label>
              <Select value={form.priority} onValueChange={(value) => handleChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">A Fazer</SelectItem>
                  <SelectItem value="in_progress">Em Progresso</SelectItem>
                  <SelectItem value="done">Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Atribuir a</Label>
              <Select
                value={form.assignee_id ?? "none"}
                onValueChange={(value) => handleChange("assignee_id", value === "none" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar membro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Ninguém</SelectItem>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Projeto</Label>
              <Select
                value={form.project_id ?? "none"}
                onValueChange={(value) => handleChange("project_id", value === "none" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar projeto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={loading} className="flex-1">
              {loading ? "Salvando..." : "Criar Tarefa"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { CreateTaskModal }
export default CreateTaskModal
