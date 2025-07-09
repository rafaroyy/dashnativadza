"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, FolderPlus, Users, Calendar, FileText, Settings } from "lucide-react"

const quickActions = [
  {
    name: "Nova Tarefa",
    description: "Criar uma nova tarefa",
    icon: Plus,
    color: "from-[#00FFD1] to-[#00b8a3]",
    textColor: "text-black",
  },
  {
    name: "Novo Projeto",
    description: "Iniciar um novo projeto",
    icon: FolderPlus,
    color: "from-blue-500 to-blue-600",
    textColor: "text-white",
  },
  {
    name: "Convidar Equipe",
    description: "Adicionar membros",
    icon: Users,
    color: "from-purple-500 to-purple-600",
    textColor: "text-white",
  },
  {
    name: "Agendar Reunião",
    description: "Marcar uma reunião",
    icon: Calendar,
    color: "from-green-500 to-green-600",
    textColor: "text-white",
  },
  {
    name: "Relatório",
    description: "Gerar relatório",
    icon: FileText,
    color: "from-orange-500 to-orange-600",
    textColor: "text-white",
  },
  {
    name: "Configurações",
    description: "Ajustar preferências",
    icon: Settings,
    color: "from-gray-500 to-gray-600",
    textColor: "text-white",
  },
]

export default function QuickActions() {
  return (
    <Card className="bg-[#1a2a2a]/80 backdrop-blur-lg border-[#00FFD1]/20">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Ações Rápidas</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => {
            const IconComponent = action.icon
            return (
              <Button
                key={action.name}
                variant="outline"
                className={`
                  h-auto p-4 flex flex-col items-center space-y-2 
                  bg-gradient-to-br ${action.color} 
                  border-0 hover:scale-105 transition-all duration-300
                  ${action.textColor}
                `}
              >
                <IconComponent className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-medium text-sm">{action.name}</div>
                  <div className="text-xs opacity-80">{action.description}</div>
                </div>
              </Button>
            )
          })}
          {/* Placeholder for additional actions */}
          <Button className="digitalz-button">
            <Plus className="w-4 h-4 mr-2" />
            Ação Rápida
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
