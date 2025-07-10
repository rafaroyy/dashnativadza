"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User } from "lucide-react"
import type { Task } from "@/lib/supabase"

interface CalendarClientProps {
  tasks: Task[]
}

export default function CalendarClient({ tasks }: CalendarClientProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  // Agrupar tarefas por data
  const tasksByDate = tasks.reduce(
    (acc, task) => {
      if (task.due_date) {
        const date = new Date(task.due_date).toDateString()
        if (!acc[date]) {
          acc[date] = []
        }
        acc[date].push(task)
      }
      return acc
    },
    {} as Record<string, Task[]>,
  )

  // Gerar dias do mês atual
  const currentMonth = selectedDate.getMonth()
  const currentYear = selectedDate.getFullYear()
  const firstDay = new Date(currentYear, currentMonth, 1)
  const lastDay = new Date(currentYear, currentMonth + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const days = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  const selectedDateTasks = tasksByDate[selectedDate.toDateString()] || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendário</h1>
        <p className="text-muted-foreground">Visualize suas tarefas e prazos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {monthNames[currentMonth]} {currentYear}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {dayNames.map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                if (day === null) {
                  return <div key={index} className="p-2" />
                }

                const date = new Date(currentYear, currentMonth, day)
                const dateString = date.toDateString()
                const dayTasks = tasksByDate[dateString] || []
                const isSelected = selectedDate.toDateString() === dateString
                const isToday = new Date().toDateString() === dateString

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(date)}
                    className={`
                      p-2 text-sm rounded-md transition-colors relative
                      ${isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted"}
                      ${isToday ? "ring-2 ring-primary ring-offset-2" : ""}
                    `}
                  >
                    {day}
                    {dayTasks.length > 0 && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                        <div className="w-1 h-1 bg-blue-500 rounded-full" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tarefas do dia selecionado */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Tarefas do Dia
            </CardTitle>
            <CardDescription>{selectedDate.toLocaleDateString("pt-BR")}</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDateTasks.length === 0 ? (
              <p className="text-muted-foreground text-sm">Nenhuma tarefa para este dia</p>
            ) : (
              <div className="space-y-3">
                {selectedDateTasks.map((task) => (
                  <div key={task.id} className="p-3 border rounded-lg">
                    <h4 className="font-medium">{task.title}</h4>
                    {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={task.priority === "high" ? "destructive" : "secondary"}>{task.priority}</Badge>
                      <Badge variant="outline">{task.status}</Badge>
                      {task.assignee && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          {task.assignee.name}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
