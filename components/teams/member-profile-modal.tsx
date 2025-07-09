"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Mail, Phone, MapPin, Calendar, MessageCircle, Edit, UserCheck, Clock } from "lucide-react"
import type { User } from "@/lib/supabase"

interface MemberProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: User
  onEdit?: (member: User) => void
  onMessage?: (member: User) => void
}

export function MemberProfileModal({ open, onOpenChange, member, onEdit, onMessage }: MemberProfileModalProps) {
  const [loading, setLoading] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusColor = (online: boolean) => {
    return online ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  }

  const getStatusText = (online: boolean) => {
    return online ? "Online" : "Offline"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Perfil do Membro</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={member.profile_image_url || "/placeholder.svg"} alt={member.name} />
              <AvatarFallback className="text-lg">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{member.name}</h2>
              {member.role && <p className="text-muted-foreground text-lg">{member.role}</p>}
              <div className="flex items-center space-x-2 mt-2">
                <Badge className={getStatusColor(member.online_status || false)}>
                  {getStatusText(member.online_status || false)}
                </Badge>
                {member.online_status && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                    Ativo agora
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações de Contato</h3>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">{member.email}</p>
                </div>
              </div>

              {member.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Telefone</p>
                    <p className="text-muted-foreground">{member.phone}</p>
                  </div>
                </div>
              )}

              {member.location && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Localização</p>
                    <p className="text-muted-foreground">{member.location}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Membro desde</p>
                  <p className="text-muted-foreground">{formatDate(member.created_at)}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Activity Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Status de Atividade</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <UserCheck className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">Ativo</div>
                <div className="text-xs text-muted-foreground">Status</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{member.updated_at ? formatDate(member.updated_at) : "N/A"}</div>
                <div className="text-xs text-muted-foreground">Última atividade</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {onMessage && (
              <Button onClick={() => onMessage(member)} className="flex-1" disabled={loading}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Enviar Mensagem
              </Button>
            )}
            {onEdit && (
              <Button variant="outline" onClick={() => onEdit(member)} disabled={loading}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
