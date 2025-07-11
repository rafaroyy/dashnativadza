"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter } from "lucide-react"
import { CreateTaskModal } from "@/components/tasks/create-task-modal"
import { useToast } from "@/hooks/use-toast"

interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in_progress" | "completed"
  priority: "low" | "medium" | "high"
  created_at: string
  updated_at: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as tarefas",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateTask(taskData: Omit<Task, "id" | "created_at" | "updated_at">) {
    try {
      const { data, error } = await supabase.from("tasks").insert([taskData]).select().single()

      if (error) throw error

      setTasks((prev) => [data, ...prev])
      setIsCreateModalOpen(false)
      toast({
        title: "Sucesso",
        description: "Tarefa criada com sucesso!",
      })
    } catch (error) {
      console.error("Erro ao criar tarefa:", error)
      toast({
        title: "Erro",
        description: "Não foi possível criar a tarefa",
        variant: "destructive",
      })
    }
  }

  async function handleStatusChange(taskId: string, newStatus: Task["status"]) {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", taskId)

      if (error) throw error

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: newStatus, updated_at: new Date().toISOString() } : task,
        ),
      )

      toast({
        title: "Sucesso",
        description: "Status da tarefa atualizado!",
      })
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a tarefa",
        variant: "destructive",
      })
    }
  }

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Concluída</Badge>
      case "in_progress":
        return <Badge className="bg-blue-500">Em andamento</Badge>
      default:
        return <Badge variant="outline">Pendente</Badge>
    }
  }

  const getPriorityBadge = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Alta</Badge>
      case "medium":
        return <Badge className="bg-yellow-500">Média</Badge>
      default:
        return <Badge variant="secondary">Baixa</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando tarefas...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tarefas</h1>
          <p className="text-gray-600">Gerencie todas as suas tarefas</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="bg-teal-500 hover:bg-teal-600">
          <Plus className="mr-2 h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      {/* Barra de busca e filtros */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar tarefas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </div>

      {/* Lista de tarefas */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <p className="text-sm text-gray-600">{task.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    {getStatusBadge(task.status)}
                    {getPriorityBadge(task.priority)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Criada em {new Date(task.created_at).toLocaleDateString("pt-BR")}
                  </p>
                  <div className="flex space-x-2">
                    {task.status !== "completed" && (
                      <Button size="sm" variant="outline" onClick={() => handleStatusChange(task.id, "completed")}>
                        Concluir
                      </Button>
                    )}
                    {task.status === "todo" && (
                      <Button size="sm" variant="outline" onClick={() => handleStatusChange(task.id, "in_progress")}>
                        Iniciar
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 mb-4">
                {searchTerm ? "Nenhuma tarefa encontrada para sua busca" : "Nenhuma tarefa encontrada"}
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)} className="bg-teal-500 hover:bg-teal-600">
                <Plus className="mr-2 h-4 w-4" />
                Criar primeira tarefa
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <CreateTaskModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} onCreateTask={handleCreateTask} />
    </div>
  )
}
