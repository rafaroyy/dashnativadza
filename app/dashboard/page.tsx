import { getUserFromSession } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckSquare, Clock, Users, TrendingUp } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const user = await getUserFromSession()

  const stats = [
    {
      title: "Tarefas Concluídas",
      value: "24",
      description: "Esta semana",
      icon: CheckSquare,
      color: "text-green-600",
    },
    {
      title: "Em Andamento",
      value: "12",
      description: "Tarefas ativas",
      icon: Clock,
      color: "text-blue-600",
    },
    {
      title: "Membros da Equipe",
      value: "8",
      description: "Online agora",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Produtividade",
      value: "94%",
      description: "Meta mensal",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  const recentTasks = [
    { id: 1, title: "Revisar documentação", status: "Concluída", priority: "Alta" },
    { id: 2, title: "Implementar nova feature", status: "Em andamento", priority: "Média" },
    { id: 3, title: "Corrigir bug crítico", status: "Pendente", priority: "Alta" },
    { id: 4, title: "Reunião com cliente", status: "Agendada", priority: "Baixa" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bem-vindo, {user?.name}!</h1>
        <p className="text-gray-600">Aqui está um resumo das suas atividades hoje.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Progresso dos Projetos</CardTitle>
            <CardDescription>Status atual dos seus projetos ativos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span>Website Redesign</span>
                <span>75%</span>
              </div>
              <Progress value={75} className="mt-2" />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span>App Mobile</span>
                <span>45%</span>
              </div>
              <Progress value={45} className="mt-2" />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span>Sistema CRM</span>
                <span>90%</span>
              </div>
              <Progress value={90} className="mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tarefas Recentes</CardTitle>
            <CardDescription>Suas últimas atividades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.status}</p>
                  </div>
                  <Badge
                    variant={
                      task.priority === "Alta" ? "destructive" : task.priority === "Média" ? "default" : "secondary"
                    }
                  >
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
