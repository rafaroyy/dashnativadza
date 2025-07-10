import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signOut } from "@/app/auth/actions"

export default function DashboardPage() {
  const cookieStore = cookies()
  const userSession = cookieStore.get("user_session")

  if (!userSession) {
    redirect("/login")
  }

  let user
  try {
    user = JSON.parse(userSession.value)
  } catch {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Bem-vindo, {user.name}!</p>
          </div>
          <form action={signOut}>
            <Button variant="outline" type="submit">
              Sair
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Projetos</CardTitle>
              <CardDescription>Gerencie seus projetos</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-gray-600">Projetos ativos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tarefas</CardTitle>
              <CardDescription>Suas tarefas pendentes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">24</p>
              <p className="text-sm text-gray-600">Tarefas abertas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Equipe</CardTitle>
              <CardDescription>Membros da equipe</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">8</p>
              <p className="text-sm text-gray-600">Colaboradores</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
