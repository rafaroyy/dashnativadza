"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { FolderOpen } from "lucide-react"

export default function SpaceGrid() {
  return (
    <Card className="digitalz-card">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <FolderOpen className="w-6 h-6 mr-3 text-digitalz-cyan" />
          Espaços
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">A grade de espaços de trabalho será exibida aqui.</p>
      </CardContent>
    </Card>
  )
}
