"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { AddMemberModal } from "@/components/teams/add-member-modal"
import { MemberProfileModal } from "@/components/teams/member-profile-modal"
import { ChatModal } from "@/components/teams/chat-modal"
import { Plus, Mail, Phone, MapPin, MessageCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  phone: string
  location: string
  profile_image_url: string
  online_status: boolean
  created_at: string
}

export default function TeamsPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [chatMember, setChatMember] = useState<TeamMember | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      setError(null)
      const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

      if (error) throw error
      if (data) setTeamMembers(data)
    } catch (error: any) {
      console.error("Error fetching team members:", error)
      setError("Erro ao carregar membros da equipe: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleMemberAdded = async (newMember: any) => {
    try {
      setError(null)
      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            name: newMember.name,
            email: newMember.email,
            role: newMember.role,
            phone: newMember.phone,
            location: newMember.location,
            online_status: false,
          },
        ])
        .select()

      if (error) throw error
      if (data && data[0]) {
        setTeamMembers([data[0], ...teamMembers])
      }
    } catch (error: any) {
      console.error("Error adding member:", error)
      setError("Erro ao adicionar membro: " + error.message)
    }
  }

  const handleMemberUpdate = async (updatedMember: TeamMember) => {
    try {
      setError(null)
      const { data, error } = await supabase
        .from("users")
        .update({
          name: updatedMember.name,
          email: updatedMember.email,
          role: updatedMember.role,
          phone: updatedMember.phone,
          location: updatedMember.location,
          online_status: updatedMember.online_status,
        })
        .eq("id", updatedMember.id)
        .select()

      if (error) throw error
      if (data && data[0]) {
        setTeamMembers(teamMembers.map((m) => (m.id === updatedMember.id ? data[0] : m)))
      }
    } catch (error: any) {
      console.error("Error updating member:", error)
      setError("Erro ao atualizar membro: " + error.message)
    }
  }

  const getStatusColor = (status: boolean) => {
    return status ? "bg-green-500" : "bg-gray-500"
  }

  const getStatusText = (status: boolean) => {
    return status ? "Online" : "Offline"
  }

  // Calcular contadores dinâmicos
  const onlineCount = teamMembers.filter((m) => m.online_status).length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ml-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 ml-64">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Equipe</h1>
          <p className="text-muted-foreground">Gerencie os membros da sua equipe</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Membro
        </Button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Online Agora</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onlineCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.profile_image_url || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(member.online_status)}`}
                  />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setChatMember(member)}>
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline">Equipe</Badge>
                <Badge className={getStatusColor(member.online_status)}>{getStatusText(member.online_status)}</Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{member.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{member.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{member.location}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div className="text-center">
                  <div className="text-lg font-semibold">0</div>
                  <div className="text-xs text-muted-foreground">Tarefas</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">0</div>
                  <div className="text-xs text-muted-foreground">Projetos</div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => setSelectedMember(member)}
                >
                  Perfil
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => setChatMember(member)}
                >
                  Mensagem
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {teamMembers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Nenhum membro encontrado</p>
          <Button onClick={() => setShowAddModal(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Primeiro Membro
          </Button>
        </div>
      )}

      <AddMemberModal open={showAddModal} onOpenChange={setShowAddModal} onMemberAdded={handleMemberAdded} />

      {selectedMember && (
        <MemberProfileModal
          open={!!selectedMember}
          onOpenChange={() => setSelectedMember(null)}
          member={selectedMember}
          onMemberUpdate={handleMemberUpdate}
        />
      )}

      {chatMember && <ChatModal open={!!chatMember} onOpenChange={() => setChatMember(null)} member={chatMember} />}
    </div>
  )
}
