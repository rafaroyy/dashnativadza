"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Mail, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"

interface User {
  id: string
  name: string
  email: string
  role?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export default function TeamsClient() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const supabase = createClient()
    const load = async () => {
      try {
        const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })
        if (error) throw error
        setUsers(data || [])
      } catch (err) {
        console.error(err)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os membros da equipe",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [toast])

  const handleDelete = async (id: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("users").delete().eq("id", id)
      if (error) throw error
      setUsers((u) => u.filter((x) => x.id !== id))
      toast({ title: "Sucesso", description: "Membro removido" })
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível remover o membro",
        variant: "destructive",
      })
    }
  }

  const initials = (n: string) =>
    n
      .split(" ")
      .map((i) => i[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

  if (loading)
    return (
      <div className="p-6">
        <p className="animate-pulse text-muted-foreground">Carregando...</p>
      </div>
    )

  return (
    <div className="p-6 space-y-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipe</h1>
          <p className="text-muted-foreground">Gerencie os membros da sua equipe</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Convidar Membro
        </Button>
      </div>

      {/* grid */}
      {users.length === 0 ? (
        <Card>
          <CardContent className="py-12 flex flex-col items-center">
            <p className="mb-4 text-muted-foreground">Nenhum membro encontrado</p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Convidar primeiro membro
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((u) => (
            <Card key={u.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={u.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>{initials(u.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{u.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {u.email}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(u.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {u.role && (
                  <Badge variant="secondary" className="mb-2">
                    {u.role}
                  </Badge>
                )}
                <p className="text-xs text-muted-foreground">
                  Membro desde {new Date(u.created_at).toLocaleDateString("pt-BR")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
