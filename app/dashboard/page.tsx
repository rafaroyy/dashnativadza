"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, CheckCircle2, Clock, Users, AlertCircle, Plus, BarChart3 } from "lucide-react"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("digitalz_user")
      if (userData) {
        setUser(JSON.parse(userData))
      }
    }
  }, [])

  const stats = [
    {
      title: "Tarefas Concluídas",
      value: "24",
      change: "+12%",
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      title: "Projetos Ativos",
      value: "8",
      change: "+2",
      icon: BarChart3,
      color: "text-blue-600",
    },
    {
      title: "Equipe",
      value: "12",
      change: "+3",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Prazo Próximo",
      value: "5",
      change: "-2",
      icon: AlertCircle,
      color: "text-orange-600",
    },
  ]

  const recentTasks = [
    {
      id: 1,
      title: "Revisar documentação do projeto",
      status: "Em andamento",
      priority: "Alta",
      assignee: "João Silva",
      dueDate: "2024-01-15",
    },
    {
      id: 2,
      title: "Implementar nova funcionalidade",
      status: "Pendente",
      priority: "Média",
      assignee: "Maria Santos",
      dueDate: "2024-01-18",
    },
    {
      id: 3,
      title: "Teste de integração",
      status: "Concluído",
      priority: "Baixa",
      assignee: "Pedro Costa",
      dueDate: "2024-01-12",
    },
  ]

  const projects = [
    {
      id: 1,
      name: "Sistema de Gestão",
      progress: 75,
      team: 5,
      deadline: "2024-02-15",
    },
    {
      id: 2,
      name: "App Mobile",
      progress: 45,
      team: 3,
      deadline: "2024-03-01",
    },
    {
      id: 3,
      name: "Website Corporativo",
      progress: 90,
      team: 4,
      deadline: "2024-01-30",
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Olá, {user?.name || "Usuário"}! 👋</h2>
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
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.change} desde o mês passado</p>
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
                  {projects.map((project) => (
                    <div key={project.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{project.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {project.team} membros • Prazo: {project.deadline}
                          </p>
                        </div>
                        <div className="text-sm font-medium">{project.progress}%</div>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
                <CardDescription>Suas tarefas mais recentes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTasks.map((task) => (
                    <div key={task.id} className="flex items-center space-x-4">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {task.assignee
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1 flex-1">
                        <p className="text-sm font-medium leading-none">{task.title}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant={task.status === "Concluído" ? "default" : "secondary"} className="text-xs">
                            {task.status}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              task.priority === "Alta"
                                ? "border-red-200 text-red-700"
                                : task.priority === "Média"
                                  ? "border-yellow-200 text-yellow-700"
                                  : "border-green-200 text-green-700"
                            }`}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">{task.dueDate}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {project.name}
                    <Badge variant="outline">{project.progress}%</Badge>
                  </CardTitle>
                  <CardDescription>{project.team} membros da equipe</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Progress value={project.progress} />
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      Prazo: {project.deadline}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{task.title}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{task.status}</Badge>
                        <Badge variant="outline">{task.priority}</Badge>
                        <span className="text-sm text-muted-foreground">Atribuído a: {task.assignee}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{task.dueDate}</span>
                    </div>
                  </div>
                ))}
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
                {["João Silva", "Maria Santos", "Pedro Costa", "Ana Oliveira"].map((member, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>
                        {member
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{member}</p>
                      <p className="text-sm text-muted-foreground">
                        {index === 0
                          ? "Gerente de Projeto"
                          : index === 1
                            ? "Desenvolvedora"
                            : index === 2
                              ? "Designer"
                              : "Analista"}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <Badge variant="outline">Ativo</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
