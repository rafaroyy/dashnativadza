"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"

// This component is now a placeholder as its functionality depends on state management
export default function RecentActivity() {
  return (
    <Card className="digitalz-card">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Activity className="w-6 h-6 mr-3 text-digitalz-cyan" />
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">O feed de atividades recentes da equipe será exibido aqui.</p>
      </CardContent>
    </Card>
  )
}
