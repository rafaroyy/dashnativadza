"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Save } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface Profile {
  id: string
  name: string
  email: string
  avatar_url?: string
  notifications_enabled: boolean
}

export default function SettingsClient() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const supabase = createClient()
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase.from("users").select("*").eq("id", user.id).single()
      setProfile(data)
    }
    load()
  }, [])

  const handleSave = async () => {
    if (!profile) return
    try {
      setSaving(true)
      const supabase = createClient()
      await supabase
        .from("users")
        .update({
          name: profile.name,
          notifications_enabled: profile.notifications_enabled,
        })
        .eq("id", profile.id)
      toast({ title: "Sucesso", description: "Configurações salvas!" })
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (!profile)
    return (
      <div className="p-6">
        <p className="animate-pulse text-muted-foreground">Carregando...</p>
      </div>
    )

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">Gerencie suas preferências e conta</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Salvando..." : "Salvar"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>Informações básicas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.avatar_url || "/placeholder.svg"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-muted-foreground text-sm">Clique para alterar</p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={profile.email} disabled className="bg-muted" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label>Notificações por email</Label>
            <Switch
              checked={profile.notifications_enabled}
              onCheckedChange={(c) => setProfile({ ...profile, notifications_enabled: c })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
