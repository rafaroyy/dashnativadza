import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Calendar } from "lucide-react"

export default function CalendarPage() {
  return (
    <Card className="digitalz-card">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Calendar className="w-6 h-6 mr-3 text-digitalz-cyan" />
          Calendário
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">A visualização de calendário com tarefas e eventos será implementada aqui.</p>
      </CardContent>
    </Card>
  )
}
