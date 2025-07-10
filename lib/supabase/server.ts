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

/**
 * Compat helper – returns the authenticated user (or null).
 * Required by other parts of the codebase.
 */
export async function getUser() {
  return getUserFromSession()
}

// Operações de banco de dados
export const dbOperations = {
  async getUserByEmail(email: string) {
    const supabase = createClient()
    const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

    if (error) {
      console.error("Erro ao buscar usuário por email:", error)
      return null
    }

    return data
  },

  async getUserById(id: string) {
    const supabase = createClient()
    const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

    if (error) {
      console.error("Erro ao buscar usuário:", error)
      return null
    }

    return data
  },
}
