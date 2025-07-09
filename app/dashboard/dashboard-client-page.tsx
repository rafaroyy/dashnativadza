"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import CreateTaskModal from "@/components/tasks/create-task-modal"
import { Toaster } from "@/components/ui/sonner"

// Tipagem para os dados recebidos
type Task = { id: string; title: string; status: string; priority: string; due_date: string | null }
type Space = { id: string; name: string; color: string; tasks: Task[] }
type Workspace = { id: string; name: string; spaces: Space[] }

interface DashboardClientPageProps {
  initialWorkspaces: Workspace[]
}

export default function DashboardClientPage({ initialWorkspaces }: DashboardClientPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [workspaces] = useState<Workspace[]>(initialWorkspaces)

  // Apenas para o modal, pegamos todos os espaços de todos os workspaces
  const allSpaces = workspaces.flatMap((w) => w.spaces.map((s) => ({ id: s.id, name: s.name })))

  return (
    <div className="space-y-6">
      <Toaster richColors />
      <CreateTaskModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} spaces={allSpaces} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">Visão geral dos seus projetos e tarefas.</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-digitalz-cyan text-black hover:bg-digitalz-cyan-light"
        >
          <Plus className="w-4 h-4 mr-2" />
          Criar Tarefa
        </Button>
      </div>

      {/* Aqui viriam os outros componentes da dashboard, como SpaceGrid, TaskOverview, etc. */}
      {/* Eles receberiam os dados de 'workspaces' como props */}
      <div className="text-white">
        <h2 className="text-xl mb-4">Workspaces</h2>
        {workspaces.map((workspace) => (
          <div
            key={workspace.id}
            className="mb-6 p-4 bg-digitalz-dark-secondary rounded-lg border border-digitalz-border"
          >
            <h3 className="text-lg font-semibold text-digitalz-cyan">{workspace.name}</h3>
            <div className="mt-2">
              <h4 className="font-medium">Espaços:</h4>
              {workspace.spaces.map((space) => (
                <div key={space.id} className="ml-4 mt-2 p-2 bg-digitalz-gray rounded">
                  <p>{space.name}</p>
                  <ul className="list-disc list-inside ml-4 text-sm text-gray-300">
                    {space.tasks.map((task) => (
                      <li key={task.id}>
                        {task.title} ({task.status})
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
