"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Clock, Users } from "lucide-react"

const mockEvents = [
  {
    id: 1,
    title: "Reunião de Planejamento",
    date: "2025-01-08",
    time: "09:00",
    duration: "1h",
    type: "Reunião",
    attendees: 5,
    priority: "Alta",
  },
  {
    id: 2,
    title: "Review de Código",
    date: "2025-01-08",
    time: "14:00",
    duration: "30min",
    type: "Desenvolvimento",
    attendees: 3,
    priority: "Média",
  },
  {
    id: 3,
    title: "Apresentação para Cliente",
    date: "2025-01-09",
    time: "10:00",
    duration: "2h",
    type: "Apresentação",
    attendees: 8,
    priority: "Alta",
  },
  {
    id: 4,
    title: "Sprint Planning",
    date: "2025-01-10",
    time: "09:00",
    duration: "2h",
    type: "Planejamento",
    attendees: 6,
    priority: "Alta",
  },
]

export default function CalendarPage() {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Reunião":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "Desenvolvimento":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Apresentação":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "Planejamento":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "Média":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Baixa":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const todayEvents = mockEvents.filter((event) => event.date === "2025-01-08")
  const upcomingEvents = mockEvents.filter((event) => event.date > "2025-01-08")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Calendário</h1>
        <Button className="digitalz-button">
          <Plus className="w-4 h-4 mr-2" />
          Novo Evento
        </Button>
      </div>

      {/* Calendar Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="digitalz-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-digitalz-text-secondary">Eventos Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-digitalz-cyan" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-digitalz-cyan">{todayEvents.length}</div>
            <p className="text-xs text-digitalz-text-secondary">Agendados para hoje</p>
          </CardContent>
        </Card>

        <Card className="digitalz-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-digitalz-text-secondary">Próximos Eventos</CardTitle>
            <Clock className="h-4 w-4 text-digitalz-cyan" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-digitalz-cyan">{upcomingEvents.length}</div>
            <p className="text-xs text-digitalz-text-secondary">Nos próximos dias</p>
          </CardContent>
        </Card>

        <Card className="digitalz-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-digitalz-text-secondary">Total de Participantes</CardTitle>
            <Users className="h-4 w-4 text-digitalz-cyan" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-digitalz-cyan">
              {mockEvents.reduce((acc, event) => acc + event.attendees, 0)}
            </div>
            <p className="text-xs text-digitalz-text-secondary">Em todos os eventos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Events */}
        <Card className="digitalz-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-digitalz-cyan" />
              Eventos de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayEvents.length > 0 ? (
              todayEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-lg bg-digitalz-gray border border-digitalz-border hover:border-digitalz-cyan/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-white">{event.title}</h4>
                    <Badge className={getPriorityColor(event.priority)}>{event.priority}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-digitalz-text-secondary mb-2">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {event.time} ({event.duration})
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {event.attendees} pessoas
                    </div>
                  </div>
                  <Badge className={getTypeColor(event.type)}>{event.type}</Badge>
                </div>
              ))
            ) : (
              <p className="text-digitalz-text-secondary text-center py-4">Nenhum evento agendado para hoje</p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="digitalz-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Clock className="w-5 h-5 mr-2 text-digitalz-cyan" />
              Próximos Eventos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 rounded-lg bg-digitalz-gray border border-digitalz-border hover:border-digitalz-cyan/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-white">{event.title}</h4>
                  <Badge className={getPriorityColor(event.priority)}>{event.priority}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-digitalz-text-secondary mb-2">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(event.date).toLocaleDateString("pt-BR")} às {event.time}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {event.attendees} pessoas
                  </div>
                </div>
                <Badge className={getTypeColor(event.type)}>{event.type}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
