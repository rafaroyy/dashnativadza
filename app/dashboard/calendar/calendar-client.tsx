"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Task {
  id: string
  title: string
  due_date: string | null
  status: string
}

export default function CalendarClient({ tasks }: { tasks: Task[] }) {
  const [selected, setSelected] = useState<Date | null>(null)

  const tasksByDay = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    if (!task.due_date) return acc
    const key = new Date(task.due_date).toDateString()
    acc[key] = acc[key] ? [...acc[key], task] : [task]
    return acc
  }, {})

  return (
    <div className="p-6 ml-64 space-y-6">
      <Card>
        <CardHeader className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          <CardTitle>Calendário</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Clique em um dia para ver as tarefas agendadas.</p>

          {/* Calendário mínimo (apenas lista por dia) */}
          {Object.entries(tasksByDay).map(([day, list]) => (
            <div key={day} className="mb-4 cursor-pointer" onClick={() => setSelected(new Date(day))}>
              <h4 className="font-medium">{new Date(day).toLocaleDateString("pt-BR")}</h4>
              <p className="text-sm text-muted-foreground">{list.length} tarefa(s)</p>
            </div>
          ))}

          {selected && (
            <>
              <h3 className="mt-6 font-semibold">
                Tarefas em{" "}
                {selected.toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                })}
              </h3>
              <div className="space-y-3 mt-2">
                {(tasksByDay[selected.toDateString()] || []).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <span>{task.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
