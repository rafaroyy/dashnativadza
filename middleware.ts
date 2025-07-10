import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: "",
            ...options,
          })
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const userSession = request.cookies.get("user_session")
  const { pathname } = request.nextUrl

  // Se está tentando acessar o dashboard sem estar logado
  if (pathname.startsWith("/dashboard") && !userSession) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Se está logado e tentando acessar login, redireciona para dashboard
  if (pathname === "/login" && userSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Redireciona para login se não autenticado e tentando acessar rota protegida
  if (!user && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redireciona para dashboard se autenticado e tentando acessar login
  if (user && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return response
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}
