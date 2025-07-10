"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, CheckCircle2, Clock, Users, AlertCircle, Plus, BarChart3 } from "lucide-react"

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

interface DashboardClientProps {
  user: any
  tasks: Task[]
  projects: Project[]
  users: User[]
}

export default function DashboardClient({ user, tasks, projects, users }: DashboardClientProps) {
  const [activities, setActivities] = useState<any[]>([])

  useEffect(() => {
    // Load activities from localStorage as fallback
    const savedActivities = localStorage.getItem("digitalz_activities")
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities))
    }
  }, [])

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

  const statsCards = [
    {
      title: "Total de Tarefas",
      value: stats.totalTasks.toString(),
      change: `${stats.completedTasks} concluídas`,
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      title: "Em Progresso",
      value: stats.inProgressTasks.toString(),
      change: "Sendo trabalhadas",
      icon: Clock,
      color: "text-blue-600",
    },
    {
      title: "Projetos Ativos",
      value: stats.activeProjects.toString(),
      change: `${stats.totalProjects} total`,
      icon: BarChart3,
      color: "text-purple-600",
    },
    {
      title: "Usuários Online",
      value: stats.onlineUsers.toString(),
      change: "Conectados agora",
      icon: Users,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Olá, {user?.name || user?.email || "Usuário"}! 👋</h2>
          <p className="text-muted-foreground">Visão geral dos seus projetos e tarefas</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="tasks">Tarefas</TabsTrigger>
          <TabsTrigger value="team">Equipe</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statsCards.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Progresso dos Projetos</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="space-y-4">
                  {projects.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">Nenhum projeto encontrado</p>
                  ) : (
                    projects.slice(0, 3).map((project) => (
                      <div key={project.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">{project.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {project.members_count} membros • Prazo: {formatDate(project.deadline)}
                            </p>
                          </div>
                          <div className="text-sm font-medium">{project.progress}%</div>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
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
                          <h4 className="font-medium text-sm">{task.title}</h4>
                          <p className="text-xs text-muted-foreground">{task.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium">{formatDate(task.due_date)}</p>
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
          </div>

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
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.length === 0 ? (
              <p className="text-muted-foreground text-center py-8 col-span-full">Nenhum projeto encontrado</p>
            ) : (
              projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {project.title}
                      <Badge variant="outline">{project.progress}%</Badge>
                    </CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Progress value={project.progress} />
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-3 w-3" />
                        Prazo: {formatDate(project.deadline)}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="mr-1 h-3 w-3" />
                        {project.members_count} membros
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Todas as Tarefas</CardTitle>
              <CardDescription>Gerencie suas tarefas e acompanhe o progresso</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Nenhuma tarefa encontrada</p>
                ) : (
                  tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant={task.completed ? "default" : "secondary"}>{task.status}</Badge>
                          <span className="text-sm text-muted-foreground">
                            Atribuído a: {task.assigned_to || "Não atribuído"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {task.due_date ? formatDate(task.due_date) : "Sem prazo"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Membros da Equipe</CardTitle>
              <CardDescription>Gerencie os membros da sua equipe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Nenhum membro encontrado</p>
                ) : (
                  users.map((member) => (
                    <div key={member.id} className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {member.name
                            ? member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                            : member.email.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{member.name || member.email}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                      <div className="ml-auto">
                        <Badge variant={member.online_status ? "default" : "outline"}>
                          {member.online_status ? "Online" : "Offline"}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
