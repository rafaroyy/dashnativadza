"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Calendar, MessageCircle, UserMinus } from "lucide-react"
import { dbOperations, type User, type Task } from "@/lib/supabase"
import { ChatModal } from "./chat-modal"

interface MemberProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User
  currentUserId: string
  onRemove?: (userId: string) => void
  canRemove?: boolean
}

export function MemberProfileModal({
  open,
  onOpenChange,
  user,
  currentUserId,
  onRemove,
  canRemove = false,
}: MemberProfileModalProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)

  useEffect(() => {
    if (open && user.id) {
      loadUserTasks()
    }
  }, [open, user.id])

  const loadUserTasks = async () => {
    setLoading(true)
    try {
      const allTasks = await dbOperations.getTasks()
      const userTasks = allTasks.filter((task) => task.assignee_id === user.id)
      setTasks(userTasks)
    } catch (error) {
      console.error("Error loading user tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter((task) => task.status === "done").length
    const inProgress = tasks.filter((task) => task.status === "in_progress").length
    const todo = tasks.filter((task) => task.status === "todo").length

    return { total, completed, inProgress, todo }
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

  const stats = getTaskStats()

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] h-[600px] flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.profile_image_url || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="text-lg">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-xl">{user.name}</DialogTitle>
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className={`w-2 h-2 rounded-full ${user.online_status ? "bg-green-500" : "bg-gray-400"}`} />
                    <span className="text-sm text-muted-foreground">{user.online_status ? "Online" : "Offline"}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {currentUserId !== user.id && (
                  <Button variant="outline" size="sm" onClick={() => setChatOpen(true)}>
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Chat
                  </Button>
                )}
                {canRemove && currentUserId !== user.id && (
                  <Button variant="outline" size="sm" onClick={() => onRemove?.(user.id)}>
                    <UserMinus className="h-4 w-4 mr-1" />
                    Remover
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="overview" className="h-full flex flex-col">
              <TabsList className="mx-6 mt-4">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="tasks">Tarefas ({tasks.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="flex-1 px-6 pb-6">
                <div className="space-y-6">
                  {/* User Stats */}
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

                  <Separator />

                  {/* User Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Informações</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          Membro desde {new Date(user.created_at).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
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
                      <p className="text-muted-foreground">Nenhuma tarefa atribuída</p>
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
                            {task.project && (
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: task.project.color }} />
                                <span className="text-sm text-muted-foreground">{task.project.name}</span>
                              </div>
                            )}
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

      <ChatModal open={chatOpen} onOpenChange={setChatOpen} user={user} currentUserId={currentUserId} />
    </>
  )
}
