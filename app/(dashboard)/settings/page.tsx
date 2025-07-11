import SettingsClient from "./settings-client"

export const dynamic = "force-dynamic"

interface UserSettings {
  id: string
  name: string
  email: string
  avatar?: string
  notifications: {
    email: boolean
    push: boolean
    desktop: boolean
  }
  privacy: {
    profileVisible: boolean
    activityVisible: boolean
  }
  preferences: {
    theme: "light" | "dark" | "system"
    language: string
    timezone: string
  }
}

export default function SettingsPage() {
  return <SettingsClient />
}
