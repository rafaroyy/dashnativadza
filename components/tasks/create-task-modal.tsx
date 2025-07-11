"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import * as z from "zod"

export interface CreateTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Omit<TaskFormData, "id" | "created_at" | "updated_at">) => Promise<void> | void
  users: { id: string; name: string }[]
  projects: { id: string; name: string }[]
}

const TaskSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  priority: z.enum(["high", "medium", "low"]),
  status: z.enum(["todo", "in_progress", "done"]),
  assignee_id: z.string().uuid().optional().nullable(),
  project_id: z.string().uuid().optional().nullable(),
})

type TaskFormData = z.infer<typeof TaskSchema>

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

  const handleSubmit = async () => {
    const parse = TaskSchema.safeParse(form)
    if (!parse.success) {
      toast({
        title: "Erro no formulário",
        description: parse.error.issues[0].message,
        variant: "destructive",
      })
      return
    }
    try {
      setLoading(true)
      await onSubmit(parse.data)
      onOpenChange(false)
      setForm({
        title: "",
        description: "",
        priority: "medium",
        status: "todo",
        assignee_id: null,
        project_id: null,
      })
    } catch {
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

          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "Salvando..." : "Criar Tarefa"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* -------------------------------------------------- *
 *  Exports                                           *
 * -------------------------------------------------- */
export { CreateTaskModal } //  named
export default CreateTaskModal //  default
