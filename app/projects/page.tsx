import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Plus, Calendar, Users } from "lucide-react"

export const dynamic = "force-dynamic"

export default function ProjectsPage() {
  const projects = [
    {
      id: 1,
      name: "Website Redesign",
      description: "Redesign completo do website corporativo",
      status: "Em andamento",
      progress: 75,
      startDate: "2024-01-01",
      endDate: "2024-02-15",
      team: ["João Silva", "Maria Santos", "Pedro Costa"],
      tasksCompleted: 15,
      totalTasks: 20,
    },
    {
      id: 2,
      name: "App Mobile",
      description: "Desenvolvimento do aplicativo mobile",
      status: "Em andamento",
      progress: 45,
      startDate: "2023-12-15",
      endDate: "2024-03-01",
      team: ["Ana Oliveira", "Carlos Lima"],
      tasksCompleted: 9,
      totalTasks: 20,
    },
    {
      id: 3,
      name: "Sistema CRM",
      description: "Implementação do sistema de CRM",
      status: "Quase concluído",
      progress: 90,
      startDate: "2023-11-01",
      endDate: "2024-01-30",
      team: ["Maria Santos", "Pedro Costa", "Ana Oliveira"],
      tasksCompleted: 18,
      totalTasks: 20,
    },
    {
      id: 4,
      name: "Dashboard Analytics",
      description: "Painel de analytics e relatórios",
      status: "Planejamento",
      progress: 10,
      startDate: "2024-02-01",
      endDate: "2024-04-15",
      team: ["João Silva"],
      tasksCompleted: 2,
      totalTasks: 25,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluído":
        return "bg-green-100 text-green-800"
      case "Em andamento":
        return "bg-blue-100 text-blue-800"
      case "Quase concluído":
        return "bg-purple-100 text-purple-800"
      case "Planejamento":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projetos</h1>
          <p className="text-gray-600">Acompanhe o progresso dos seus projetos</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </div>
                <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Progresso</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} />
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>
                    {new Date(project.startDate).toLocaleDateString("pt-BR")} -{" "}
                    {new Date(project.endDate).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600">
                  <Users className="mr-1 h-4 w-4" />
                  <span>{project.team.length} membros</span>
                </div>
                <span className="text-gray-600">
                  {project.tasksCompleted}/{project.totalTasks} tarefas
                </span>
              </div>

              <div className="flex flex-wrap gap-1">
                {project.team.slice(0, 3).map((member, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {member}
                  </Badge>
                ))}
                {project.team.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{project.team.length - 3}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
