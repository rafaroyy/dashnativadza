"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, CheckCircle, Clock, AlertCircle, Edit, Trash2 } from "lucide-react"
import { dbOperations, type Project, type Task, type ProjectMember } from "@/lib/supabase"

interface ProjectDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project
  onEdit?: (project: Project) => void
  onDelete?: (projectId: string) => void
}

export function ProjectDetailsModal({ open, onOpenChange, project, onEdit, onDelete }: ProjectDetailsModalProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [members, setMembers] = useState<ProjectMember[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && project.id) {
      loadProjectData()
    }
  }, [open, project.id])

  const loadProjectData = async () => {
    setLoading(true)
    try {
      const [tasksData, membersData] = await Promise.all([
        dbOperations.getTasksByProject(project.id),
        dbOperations.getProjectMembers(project.id),
      ])
      setTasks(tasksData)
      setMembers(membersData)
    } catch (error) {
      console.error("Error loading project data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      todo: { label: "A Fazer", variant: "secondary" as const },
      in_progress: { label: "Em Progresso", variant: "default" as const },
      done: { label: "Concluído", variant: "default" as const },
    }
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.todo
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { label: "Baixa", variant: "secondary" as const },
      medium: { label: "Média", variant: "default" as const },
      high: { label: "Alta", variant: "destructive" as const },
    }
    return priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium
  }

  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter((task) => task.status === "done").length
    const inProgress = tasks.filter((task) => task.status === "in_progress").length
    const todo = tasks.filter((task) => task.status === "todo").length

    return { total, completed, inProgress, todo }
  }

  const stats = getTaskStats()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] h-[600px] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: project.color }} />
              <DialogTitle className="text-xl">{project.name}</DialogTitle>
              <Badge variant="outline">{project.status}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => onEdit?.(project)}>
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDelete?.(project.id)}>
                <Trash2 className="h-4 w-4 mr-1" />
                Excluir
              </Button>
            </div>
          </div>
          {project.description && <p className="text-sm text-muted-foreground mt-2">{project.description}</p>}
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="overview" className="h-full flex flex-col">
            <TabsList className="mx-6 mt-4">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="tasks">Tarefas ({tasks.length})</TabsTrigger>
              <TabsTrigger value="members">Membros ({members.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="flex-1 px-6 pb-6">
              <div className="space-y-6">
                {/* Project Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats.todo}</div>
                    <div className="text-sm text-muted-foreground">A Fazer</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
                    <div className="text-sm text-muted-foreground">Em Progresso</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                    <div className="text-sm text-muted-foreground">Concluído</div>
                  </div>
                </div>

                {/* Recent Tasks */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Tarefas Recentes</h3>
                  <div className="space-y-2">
                    {tasks.slice(0, 5).map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            {task.status === "done" ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : task.status === "in_progress" ? (
                              <Clock className="h-4 w-4 text-yellow-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-blue-600" />
                            )}
                            <span className="font-medium">{task.title}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge {...getPriorityBadge(task.priority)}>{getPriorityBadge(task.priority).label}</Badge>
                          {task.assignee && (
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={task.assignee.profile_image_url || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">
                                {task.assignee.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="flex-1">
              <ScrollArea className="h-full px-6 pb-6">
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhuma tarefa encontrada</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div key={task.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{task.title}</h4>
                            {task.description && (
                              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                            )}
                            <div className="flex items-center space-x-4 mt-3">
                              <Badge {...getStatusBadge(task.status)}>{getStatusBadge(task.status).label}</Badge>
                              <Badge {...getPriorityBadge(task.priority)}>
                                {getPriorityBadge(task.priority).label}
                              </Badge>
                              {task.due_date && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {new Date(task.due_date).toLocaleDateString("pt-BR")}
                                </div>
                              )}
                            </div>
                          </div>
                          {task.assignee && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={task.assignee.profile_image_url || "/placeholder.svg"} />
                              <AvatarFallback>
                                {task.assignee.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="members" className="flex-1">
              <ScrollArea className="h-full px-6 pb-6">
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : members.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum membro encontrado</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.user?.profile_image_url || "/placeholder.svg"} />
                            <AvatarFallback>
                              {member.user?.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.user?.name}</p>
                            <p className="text-sm text-muted-foreground">{member.user?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{member.role}</Badge>
                          {member.user?.online_status && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
