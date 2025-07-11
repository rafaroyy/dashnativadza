"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter } from "lucide-react"
import { CreateTaskModal } from "@/components/tasks/create-task-modal"
import { useToast } from "@/hooks/use-toast"

// Tipagens
type Space = {
  id: string
  name: string
}

type Task = {
  id: string
  title: string
  description: string | null
  status: "todo" | "in_progress" | "completed"
  priority: "low" | "medium" | "high"
  created_at: string
  space_id: string
  spaces: { name: string } | null // Relação com spaces
}

type TaskFormData = {
  title: string
  description: string
  status: "todo" | "in_progress" | "completed"
  priority: "low" | "medium" | "high"
  space_id: string
}

interface TasksClientProps {
  initialTasks: Task[]
  initialSpaces: Space[]
}

export function TasksClient({ initialTasks, initialSpaces }: TasksClientProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [spaces] = useState<Space[]>(initialSpaces)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const handleCreateTask = async (taskData: TaskFormData) => {
    const { data, error } = await supabase.from("tasks").insert([taskData]).select("*, spaces (name)").single()

    if (error) {
      toast({ title: "Erro ao criar tarefa", description: error.message, variant: "destructive" })
      throw new Error(error.message)
    }

    toast({ title: "Sucesso!", description: "Tarefa criada com sucesso." })
    setTasks((prev) => [data, ...prev])
  }

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getPriorityBadgeVariant = (priority: Task["priority"]): "destructive" | "secondary" | "default" => {
    if (priority === "high") return "destructive"
    if (priority === "medium") return "secondary"
    return "default"
  }

  const getStatusLabel = (status: Task["status"]): string => {
    if (status === "in_progress") return "Em andamento"
    if (status === "completed") return "Concluída"
    return "Pendente"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tarefas</h1>
          <p className="text-muted-foreground">Gerencie todas as suas tarefas aqui.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="bg-digitalz-cyan hover:bg-digitalz-cyan-light">
          <Plus className="mr-2 h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tarefas..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">Nenhuma tarefa encontrada.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <Card key={task.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{task.title}</CardTitle>
                  <Badge variant={getPriorityBadgeVariant(task.priority)}>{task.priority}</Badge>
                </div>
                <CardDescription>{task.description || "Sem descrição."}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{getStatusLabel(task.status)}</span>
                  <div className="flex items-center gap-4">
                    <span>{task.spaces?.name || "Sem espaço"}</span>
                    <span>Criada em: {new Date(task.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateTaskModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreateTask={handleCreateTask}
        spaces={spaces}
      />
    </div>
  )
}
