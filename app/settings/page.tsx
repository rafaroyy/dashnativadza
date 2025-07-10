"use client"

import { useEffect } from "react"

import { useState } from "react"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield, Palette, Save } from "lucide-react"
import { dbOperations } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export default function SettingsPage() {
  const [user, setUser] = useState({
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "João Silva",
    email: "joao@digitalz.com",
    phone: "(11) 99999-0001",
    role: "Desenvolvedor",
    location: "São Paulo, SP",
    profile_image_url: "",
    online_status: true,
  })

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      desktop: false,
      taskUpdates: true,
      projectUpdates: true,
      teamMessages: true,
    },
    privacy: {
      profileVisible: true,
      statusVisible: true,
      activityVisible: false,
    },
    appearance: {
      theme: "light",
      language: "pt-BR",
      timezone: "America/Sao_Paulo",
    },
  })

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    setLoading(true)
    try {
      // In a real app, you would fetch the current user's data
      // For now, we'll use the mock data
      setError(null)
    } catch (error: any) {
      console.error("Error loading user data:", error)
      setError("Erro ao carregar dados do usuário")
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const updatedUser = await dbOperations.updateUser(user.id, {
        name: user.name,
        phone: user.phone,
        role: user.role,
        location: user.location,
      })

      if (updatedUser) {
        setUser(updatedUser)
        setSuccess("Perfil atualizado com sucesso!")
      }
    } catch (error: any) {
      console.error("Error updating profile:", error)
      setError("Erro ao atualizar perfil")
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Por favor, selecione uma imagem válida")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("A imagem deve ter no máximo 5MB")
      return
    }

    setSaving(true)
    setError(null)

    try {
      const avatarUrl = await dbOperations.uploadAvatar(file, user.id)
      const updatedUser = await dbOperations.updateUser(user.id, {
        profile_image_url: avatarUrl,
      })

      if (updatedUser) {
        setUser(updatedUser)
        setSuccess("Avatar atualizado com sucesso!")
      }
    } catch (error: any) {
      console.error("Error uploading avatar:", error)
      setError("Erro ao fazer upload do avatar")
    } finally {
      setSaving(false)
    }
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }))
  }

  const handlePrivacyChange = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value,
      },
    }))
  }

  const handleAppearanceChange = (key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [key]: value,
      },
    }))
  }

  const saveSettings = async () => {
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      // In a real app, you would save settings to the database
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      setSuccess("Configurações salvas com sucesso!")
    } catch (error: any) {
      console.error("Error saving settings:", error)
      setError("Erro ao salvar configurações")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ml-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Gerencie suas preferências e configurações da conta</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{success}</div>}

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Cobrança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>Atualize suas informações pessoais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nome</Label>
                  <Input
                    id="firstName"
                    value={user.name.split(" ")[0]}
                    onChange={(e) =>
                      setUser((prev) => ({
                        ...prev,
                        name: `${e.target.value} ${user.name.split(" ")[1] || ""}`,
                      }))
                    }
                    placeholder="Seu nome"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Sobrenome</Label>
                  <Input
                    id="lastName"
                    value={user.name.split(" ")[1] || ""}
                    onChange={(e) =>
                      setUser((prev) => ({
                        ...prev,
                        name: `${user.name.split(" ")[0]} ${e.target.value}`,
                      }))
                    }
                    placeholder="Seu sobrenome"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">O email não pode ser alterado</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  value={user.bio || ""}
                  onChange={(e) => setUser((prev) => ({ ...prev, bio: e.target.value }))}
                  placeholder="Conte um pouco sobre você"
                />
              </div>
              <Button type="submit" disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>Configure como você deseja receber notificações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações por Email</Label>
                  <p className="text-sm text-muted-foreground">Receba notificações importantes por email</p>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações Push</Label>
                  <p className="text-sm text-muted-foreground">Receba notificações no navegador</p>
                </div>
                <Switch
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) => handleNotificationChange("push", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Atualizações de Tarefas</Label>
                  <p className="text-sm text-muted-foreground">Seja notificado sobre mudanças nas tarefas</p>
                </div>
                <Switch
                  checked={settings.notifications.taskUpdates}
                  onCheckedChange={(checked) => handleNotificationChange("taskUpdates", checked)}
                />
              </div>
              <Button onClick={saveSettings} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Salvando..." : "Salvar Preferências"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Segurança da Conta</CardTitle>
              <CardDescription>Gerencie a segurança da sua conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button>Alterar Senha</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações de Cobrança</CardTitle>
              <CardDescription>Gerencie seu plano e método de pagamento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Plano Pro</h3>
                    <p className="text-sm text-muted-foreground">R$ 29,90/mês</p>
                  </div>
                  <Button variant="outline">Alterar Plano</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Método de Pagamento</Label>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">•••• •••• •••• 1234</p>
                      <p className="text-sm text-muted-foreground">Expira em 12/2025</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
