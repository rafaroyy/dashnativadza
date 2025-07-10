import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export const dynamic = "force-dynamic"

export default function TasksPage() {
  const tasks = [
    {
      id: 1,
      title: "Implementar sistema de autenticação",
      description: "Criar login e registro de usuários",
      status: "Em andamento",
      priority: "Alta",
      assignee: "João Silva",
      dueDate: "2024-01-15",
    },
    {
      id: 2,
      title: "Revisar documentação da API",
      description: "Atualizar documentação com novos endpoints",
      status: "Pendente",
      priority: "Média",
      assignee: "Maria Santos",
      dueDate: "2024-01-20",
    },
    {
      id: 3,
      title: "Corrigir bug no dashboard",
      description: "Resolver problema de carregamento lento",
      status: "Concluída",
      priority: "Alta",
      assignee: "Pedro Costa",
      dueDate: "2024-01-10",
    },
    {
      id: 4,
      title: "Implementar notificações push",
      description: "Adicionar sistema de notificações em tempo real",
      status: "Em andamento",
      priority: "Baixa",
      assignee: "Ana Oliveira",
      dueDate: "2024-01-25",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluída":
        return "bg-green-100 text-green-800"
      case "Em andamento":
        return "bg-blue-100 text-blue-800"
      case "Pendente":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "destructive"
      case "Média":
        return "default"
      case "Baixa":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tarefas</h1>
          <p className="text-gray-600">Gerencie todas as suas tarefas</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Buscar tarefas..." className="pl-10" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </div>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                  <CardDescription>{task.description}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                  <Badge variant={getPriorityColor(task.priority)}>{task.priority}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Responsável: {task.assignee}</span>
                <span>Prazo: {new Date(task.dueDate).toLocaleDateString("pt-BR")}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
