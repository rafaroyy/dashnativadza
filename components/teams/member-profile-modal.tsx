"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Calendar, MessageCircle, Edit } from "lucide-react"

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  phone: string
  location: string
  profile_image_url: string
  online_status: boolean
  created_at: string
}

interface MemberProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: TeamMember
  onStartChat?: (member: TeamMember) => void
  onEditMember?: (member: TeamMember) => void
}

export function MemberProfileModal({ open, onOpenChange, member, onStartChat, onEditMember }: MemberProfileModalProps) {
  const [activeTab, setActiveTab] = useState("profile")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Mock data for demonstration
  const memberStats = {
    tasksCompleted: 24,
    tasksInProgress: 3,
    projectsActive: 2,
    teamCollaborations: 8,
  }

  const recentActivity = [
    {
      id: 1,
      action: "Concluiu a tarefa",
      target: "Implementar autenticação",
      time: "2 horas atrás",
      type: "task",
    },
    {
      id: 2,
      action: "Comentou no projeto",
      target: "Sistema de Gestão",
      time: "1 dia atrás",
      type: "comment",
    },
    {
      id: 3,
      action: "Iniciou trabalho na tarefa",
      target: "Criar dashboard",
      time: "2 dias atrás",
      type: "task",
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={member.profile_image_url || "/placeholder.svg"} alt={member.name} />
              <AvatarFallback className="text-lg">{getInitials(member.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-xl">{member.name}</DialogTitle>
              <p className="text-muted-foreground">{member.role}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant={member.online_status ? "default" : "secondary"}>
                  {member.online_status ? "Online" : "Offline"}
                </Badge>
              </div>
            </div>
            <div className="flex space-x-2">
              {onStartChat && (
                <Button variant="outline" size="sm" onClick={() => onStartChat(member)}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat
                </Button>
              )}
              {onEditMember && (
                <Button variant="outline" size="sm" onClick={() => onEditMember(member)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="activity">Atividade</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{member.email}</span>
                </div>
                {member.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{member.phone}</span>
                  </div>
                )}
                {member.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{member.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Membro desde {formatDate(member.created_at)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sobre</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {member.role} experiente com foco em desenvolvimento de soluções inovadoras e trabalho em equipe.
                  Sempre buscando aprender novas tecnologias e contribuir para o sucesso dos projetos.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Atividade Recente</CardTitle>
                <CardDescription>Últimas ações realizadas pelo membro</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b last:border-b-0">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">{activity.action}</span>{" "}
                          <span className="text-primary">{activity.target}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Tarefas Concluídas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{memberStats.tasksCompleted}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{memberStats.tasksInProgress}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{memberStats.projectsActive}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Colaborações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{memberStats.teamCollaborations}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance</CardTitle>
                <CardDescription>Métricas de desempenho do membro</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Taxa de Conclusão</span>
                    <span className="text-sm text-green-600 font-medium">89%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Pontualidade</span>
                    <span className="text-sm text-blue-600 font-medium">95%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Qualidade</span>
                    <span className="text-sm text-purple-600 font-medium">92%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
