"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AddMemberModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onMemberAdded: (member: any) => void
}

export function AddMemberModal({ open, onOpenChange, onMemberAdded }: AddMemberModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    location: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onMemberAdded(formData)
    onOpenChange(false)

    setFormData({
      name: "",
      email: "",
      role: "",
      phone: "",
      location: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Membro</DialogTitle>
          <DialogDescription>Convide um novo membro para sua equipe</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Digite o nome completo"
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
                placeholder="email@exemplo.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Função</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                placeholder="Ex: Desenvolvedor"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+55 11 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="São Paulo, SP"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Adicionar Membro
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
