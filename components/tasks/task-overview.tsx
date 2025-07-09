"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, AlertTriangle, Calendar, CheckSquare } from "lucide-react"

const urgentTasks = [
  {
    id: 1,
    title: "Finalizar campanha de lançamento",
    project: "Marketing Digital",
    priority: "Alta",
    dueDate: "2025-01-08",
    status: "Em andamento",
  },
  {
    id: 2,
    title: "Review do código da API",
    project: "Desenvolvimento",
    priority: "Média",
    dueDate: "2025-01-09",
    status: "Pendente",
  },
  {
    id: 3,
    title: "Criar mockups da landing page",
    project: "Design",
    priority: "Alta",
    dueDate: "2025-01-10",
    status: "Em andamento",
  },
]

const todayTasks = [
  {
    id: 4,
    title: "Reunião de planejamento semanal",
    project: "Geral",
    time: "09:00",
    status: "Agendado",
  },
  {
    id: 5,
    title: "Análise de métricas do mês",
    project: "Marketing Digital",
    time: "14:00",
    status: "Pendente",
  },
  {
    id: 6,
    title: "Deploy da versão 2.1",
    project: "Desenvolvimento",
    time: "16:30",
    status: "Concluído",
  },
]

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

const getStatusColor = (status: string) => {
  switch (status) {
    case "Concluído":
      return "bg-green-500/20 text-green-400 border-green-500/30"
    case "Em andamento":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    case "Pendente":
      return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    case "Agendado":
      return "bg-[#00FFD1]/20 text-[#00FFD1] border-[#00FFD1]/30"
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30"
  }
}

export default function TaskOverview() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Visão Geral das Tarefas */}
      <Card className="digitalz-card">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <CheckSquare className="w-6 h-6 mr-3 text-digitalz-cyan" />
            Visão Geral das Tarefas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">Um resumo das tarefas urgentes e da agenda do dia será exibido aqui.</p>
        </CardContent>
      </Card>

      {/* Tarefas Urgentes */}
      <Card className="bg-[#1a2a2a]/80 backdrop-blur-lg border-[#00FFD1]/20">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
            Tarefas Urgentes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {urgentTasks.map((task) => (
            <div
              key={task.id}
              className="p-3 rounded-lg bg-[#2a3a3a]/50 border border-[#00FFD1]/10 hover:border-[#00FFD1]/20 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-white text-sm">{task.title}</h4>
                <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{task.project}</span>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                  </div>
                  <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            className="w-full border-[#00FFD1]/20 text-[#00FFD1] hover:bg-[#00FFD1]/10 bg-transparent"
          >
            Ver todas as tarefas urgentes
          </Button>
        </CardContent>
      </Card>

      {/* Agenda de Hoje */}
      <Card className="bg-[#1a2a2a]/80 backdrop-blur-lg border-[#00FFD1]/20">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Clock className="w-5 h-5 mr-2 text-[#00FFD1]" />
            Agenda de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {todayTasks.map((task) => (
            <div
              key={task.id}
              className="p-3 rounded-lg bg-[#2a3a3a]/50 border border-[#00FFD1]/10 hover:border-[#00FFD1]/20 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-white text-sm">{task.title}</h4>
                <span className="text-xs text-[#00FFD1] font-mono">{task.time}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{task.project}</span>
                <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            className="w-full border-[#00FFD1]/20 text-[#00FFD1] hover:bg-[#00FFD1]/10 bg-transparent"
          >
            Ver agenda completa
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
