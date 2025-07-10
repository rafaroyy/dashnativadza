import { loginAction } from "@/app/auth/actions"
import { AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cookies } from "next/headers"

export const metadata = { title: "Login · DigitalZ" }
export const dynamic = "force-dynamic"

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { error?: string }
}) {
  // Se já estiver logado, redireciona
  const cookieStore = cookies()
  if (cookieStore.get("user_session")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-sm text-muted-foreground">
          Você já está logado.{" "}
          <a href="/dashboard" className="underline">
            Ir para o dashboard
          </a>
          .
        </p>
      </div>
    )
  }

  const error = searchParams?.error

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <form action={loginAction} className="w-full max-w-md rounded-lg bg-[#050c1a] p-8 shadow-lg space-y-6">
        <header>
          <h2 className="text-2xl font-semibold text-white">Login</h2>
          <p className="text-sm text-muted-foreground">Entre com suas credenciais para acessar o sistema</p>
        </header>

        {error && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/60 bg-destructive/10 p-3 text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="text-sm">{decodeURIComponent(error)}</span>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm text-white">
            Email
          </label>
          <Input id="email" name="email" type="email" required placeholder="seu@email.com" autoComplete="email" />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm text-white">
            Senha
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Sua senha"
            autoComplete="current-password"
          />
        </div>

        <Button type="submit" className="w-full">
          Entrar
        </Button>

        <div className="pt-4 text-xs text-muted-foreground">
          Usuários de teste: <br />
          joao@example.com / senha: <strong>123</strong>
          <br />
          maria@example.com / senha: <strong>456</strong>
        </div>
      </form>
    </div>
  )
}
