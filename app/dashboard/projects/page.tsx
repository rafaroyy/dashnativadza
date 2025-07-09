import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { FolderOpen } from "lucide-react"

export default function ProjectsPage() {
  return (
    <Card className="digitalz-card">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <FolderOpen className="w-6 h-6 mr-3 text-digitalz-cyan" />
          Projetos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">A área de gerenciamento de projetos será implementada aqui.</p>
      </CardContent>
    </Card>
  )
}
