import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { SupabaseClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

export function createClient(): SupabaseClient {
  const cookieStore = cookies()

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) throw new Error("Variáveis NEXT_PUBLIC_SUPABASE_URL / ANON_KEY não definidas.")

  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // ignore
        }
      },
    },
  })
}

export async function getUserFromSession() {
  const cookieStore = cookies()
  const userSession = cookieStore.get("user_session")

  if (!userSession) return null

  try {
    return JSON.parse(userSession.value)
  } catch {
    return null
  }
}

export async function getUser() {
  return getUserFromSession()
}

export async function getSession() {
  const cookieStore = cookies()
  const userSession = cookieStore.get("user_session")
  return userSession ? { user: await getUserFromSession() } : null
}
