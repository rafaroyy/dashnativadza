"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserPlus, Search } from "lucide-react"
import { dbOperations, type User } from "@/lib/supabase"

interface AddMemberModalProps {
  type: "workspace" | "project"
  targetId: string // workspace_id or project_id
  onMemberAdded?: () => void
}

export function AddMemberModal({ type, targetId, onMemberAdded }: AddMemberModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUserId, setSelectedUserId] = useState("")
  const [selectedRole, setSelectedRole] = useState("member")

  useEffect(() => {
    if (open) {
      loadUsers()
    }
  }, [open])

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [searchTerm, users])

  const loadUsers = async () => {
    try {
      const usersData = await dbOperations.getUsers()
      setUsers(usersData)
      setFilteredUsers(usersData)
    } catch (error) {
      console.error("Error loading users:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUserId || !targetId) return

    setLoading(true)
    try {
      const memberData = {
        user_id: selectedUserId,
        role: selectedRole,
        ...(type === "workspace" ? { workspace_id: targetId } : { project_id: targetId }),
      }

      if (type === "workspace") {
        await dbOperations.addWorkspaceMember(memberData)
      } else {
        await dbOperations.addProjectMember(memberData)
      }

      setSelectedUserId("")
      setSelectedRole("member")
      setSearchTerm("")
      setOpen(false)
      onMemberAdded?.()
    } catch (error) {
      console.error("Error adding member:", error)
    } finally {
      setLoading(false)
    }
  }

  const roleOptions = [
    { value: "member", label: "Membro" },
    { value: "admin", label: "Administrador" },
    { value: "owner", label: "Proprietário" },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Adicionar Membro
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Membro ao {type === "workspace" ? "Workspace" : "Projeto"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Buscar Usuário</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digite o nome ou email do usuário"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Selecionar Usuário *</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um usuário" />
              </SelectTrigger>
              <SelectContent>
                {filteredUsers.length === 0 ? (
                  <SelectItem value="no-users" disabled>
                    {searchTerm ? "Nenhum usuário encontrado" : "Nenhum usuário disponível"}
                  </SelectItem>
                ) : (
                  filteredUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={user.profile_image_url || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Função</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma função" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !selectedUserId}>
              {loading ? "Adicionando..." : "Adicionar Membro"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
