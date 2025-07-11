"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Mail, Phone, MapPin, Calendar, Edit } from "lucide-react"

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

interface MemberProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: TeamMember
  onMemberUpdate: (member: TeamMember) => void
}

export function MemberProfileModal({ open, onOpenChange, member, onMemberUpdate }: MemberProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    location: "",
    online_status: false,
  })

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        email: member.email,
        role: member.role,
        phone: member.phone,
        location: member.location,
        online_status: member.online_status,
      })
    }
  }, [member])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const updatedMember: TeamMember = {
      ...member,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      phone: formData.phone,
      location: formData.location,
      online_status: formData.online_status,
    }

    onMemberUpdate(updatedMember)
    setIsEditing(false)
  }

  const getStatusColor = (status: boolean) => {
    return status ? "bg-green-500" : "bg-gray-500"
  }

  const getStatusText = (status: boolean) => {
    return status ? "Online" : "Offline"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>{isEditing ? "Editar Perfil" : "Perfil do Membro"}</DialogTitle>
              <DialogDescription>
                {isEditing ? "Faça alterações no perfil" : "Informações detalhadas do membro"}
              </DialogDescription>
            </div>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </DialogHeader>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Função</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="online_status">Status Online</Label>
                <Switch
                  id="online_status"
                  checked={formData.online_status}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, online_status: checked }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Salvar Alterações
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="py-4 space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={member.profile_image_url || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback className="text-lg">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${getStatusColor(member.online_status)}`}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">Equipe</Badge>
                  <Badge className={getStatusColor(member.online_status)}>{getStatusText(member.online_status)}</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{member.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{member.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{member.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Entrou em {new Date(member.created_at).toLocaleDateString("pt-BR")}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Tarefas Concluídas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Projetos Ativos</div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
