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
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    },
  )

  // Check if user has session cookie
  const userSession = request.cookies.get("user_session")
  const isAuthPage = request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup"
  const isProtectedRoute = ["/dashboard", "/tasks", "/projects", "/teams", "/settings"].some((route) =>
    request.nextUrl.pathname.startsWith(route),
  )

  // If no session and trying to access protected route, redirect to login
  if (!userSession && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If has session and trying to access auth pages, redirect to dashboard
  if (userSession && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
