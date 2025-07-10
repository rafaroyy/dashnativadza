import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Mail, MessageCircle } from "lucide-react"

export const dynamic = "force-dynamic"

export default function TeamsPage() {
  const teamMembers = [
    {
      id: 1,
      name: "João Silva",
      email: "joao@example.com",
      role: "Desenvolvedor Frontend",
      status: "online",
      avatar: "/placeholder.svg?height=40&width=40",
      tasksCompleted: 24,
      currentProject: "Website Redesign",
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria@example.com",
      role: "Desenvolvedora Backend",
      status: "online",
      avatar: "/placeholder.svg?height=40&width=40",
      tasksCompleted: 18,
      currentProject: "Sistema CRM",
    },
    {
      id: 3,
      name: "Pedro Costa",
      email: "pedro@example.com",
      role: "UI/UX Designer",
      status: "offline",
      avatar: "/placeholder.svg?height=40&width=40",
      tasksCompleted: 12,
      currentProject: "App Mobile",
    },
    {
      id: 4,
      name: "Ana Oliveira",
      email: "ana@example.com",
      role: "Product Manager",
      status: "online",
      avatar: "/placeholder.svg?height=40&width=40",
      tasksCompleted: 31,
      currentProject: "Dashboard Analytics",
    },
    {
      id: 5,
      name: "Carlos Lima",
      email: "carlos@example.com",
      role: "DevOps Engineer",
      status: "away",
      avatar: "/placeholder.svg?height=40&width=40",
      tasksCompleted: 15,
      currentProject: "App Mobile",
    },
    {
      id: 6,
      name: "Lucia Ferreira",
      email: "lucia@example.com",
      role: "QA Tester",
      status: "online",
      avatar: "/placeholder.svg?height=40&width=40",
      tasksCompleted: 22,
      currentProject: "Website Redesign",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "Online"
      case "away":
        return "Ausente"
      case "offline":
        return "Offline"
      default:
        return "Desconhecido"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipe</h1>
          <p className="text-gray-600">Gerencie os membros da sua equipe</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Membro
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{member.name}</CardTitle>
                  <CardDescription className="truncate">{member.role}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant={member.status === "online" ? "default" : "secondary"}>
                  {getStatusText(member.status)}
                </Badge>
                <span className="text-sm text-gray-600">{member.tasksCompleted} tarefas</span>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Projeto atual:</p>
                <p className="text-sm font-medium">{member.currentProject}</p>
              </div>

              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  <Mail className="mr-1 h-3 w-3" />
                  Email
                </Button>
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  <MessageCircle className="mr-1 h-3 w-3" />
                  Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
