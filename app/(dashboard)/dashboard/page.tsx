import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Users, BarChart3 } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [
    { data: tasks, error: tasksError },
    { data: projects, error: projectsError },
    { data: teamMembers, error: usersError },
  ] = await Promise.all([
    supabase.from("tasks").select("*").eq("assignee_id", user!.id),
    supabase.from("projects").select("*, tasks(status)"),
    supabase.from("users").select("id"),
  ])

  if (tasksError || projectsError || usersError) {
    console.error("Dashboard Error:", { tasksError, projectsError, usersError })
    return <div>Ocorreu um erro ao carregar o dashboard.</div>
  }

  const tasksCompleted = tasks?.filter((t) => t.status === "done").length || 0
  const tasksInProgress = tasks?.filter((t) => t.status === "in_progress").length || 0
  const productivity = tasks && tasks.length > 0 ? Math.round((tasksCompleted / tasks.length) * 100) : 0
  const recentTasks =
    tasks?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5) || []

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { label: "Baixa", variant: "secondary" as const },
      medium: { label: "Média", variant: "default" as const },
      high: { label: "Alta", variant: "destructive" as const },
    }
    return priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.low
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksCompleted}</div>
            <p className="text-xs text-muted-foreground">Esta semana</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksInProgress}</div>
            <p className="text-xs text-muted-foreground">Tarefas ativas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Membros da Equipe</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Online agora</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Produtividade</CardTitle>
            <BarChart3 className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productivity}%</div>
            <p className="text-xs text-muted-foreground">Média mensal</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Progresso dos Projetos</CardTitle>
            <p className="text-sm text-muted-foreground">Status atual dos seus projetos ativos</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects && projects.length > 0 ? (
              projects.map((project) => {
                const totalTasks = project.tasks.length
                const completedTasks = project.tasks.filter((t: any) => t.status === "done").length
                const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
                return (
                  <div key={project.id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{project.name}</span>
                      <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                )
              })
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhum projeto ativo.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tarefas Recentes</CardTitle>
            <p className="text-sm text-muted-foreground">Suas últimas atividades</p>
          </CardHeader>
          <CardContent>
            {recentTasks.length > 0 ? (
              <ul className="space-y-3">
                {recentTasks.map((task) => (
                  <li key={task.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {task.status === "done" ? "Concluída" : "Agendada"}
                      </p>
                    </div>
                    <Badge {...getPriorityBadge(task.priority)}>{getPriorityBadge(task.priority).label}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhuma tarefa recente.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
