"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield, Palette, Save, Upload, Trash2 } from "lucide-react"
import { dbOperations } from "@/lib/supabase"

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
    <div className="p-6 space-y-6 ml-64">
      <div>
        <h1 className="text-3xl font-bold text-primary">Configurações</h1>
        <p className="text-muted-foreground">Gerencie suas preferências e configurações da conta</p>
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
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacidade
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Aparência
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>Atualize suas informações pessoais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.profile_image_url || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="text-lg">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                      <Button variant="outline" size="sm" disabled={saving}>
                        <Upload className="h-4 w-4 mr-2" />
                        Alterar Avatar
                      </Button>
                    </Label>
                    <Input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">JPG, PNG ou GIF. Máximo 5MB.</p>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={user.name}
                      onChange={(e) => setUser((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email} disabled className="bg-muted" />
                    <p className="text-xs text-muted-foreground">O email não pode ser alterado</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={user.phone}
                      onChange={(e) => setUser((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Cargo</Label>
                    <Input
                      id="role"
                      value={user.role}
                      onChange={(e) => setUser((prev) => ({ ...prev, role: e.target.value }))}
                      placeholder="Seu cargo"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Localização</Label>
                  <Input
                    id="location"
                    value={user.location}
                    onChange={(e) => setUser((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="Cidade, Estado"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="online-status"
                    checked={user.online_status}
                    onCheckedChange={(checked) => setUser((prev) => ({ ...prev, online_status: checked }))}
                  />
                  <Label htmlFor="online-status">Aparecer como online</Label>
                </div>

                <Button type="submit" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </form>
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
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Canais de Notificação</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications">Notificações por Email</Label>
                        <p className="text-sm text-muted-foreground">Receba notificações no seu email</p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={settings.notifications.email}
                        onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="push-notifications">Notificações Push</Label>
                        <p className="text-sm text-muted-foreground">Receba notificações no navegador</p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={settings.notifications.push}
                        onCheckedChange={(checked) => handleNotificationChange("push", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="desktop-notifications">Notificações Desktop</Label>
                        <p className="text-sm text-muted-foreground">Receba notificações na área de trabalho</p>
                      </div>
                      <Switch
                        id="desktop-notifications"
                        checked={settings.notifications.desktop}
                        onCheckedChange={(checked) => handleNotificationChange("desktop", checked)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Tipos de Notificação</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="task-updates">Atualizações de Tarefas</Label>
                        <p className="text-sm text-muted-foreground">Quando tarefas são criadas ou atualizadas</p>
                      </div>
                      <Switch
                        id="task-updates"
                        checked={settings.notifications.taskUpdates}
                        onCheckedChange={(checked) => handleNotificationChange("taskUpdates", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="project-updates">Atualizações de Projetos</Label>
                        <p className="text-sm text-muted-foreground">Quando projetos são modificados</p>
                      </div>
                      <Switch
                        id="project-updates"
                        checked={settings.notifications.projectUpdates}
                        onCheckedChange={(checked) => handleNotificationChange("projectUpdates", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="team-messages">Mensagens da Equipe</Label>
                        <p className="text-sm text-muted-foreground">Quando você recebe mensagens</p>
                      </div>
                      <Switch
                        id="team-messages"
                        checked={settings.notifications.teamMessages}
                        onCheckedChange={(checked) => handleNotificationChange("teamMessages", checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={saveSettings} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Privacidade</CardTitle>
              <CardDescription>Controle quem pode ver suas informações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="profile-visible">Perfil Visível</Label>
                    <p className="text-sm text-muted-foreground">Permitir que outros vejam seu perfil</p>
                  </div>
                  <Switch
                    id="profile-visible"
                    checked={settings.privacy.profileVisible}
                    onCheckedChange={(checked) => handlePrivacyChange("profileVisible", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="status-visible">Status Online Visível</Label>
                    <p className="text-sm text-muted-foreground">Mostrar quando você está online</p>
                  </div>
                  <Switch
                    id="status-visible"
                    checked={settings.privacy.statusVisible}
                    onCheckedChange={(checked) => handlePrivacyChange("statusVisible", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="activity-visible">Atividade Visível</Label>
                    <p className="text-sm text-muted-foreground">Permitir que outros vejam sua atividade</p>
                  </div>
                  <Switch
                    id="activity-visible"
                    checked={settings.privacy.activityVisible}
                    onCheckedChange={(checked) => handlePrivacyChange("activityVisible", checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Zona de Perigo</h4>
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-red-800">Excluir Conta</h5>
                      <p className="text-sm text-red-600">Esta ação não pode ser desfeita</p>
                    </div>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir Conta
                    </Button>
                  </div>
                </div>
              </div>

              <Button onClick={saveSettings} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Aparência</CardTitle>
              <CardDescription>Personalize a aparência da aplicação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Tema</Label>
                  <Select
                    value={settings.appearance.theme}
                    onValueChange={(value) => handleAppearanceChange("theme", value)}
                  >
                    <SelectTrigger id="theme">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select
                    value={settings.appearance.language}
                    onValueChange={(value) => handleAppearanceChange("language", value)}
                  >
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select
                    value={settings.appearance.timezone}
                    onValueChange={(value) => handleAppearanceChange("timezone", value)}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                      <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (GMT+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={saveSettings} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
