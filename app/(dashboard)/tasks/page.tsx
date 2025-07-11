"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Filter, Search, Edit, Trash2 } from "lucide-react"
import { dbOperations, type Task, type User, type Project } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { CreateTaskModal } from "@/components/tasks/create-task-modal"
import { EditTaskModal } from "@/components/tasks/edit-task-modal"

export const dynamic = "force-dynamic"

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [tasksData, usersData, projectsData] = await Promise.all([
        dbOperations.getTasks(),
        dbOperations.getUsers(),
        dbOperations.getProjects(),
      ])
      setTasks(tasksData)
      setUsers(usersData)
      setProjects(projectsData)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as tarefas",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (taskData: Omit<Task, "id" | "created_at" | "updated_at">) => {
    try {
      const newTask = await dbOperations.createTask(taskData)
      setTasks([newTask, ...tasks])
      setShowCreateModal(false)
      toast({
        title: "Sucesso",
        description: "Tarefa criada com sucesso",
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

  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await dbOperations.updateTask(id, updates)
      setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)))
      setEditingTask(null)
      toast({
        title: "Sucesso",
        description: "Tarefa atualizada com sucesso",
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

  const handleDeleteTask = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return

    try {
      await dbOperations.deleteTask(id)
      setTasks(tasks.filter((task) => task.id !== id))
      toast({
        title: "Sucesso",
        description: "Tarefa excluída com sucesso",
      })
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a tarefa",
        variant: "destructive",
      })
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "todo":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tarefas</h1>
          <p className="text-gray-600">Gerencie todas as suas tarefas</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar tarefas..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="todo">A Fazer</SelectItem>
            <SelectItem value="in_progress">Em Progresso</SelectItem>
            <SelectItem value="done">Concluído</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 mb-4">Nenhuma tarefa encontrada</p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar primeira tarefa
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <CardDescription>{task.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(task.status)}>
                      {task.status === "todo"
                        ? "A Fazer"
                        : task.status === "in_progress"
                          ? "Em Progresso"
                          : "Concluído"}
                    </Badge>
                    <Badge variant={getPriorityColor(task.priority)}>
                      {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Média" : "Baixa"}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => setEditingTask(task)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteTask(task.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Responsável: {task.assignee?.name || "Não atribuído"}</span>
                  {task.due_date && <span>Prazo: {new Date(task.due_date).toLocaleDateString("pt-BR")}</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateTaskModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={handleCreateTask}
        users={users}
        projects={projects}
      />

      {editingTask && (
        <EditTaskModal
          open={!!editingTask}
          onOpenChange={() => setEditingTask(null)}
          task={editingTask}
          onSubmit={(updates) => handleUpdateTask(editingTask.id, updates)}
          users={users}
          projects={projects}
        />
      )}
    </div>
  )
}
