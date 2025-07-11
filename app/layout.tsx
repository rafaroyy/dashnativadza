import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"

export const metadata = {
  title: "ClickUp Clone",
  description: "Gestão de projetos estilo ClickUp com Next.js 14 + Supabase",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
