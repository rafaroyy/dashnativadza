"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useRouter } from "next/navigation"
import { User, Bell, Shield, Globe, Palette, Download, Trash2, Camera } from "lucide-react"
import { supabase, isValidUUID } from "@/lib/supabase"

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      desktop: false,
      marketing: false,
    },
    privacy: {
      profileVisible: true,
      activityVisible: false,
      onlineStatus: true,
    },
    preferences: {
      language: "pt-BR",
      timezone: "America/Sao_Paulo",
      dateFormat: "DD/MM/YYYY",
    },
  })
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      setError(null)
      // Get current user from localStorage for now
      const userData = localStorage.getItem("digitalz_user")
      if (userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)

        // Try to fetch from Supabase if we have a valid UUID
        if (parsedUser.id && isValidUUID(parsedUser.id)) {
          const { data, error } = await supabase.from("users").select("*").eq("id", parsedUser.id).single()

          if (error) {
            console.error("Error fetching user from Supabase:", error)
          } else if (data) {
            setUser(data)
            localStorage.setItem("digitalz_user", JSON.stringify(data))
          }
        }
      }

      const savedSettings = localStorage.getItem("digitalz_settings")
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
    } catch (error: any) {
      console.error("Error fetching user data:", error)
      setError("Erro ao carregar dados do usuário")
    } finally {
      setLoading(false)
    }
  }

  const handleSettingsChange = (category: string, key: string, value: any) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category as keyof typeof settings],
        [key]: value,
      },
    }
    setSettings(newSettings)

    if (typeof window !== "undefined") {
      localStorage.setItem("digitalz_settings", JSON.stringify(newSettings))
    }
  }

  const handleProfileUpdate = (field: string, value: string) => {
    if (!user) return

    const updatedUser = { ...user, [field]: value }
    setUser(updatedUser)
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    try {
      setError(null)
      // Upload to Supabase Storage if user has valid UUID
      if (user.id && isValidUUID(user.id)) {
        const fileExt = file.name.split(".").pop()
        const fileName = `${user.id}-${Math.random()}.${fileExt}`
        const filePath = `avatars/${fileName}`

        const { data: uploadData, error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file)

        if (uploadError) throw uploadError

        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(filePath)

        // Update user profile with new avatar URL
        const { data: userData, error: updateError } = await supabase
          .from("users")
          .update({ profile_image_url: publicUrl })
          .eq("id", user.id)
          .select()

        if (updateError) throw updateError

        if (userData && userData[0]) {
          setUser(userData[0])
          localStorage.setItem("digitalz_user", JSON.stringify(userData[0]))
        }
      } else {
        // Fallback to base64 for users without valid UUID
        const reader = new FileReader()
        reader.onload = (e) => {
          const base64String = e.target?.result as string
          const updatedUser = { ...user, profile_image_url: base64String }
          setUser(updatedUser)
          localStorage.setItem("digitalz_user", JSON.stringify(updatedUser))
        }
        reader.readAsDataURL(file)
      }
    } catch (error: any) {
      console.error("Error uploading photo:", error)
      setError("Erro ao fazer upload da foto: " + error.message)
    }
  }

  const handleSaveProfile = async () => {
    if (!user) return

    setSaving(true)
    setError(null)

    try {
      // Use email as identifier if ID is not a valid UUID
      const identifier = user.id && isValidUUID(user.id) ? user.id : user.email

      if (!identifier) {
        throw new Error("Identificador do usuário não encontrado")
      }

      if (isValidUUID(identifier)) {
        const { data, error } = await supabase
          .from("users")
          .update({
            name: user.name,
            phone: user.phone,
            location: user.location,
            role: user.role,
          })
          .eq("id", identifier)
          .select()

        if (error) throw error

        if (data && data[0]) {
          setUser(data[0])
          localStorage.setItem("digitalz_user", JSON.stringify(data[0]))
        }
      } else {
        // Fallback to localStorage if Supabase update fails
        localStorage.setItem("digitalz_user", JSON.stringify(user))
      }

      alert("Perfil salvo com sucesso!")
    } catch (error: any) {
      console.error("Error saving profile:", error)
      setError("Erro ao salvar perfil: " + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleExportData = async () => {
    try {
      setError(null)
      const [users, projects, tasks] = await Promise.all([
        supabase
          .from("users")
          .select("*")
          .then((res) => res.data || []),
        supabase
          .from("projects")
          .select("*")
          .then((res) => res.data || []),
        supabase
          .from("tasks")
          .select("*")
          .then((res) => res.data || []),
      ])

      const allData = {
        user: user,
        users: users,
        projects: projects,
        tasks: tasks,
        settings: settings,
        activities: JSON.parse(localStorage.getItem("digitalz_activities") || "[]"),
      }

      const dataStr = JSON.stringify(allData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `digitalz-backup-${new Date().toISOString().split("T")[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error: any) {
      console.error("Error exporting data:", error)
      setError("Erro ao exportar dados: " + error.message)
    }
  }

  const handleDeleteAccount = () => {
    if (confirm("Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.")) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("digitalz_user")
        localStorage.removeItem("digitalz_auth_token")
        localStorage.removeItem("digitalz_settings")
        localStorage.removeItem("digitalz_activities")
        router.push("/login")
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ml-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center ml-64">
        <div className="text-center">
          <p className="text-muted-foreground">Usuário não encontrado</p>
          <Button onClick={() => router.push("/login")} className="mt-4">
            Fazer Login
          </Button>
        </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <CardTitle>Perfil</CardTitle>
              </div>
              <CardDescription>Atualize suas informações pessoais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-primary/20">
                    <AvatarImage src={user.profile_image_url || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                      {user.name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 rounded-full h-8 w-8"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">Foto do Perfil</p>
                  <p className="text-xs text-muted-foreground">Clique no ícone da câmera para alterar</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Nome</Label>
                  <Input
                    id="profile-name"
                    value={user.name || ""}
                    onChange={(e) => handleProfileUpdate("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-email">Email</Label>
                  <Input
                    id="profile-email"
                    type="email"
                    value={user.email || ""}
                    onChange={(e) => handleProfileUpdate("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-phone">Telefone</Label>
                  <Input
                    id="profile-phone"
                    value={user.phone || ""}
                    onChange={(e) => handleProfileUpdate("phone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-role">Cargo</Label>
                  <Input
                    id="profile-role"
                    value={user.role || ""}
                    onChange={(e) => handleProfileUpdate("role", e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="profile-location">Localização</Label>
                  <Input
                    id="profile-location"
                    value={user.location || ""}
                    onChange={(e) => handleProfileUpdate("location", e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleSaveProfile} className="bg-primary hover:bg-primary/90" disabled={saving}>
                {saving ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <CardTitle>Notificações</CardTitle>
              </div>
              <CardDescription>Configure como você quer receber notificações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificações por Email</Label>
                  <p className="text-sm text-muted-foreground">Receba atualizações importantes por email</p>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => handleSettingsChange("notifications", "email", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificações Push</Label>
                  <p className="text-sm text-muted-foreground">Receba notificações push no navegador</p>
                </div>
                <Switch
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) => handleSettingsChange("notifications", "push", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificações Desktop</Label>
                  <p className="text-sm text-muted-foreground">Mostrar notificações na área de trabalho</p>
                </div>
                <Switch
                  checked={settings.notifications.desktop}
                  onCheckedChange={(checked) => handleSettingsChange("notifications", "desktop", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Marketing</Label>
                  <p className="text-sm text-muted-foreground">Receber emails sobre novidades e promoções</p>
                </div>
                <Switch
                  checked={settings.notifications.marketing}
                  onCheckedChange={(checked) => handleSettingsChange("notifications", "marketing", checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <CardTitle>Privacidade</CardTitle>
              </div>
              <CardDescription>Controle quem pode ver suas informações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Perfil Público</Label>
                  <p className="text-sm text-muted-foreground">Permitir que outros vejam seu perfil</p>
                </div>
                <Switch
                  checked={settings.privacy.profileVisible}
                  onCheckedChange={(checked) => handleSettingsChange("privacy", "profileVisible", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Atividade Visível</Label>
                  <p className="text-sm text-muted-foreground">Mostrar sua atividade para outros membros</p>
                </div>
                <Switch
                  checked={settings.privacy.activityVisible}
                  onCheckedChange={(checked) => handleSettingsChange("privacy", "activityVisible", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Status Online</Label>
                  <p className="text-sm text-muted-foreground">Mostrar quando você está online</p>
                </div>
                <Switch
                  checked={settings.privacy.onlineStatus}
                  onCheckedChange={(checked) => handleSettingsChange("privacy", "onlineStatus", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                <CardTitle>Aparência</CardTitle>
              </div>
              <CardDescription>Personalize a aparência do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label>Tema</Label>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <CardTitle>Preferências</CardTitle>
              </div>
              <CardDescription>Configure idioma e formato</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="settings-language">Idioma</Label>
                <Select
                  value={settings.preferences.language}
                  onValueChange={(value) => handleSettingsChange("preferences", "language", value)}
                >
                  <SelectTrigger id="settings-language">
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
                <Label htmlFor="settings-timezone">Fuso Horário</Label>
                <Select
                  value={settings.preferences.timezone}
                  onValueChange={(value) => handleSettingsChange("preferences", "timezone", value)}
                >
                  <SelectTrigger id="settings-timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                    <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="settings-date-format">Formato de Data</Label>
                <Select
                  value={settings.preferences.dateFormat}
                  onValueChange={(value) => handleSettingsChange("preferences", "dateFormat", value)}
                >
                  <SelectTrigger id="settings-date-format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
              <CardDescription>Ações irreversíveis da conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full bg-transparent" onClick={handleExportData}>
                <Download className="mr-2 h-4 w-4" />
                Exportar Dados
              </Button>
              <Button variant="destructive" className="w-full" onClick={handleDeleteAccount}>
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir Conta
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
