"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter } from "lucide-react"
import { AddTaskModal } from "@/components/tasks/add-task-modal"
import { TaskCard } from "@/components/tasks/task-card"
import { type Task, dbOperations } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showAddTask, setShowAddTask] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [projectFilter, setProjectFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTasks()
    fetchProjects()
  }, [])

  const fetchTasks = async () => {
    try {
      setError(null)
      const data = await dbOperations.getTasks()
      if (data) setTasks(data)
    } catch (error: any) {
      console.error("Error fetching tasks:", error)
      setError("Erro ao carregar tarefas: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchProjects = async () => {
    try {
      const data = await dbOperations.getProjects()
      if (data) setProjects(data)
    } catch (error: any) {
      console.error("Error fetching projects:", error)
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesProject = projectFilter === "all" || task.project_id === projectFilter

    return matchesSearch && matchesStatus && matchesProject
  })

  const handleTaskAdded = async (newTask: any) => {
    try {
      setError(null)
      const createdTask = await dbOperations.createTask({
        title: newTask.title,
        description: newTask.description,
        assigned_to: newTask.assigned_to,
        project_id: newTask.project_id,
        space_id: newTask.space_id,
        status: newTask.status,
        due_date: newTask.due_date,
        priority: newTask.priority || "normal",
      })

      if (createdTask) {
        setTasks([createdTask, ...tasks])
      }
    } catch (error: any) {
      console.error("Error creating task:", error)
      setError("Erro ao criar tarefa: " + error.message)
    }
  }

  const handleTaskUpdate = async (updatedTask: Task) => {
    try {
      setError(null)
      const updated = await dbOperations.updateTask(updatedTask.id, {
        title: updatedTask.title,
        description: updatedTask.description,
        status: updatedTask.status,
        due_date: updatedTask.due_date,
        assigned_to: updatedTask.assigned_to,
        project_id: updatedTask.project_id,
        space_id: updatedTask.space_id,
        priority: updatedTask.priority,
        completed: updatedTask.completed,
      })

      if (updated) {
        setTasks(tasks.map((t) => (t.id === updatedTask.id ? updated : t)))
      }
    } catch (error: any) {
      console.error("Error updating task:", error)
      setError("Erro ao atualizar tarefa: " + error.message)
    }
  }

  const handleTaskDelete = async (taskId: string) => {
    try {
      setError(null)
      await dbOperations.deleteTask(taskId)
      setTasks(tasks.filter((t) => t.id !== taskId))
    } catch (error: any) {
      console.error("Error deleting task:", error)
      setError("Erro ao excluir tarefa: " + error.message)
    }
  }

  // Contadores por status
  const todoCount = tasks.filter((t) => t.status === "todo").length
  const inProgressCount = tasks.filter((t) => t.status === "in-progress").length
  const completedCount = tasks.filter((t) => t.status === "completed").length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ml-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 ml-64">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Tarefas</h1>
          <p className="text-muted-foreground">Gerencie todas as suas tarefas</p>
        </div>
        <Button onClick={() => setShowAddTask(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Tarefa
        </Button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

      {/* Contadores de Status */}
      <div className="flex gap-4">
        <Badge variant="outline" className="px-4 py-2">
          A Fazer: {todoCount}
        </Badge>
        <Badge variant="outline" className="px-4 py-2">
          Em Progresso: {inProgressCount}
        </Badge>
        <Badge variant="outline" className="px-4 py-2">
          Concluído: {completedCount}
        </Badge>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar tarefas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="todo">A Fazer</SelectItem>
            <SelectItem value="in-progress">Em Progresso</SelectItem>
            <SelectItem value="completed">Concluído</SelectItem>
          </SelectContent>
        </Select>

        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Projeto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Projetos</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {tasks.length === 0
                ? "Nenhuma tarefa encontrada. Clique em 'Adicionar Tarefa' para começar."
                : "Nenhuma tarefa encontrada com os filtros aplicados."}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} onUpdate={handleTaskUpdate} onDelete={handleTaskDelete} />
          ))
        )}
      </div>

      <AddTaskModal open={showAddTask} onOpenChange={setShowAddTask} onTaskAdded={handleTaskAdded} />
    </div>
  )
}
