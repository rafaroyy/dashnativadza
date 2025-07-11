"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { TaskCard } from "@/components/tasks/task-card"
import { CreateTaskModal } from "@/components/tasks/add-task-modal"
import { EditTaskModal } from "@/components/tasks/edit-task-modal"
import type { Task, Project, User } from "@/lib/supabase"

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateModalOpen, setCreateModalOpen] = useState(false)
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const { toast } = useToast()
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        supabase.from("tasks").select("*, projects(*), users!tasks_assignee_id_fkey(*)"),
        supabase.from("projects").select("*"),
        supabase.from("users").select("*"),
      ])

      if (tasksRes.error) throw tasksRes.error
      if (projectsRes.error) throw projectsRes.error
      if (usersRes.error) throw usersRes.error

      setTasks(tasksRes.data as any)
      setProjects(projectsRes.data)
      setUsers(usersRes.data)
    } catch (error: any) {
      toast({ title: "Erro ao carregar dados", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [supabase, toast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleEdit = (task: Task) => {
    setSelectedTask(task)
    setEditModalOpen(true)
  }

  const handleDelete = async (taskId: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId)
    if (error) {
      toast({ title: "Erro ao deletar tarefa", description: error.message, variant: "destructive" })
    } else {
      toast({ title: "Tarefa deletada com sucesso" })
      fetchData()
    }
  }

  const handleStatusChange = async (taskId: string, status: string) => {
    const { error } = await supabase.from("tasks").update({ status }).eq("id", taskId)
    if (error) {
      toast({ title: "Erro ao atualizar status", description: error.message, variant: "destructive" })
    } else {
      toast({ title: "Status atualizado" })
      fetchData()
    }
  }

  const filteredTasks = tasks.filter((task) => task.title.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tarefas</h1>
          <p className="text-muted-foreground">Gerencie todas as suas tarefas</p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-full">
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

      {loading ? (
        <p>Carregando tarefas...</p>
      ) : filteredTasks.length > 0 ? (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-8">Nenhuma tarefa encontrada.</p>
      )}

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onTaskCreated={fetchData}
        projects={projects}
        users={users}
      />

      {selectedTask && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          onTaskUpdated={fetchData}
          task={selectedTask}
          projects={projects}
          users={users}
        />
      )}
    </div>
  )
}
