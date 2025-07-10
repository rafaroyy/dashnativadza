import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rotas que precisam de autenticação
  const protectedRoutes = ["/dashboard", "/tasks", "/projects", "/teams", "/settings"]
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Rotas públicas
  const publicRoutes = ["/login", "/signup", "/"]
  const isPublicRoute = publicRoutes.includes(pathname)

  // Verificar se tem sessão de usuário
  const userSession = request.cookies.get("user_session")
  const hasValidSession = userSession && userSession.value

  // Se está tentando acessar rota protegida sem sessão
  if (isProtectedRoute && !hasValidSession) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Se está logado e tentando acessar login, redireciona para dashboard
  if (hasValidSession && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
}
