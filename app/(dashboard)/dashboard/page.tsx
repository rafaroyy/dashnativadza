import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

async function getDashboardData() {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  try {
    // Buscar tarefas
    const { data: tasks, error: tasksError } = await supabase.from("tasks").select("*")

    if (tasksError) throw tasksError

    // Buscar projetos
    const { data: projects, error: projectsError } = await supabase.from("projects").select("*")

    if (projectsError) throw projectsError

    // Buscar usuários
    const { data: users, error: usersError } = await supabase.from("users").select("*")

    if (usersError) throw usersError

    return {
      tasks: tasks || [],
      projects: projects || [],
      users: users || [],
    }
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error)
    return {
      tasks: [],
      projects: [],
      users: [],
    }
  }
}

export default async function DashboardPage() {
  const { tasks, projects, users } = await getDashboardData()

  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const inProgressTasks = tasks.filter((task) => task.status === "in_progress").length
  const recentTasks = tasks.slice(0, 4)

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bem-vindo, Rafael!</h1>
        <p className="text-gray-600">Aqui está um resumo das suas atividades hoje.</p>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Concluídas</CardTitle>
            <div className="text-green-400">✓</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-gray-400">Esta semana</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <div className="text-blue-400">⏳</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks}</div>
            <p className="text-xs text-gray-400">Tarefas ativas</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membros da Equipe</CardTitle>
            <div className="text-purple-400">👥</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-gray-400">Nesta equipe</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtividade</CardTitle>
            <div className="text-orange-400">📊</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-gray-400">Meta semanal</p>
          </CardContent>
        </Card>
      </div>

      {/* Seção de projetos e tarefas */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Progresso dos Projetos */}
        <Card className="bg-slate-900 text-white">
          <CardHeader>
            <CardTitle>Progresso dos Projetos</CardTitle>
            <p className="text-sm text-gray-400">Status atual dos seus projetos ativos</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.length > 0 ? (
              projects.slice(0, 3).map((project) => (
                <div key={project.id} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">{project.name}</span>
                    <span className="text-sm text-gray-400">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              ))
            ) : (
              <p className="text-gray-400">Nenhum projeto encontrado</p>
            )}
          </CardContent>
        </Card>

        {/* Tarefas Recentes */}
        <Card className="bg-slate-900 text-white">
          <CardHeader>
            <CardTitle>Tarefas Recentes</CardTitle>
            <p className="text-sm text-gray-400">Suas últimas atividades</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-gray-400">{task.description}</p>
                  </div>
                  <Badge variant={task.priority === "high" ? "destructive" : "secondary"}>
                    {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Média" : "Baixa"}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-gray-400">Nenhuma tarefa encontrada</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
