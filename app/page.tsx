"use client"

export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DigitalzLogo } from "@/components/ui/digitalz-logo"
import { CheckCircle, Users, Zap, Shield } from "lucide-react"

export default function HomePage() {
  redirect("/login")

  const features = [
    {
      icon: CheckCircle,
      title: "Gestão de Tarefas",
      description: "Organize e acompanhe suas tarefas com facilidade",
    },
    {
      icon: Users,
      title: "Colaboração em Equipe",
      description: "Trabalhe em conjunto com sua equipe de forma eficiente",
    },
    {
      icon: Zap,
      title: "Automação Inteligente",
      description: "Automatize processos repetitivos e ganhe produtividade",
    },
    {
      icon: Shield,
      title: "Segurança Avançada",
      description: "Seus dados protegidos com criptografia de ponta",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <DigitalzLogo />
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => redirect("/login")}>
              Entrar
            </Button>
            <Button onClick={() => redirect("/login")}>Começar Agora</Button>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 gradient-text">Gerencie Projetos com Inteligência</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          A plataforma completa para organizar tarefas, colaborar com equipes e acelerar a entrega de projetos com
          eficiência máxima.
        </p>
        <Button size="lg" onClick={() => redirect("/login")} className="gradient-bg">
          Começar Gratuitamente
        </Button>
      </section>

      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Tudo que você precisa em um só lugar</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className="h-12 w-12 mx-auto text-primary mb-4" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="gradient-bg py-20">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Pronto para revolucionar sua produtividade?</h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de equipes que já transformaram sua forma de trabalhar
          </p>
          <Button size="lg" variant="secondary" onClick={() => redirect("/login")}>
            Começar Agora - É Grátis
          </Button>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <DigitalzLogo className="mb-4" />
          <p className="text-slate-400">© 2024 DigitalZ. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
