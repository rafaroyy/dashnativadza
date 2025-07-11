"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Calendar, Users, MoreHorizontal } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface Project {
  id: string
  name: string
  description?: string
  status: string
  progress: number
  created_at: string
}

export default function ProjectsClient() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const supabase = createClient()
    const load = async () => {
      try {
        const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })
        if (error) throw error
        setProjects(data || [])
      } catch (err) {
        console.error(err)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os projetos",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [toast])

  const statusColor = (s: string) =>
    ({
      ativo: "bg-green-500",
      pausado: "bg-yellow-500",
      concluído: "bg-blue-500",
    })[s.toLowerCase()] || "bg-gray-500"

  if (loading)
    return (
      <div className="p-6">
        <p className="animate-pulse text-muted-foreground">Carregando...</p>
      </div>
    )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
          <p className="text-muted-foreground">Gerencie todos os seus projetos</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <p className="text-muted-foreground mb-4">Nenhum projeto encontrado</p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Criar primeiro projeto
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Card key={p.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{p.name}</CardTitle>
                    <CardDescription className="mt-1">{p.description || "Sem descrição"}</CardDescription>
                  </div>
                  <Button size="sm" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${statusColor(p.status)}`} />
                    {p.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{p.progress}% concluído</span>
                </div>
                <Progress value={p.progress} />

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(p.created_at).toLocaleDateString("pt-BR")}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />0 membros
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
