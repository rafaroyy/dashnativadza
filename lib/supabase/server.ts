import { cookies } from "next/headers"
import { createServerClient as createSupabaseClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Retorna uma instância configurada do Supabase para Server Components,
 * preservando sessão via cookies.
 */
export function createServerClient(): SupabaseClient {
  const cookieStore = cookies()

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anon) {
    throw new Error("Variáveis NEXT_PUBLIC_SUPABASE_URL e/ou NEXT_PUBLIC_SUPABASE_ANON_KEY não definidas.")
  }

  return createSupabaseClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          try {
            cookieStore.set(name, value, options)
          } catch {
            /* chamada vinda de Server Component (SSR), ignorar */
          }
        })
      },
    },
  })
}
