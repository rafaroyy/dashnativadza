"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AddTaskModal } from "@/components/tasks/add-task-modal"
import { Plus, CheckCircle, Clock, AlertCircle, Users, Calendar, TrendingUp } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Task {
  id: string
  title: string
  description: string
  status: string
  due_date: string
  assigned_to: string
  project_id: string
  completed: boolean
  created_at: string
}

interface Project {
  id: string
  title: string
  description: string
  status: string
  progress: number
  deadline: string
  members_count: number
  tasks_total: number
  created_at: string
}

interface User {
  id: string
  name: string
  email: string
  online_status: boolean
}

interface Activity {
  id: string
  type: string
  description: string
  timestamp: string
  user: string
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [showAddTask, setShowAddTask] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        supabase.from("tasks").select("*"),
        supabase.from("projects").select("*"),
        supabase.from("users").select("*"),
      ])

      if (tasksRes.data) setTasks(tasksRes.data)
      if (projectsRes.data) setProjects(projectsRes.data)
      if (usersRes.data) setUsers(usersRes.data)

      // Load activities from localStorage as fallback
      const savedActivities = localStorage.getItem("digitalz_activities")
      if (savedActivities) {
        setActivities(JSON.parse(savedActivities))
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.completed).length,
    inProgressTasks: tasks.filter((t) => t.status === "in-progress").length,
    todoTasks: tasks.filter((t) => t.status === "todo").length,
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === "active").length,
    completedProjects: projects.filter((p) => p.status === "completed").length,
    onlineUsers: users.filter((u) => u.online_status).length,
  }

  const completionRate = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0

  const upcomingDeadlines = tasks
    .filter((task) => task.due_date && new Date(task.due_date) > new Date())
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5)

  const handleTaskAdded = async (newTask: any) => {
    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          title: newTask.title,
          description: newTask.description,
          status: "todo",
          due_date: newTask.dueDate,
          assigned_to: newTask.assignee,
          project_id: newTask.project,
          completed: false,
        },
      ])
      .select()

    if (data && data[0]) {
      setTasks([...tasks, data[0]])

      // Add activity
      const newActivity = {
        id: Date.now().toString(),
        type: "task_created",
        description: `Nova tarefa '${newTask.title}' foi criada`,
        timestamp: new Date().toISOString(),
        user: "Você",
      }
      const updatedActivities = [newActivity, ...activities].slice(0, 10)
      setActivities(updatedActivities)
      localStorage.setItem("digitalz_activities", JSON.stringify(updatedActivities))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m atrás`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h atrás`
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d atrás`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 ml-64">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral dos seus projetos e tarefas</p>
        </div>
        <Button onClick={() => setShowAddTask(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Nova Tarefa
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTasks}</div>
            <p className="text-xs text-muted-foreground">{stats.completedTasks} concluídas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgressTasks}</div>
            <p className="text-xs text-muted-foreground">Sendo trabalhadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">{stats.totalProjects} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Online</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.onlineUsers}</div>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <CardTitle>Próximos Prazos</CardTitle>
            </div>
            <CardDescription>Tarefas com deadlines próximos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Nenhum prazo próximo</p>
              ) : (
                upcomingDeadlines.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatDate(task.due_date)}</p>
                      <Badge variant="outline" className="text-xs">
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <CardTitle>Atividades Recentes</CardTitle>
            </div>
            <CardDescription>Últimas ações realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Nenhuma atividade recente</p>
              ) : (
                activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.user} • {getTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <AddTaskModal open={showAddTask} onOpenChange={setShowAddTask} onTaskAdded={handleTaskAdded} />
    </div>
  )
}
