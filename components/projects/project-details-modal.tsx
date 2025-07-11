"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, CheckCircle, Clock, AlertTriangle, Target, TrendingUp } from "lucide-react"
import { dbOperations, type Project, type Task, type User } from "@/lib/supabase"

interface ProjectDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project
}

export function ProjectDetailsModal({ open, onOpenChange, project }: ProjectDetailsModalProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && project.id) {
      fetchProjectData()
    }
  }, [open, project.id])

  const fetchProjectData = async () => {
    try {
      setError(null)
      setLoading(true)

      const [allTasks, allUsers] = await Promise.all([dbOperations.getTasks(), dbOperations.getUsers()])

      // Filter tasks for this project
      const projectTasks = allTasks.filter((task) => task.project_id === project.id)
      setTasks(projectTasks)
      setUsers(allUsers)
    } catch (error: any) {
      console.error("Error fetching project data:", error)
      setError("Erro ao carregar dados do projeto")
    } finally {
      setLoading(false)
    }
  }

  const getProjectStats = () => {
    const totalTasks = tasks.length
    const completedTasks = tasks.filter((task) => task.status === "completed").length
    const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length
    const todoTasks = tasks.filter((task) => task.status === "todo").length
    const overdueTasks = tasks.filter((task) => {
      if (!task.due_date || task.completed) return false
      return new Date(task.due_date) < new Date()
    }).length

    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      overdueTasks,
      progress,
    }
  }

  const getTasksByUser = () => {
    const tasksByUser = new Map<string, { user: User; tasks: Task[] }>()

    tasks.forEach((task) => {
      if (task.assigned_to_user) {
        const userId = task.assigned_to_user.id
        if (!tasksByUser.has(userId)) {
          tasksByUser.set(userId, {
            user: task.assigned_to_user,
            tasks: [],
          })
        }
        tasksByUser.get(userId)!.tasks.push(task)
      }
    })

    return Array.from(tasksByUser.values())
  }

  const getRecentTasks = () => {
    return tasks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5)
  }

  const stats = getProjectStats()
  const tasksByUser = getTasksByUser()
  const recentTasks = getRecentTasks()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-blue-500"
      case "todo":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Concluído"
      case "in-progress":
        return "Em Progresso"
      case "todo":
        return "A Fazer"
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "todo":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Target className="h-6 w-6 text-primary" />
            {project.title}
          </DialogTitle>
          <DialogDescription>{project.description}</DialogDescription>
        </DialogHeader>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">{error}</div>}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="tasks">Tarefas</TabsTrigger>
              <TabsTrigger value="team">Equipe</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalTasks}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.completedTasks}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{stats.inProgressTasks}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Atrasadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{stats.overdueTasks}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Progresso do Projeto
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span>{stats.progress}%</span>
                    </div>
                    <Progress value={stats.progress} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {stats.completedTasks} de {stats.totalTasks} tarefas concluídas
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tarefas Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-48">
                    <div className="space-y-2">
                      {recentTasks.length === 0 ? (
                        <p className="text-muted-foreground text-sm">Nenhuma tarefa encontrada</p>
                      ) : (
                        recentTasks.map((task) => (
                          <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg border">
                            <Badge className={getStatusColor(task.status)} variant="secondary">
                              {getStatusIcon(task.status)}
                            </Badge>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{task.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {task.assigned_to_user?.name || "Não atribuído"}
                              </p>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(task.created_at).toLocaleDateString("pt-BR")}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {tasks.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Nenhuma tarefa encontrada para este projeto
                    </p>
                  ) : (
                    tasks.map((task) => (
                      <Card key={task.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium">{task.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {task.assigned_to_user?.name || "Não atribuído"}
                                </div>
                                {task.due_date && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(task.due_date).toLocaleDateString("pt-BR")}
                                  </div>
                                )}
                              </div>
                            </div>
                            <Badge className={getStatusColor(task.status)} variant="secondary">
                              {getStatusText(task.status)}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="team" className="space-y-4">
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {tasksByUser.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Nenhum membro da equipe encontrado</p>
                  ) : (
                    tasksByUser.map(({ user, tasks: userTasks }) => {
                      const completedCount = userTasks.filter((t) => t.status === "completed").length
                      const totalCount = userTasks.length
                      const userProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

                      return (
                        <Card key={user.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={user.profile_image_url || "/placeholder.svg"} alt={user.name} />
                                <AvatarFallback>
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h4 className="font-medium">{user.name}</h4>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                <div className="mt-2">
                                  <div className="flex justify-between text-xs mb-1">
                                    <span>Progresso</span>
                                    <span>{userProgress}%</span>
                                  </div>
                                  <Progress value={userProgress} className="h-1" />
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {completedCount} de {totalCount} tarefas concluídas
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}
