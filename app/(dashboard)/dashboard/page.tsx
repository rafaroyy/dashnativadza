import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { dbOperations } from "@/lib/supabase"
import { CalendarDays, CheckCircle, Clock, Users } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  try {
    const [tasks, projects, users] = await Promise.all([
      dbOperations.getTasks(),
      dbOperations.getProjects(),
      dbOperations.getUsers(),
    ])

    const completedTasks = tasks.filter((task) => task.status === "done").length
    const inProgressTasks = tasks.filter((task) => task.status === "in_progress").length
    const activeProjects = projects.filter((project) => project.status === "active").length

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral do seu workspace</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.length}</div>
              <p className="text-xs text-muted-foreground">{completedTasks} concluídas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressTasks}</div>
              <p className="text-xs text-muted-foreground">tarefas ativas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProjects}</div>
              <p className="text-xs text-muted-foreground">de {projects.length} total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Membros da Equipe</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">usuários ativos</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Tarefas Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{task.title}</p>
                      <p className="text-sm text-muted-foreground">{task.assignee?.name || "Não atribuído"}</p>
                    </div>
                    <div className="ml-auto font-medium">
                      {task.status === "done" ? "✅" : task.status === "in_progress" ? "🔄" : "⏳"}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Projetos em Destaque</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.slice(0, 3).map((project) => (
                  <div key={project.id} className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{project.name || project.title}</p>
                      <p className="text-sm text-muted-foreground">{project.progress || 0}% concluído</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Erro ao carregar dashboard:", error)
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-red-600">Erro ao carregar dados. Verifique a conexão com o banco.</p>
        </div>
      </div>
    )
  }
}
