import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Cria uma instância do Supabase no lado do servidor
 * preservando cookies para Auth.
 */
export function getSupabaseServerClient(): SupabaseClient {
  const cookieStore = cookies()

  const url = process.env.SUPABASE_URL
  const anonKey = process.env.SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error("⚠️  Variáveis SUPABASE_URL/ANON_KEY não definidas.")
  }

  return createServerClient(url, anonKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
      set(name, value, options) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name, options) {
        cookieStore.delete({ name, ...options })
      },
    },
  })
}
