import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { SupabaseClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

/**
 * Cria um SupabaseClient apenas no lado do servidor.
 * Mantém a sessão via cookies utilizando a API do Next.js 15.
 */
export function createClient(): SupabaseClient {
  const cookieStore = cookies() // sem await!

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) throw new Error("Variáveis NEXT_PUBLIC_SUPABASE_URL / ANON_KEY não definidas.")

  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        // Tentamos gravar; se estivermos num Server Component, ignoramos.
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          /* ignore */
        }
      },
    },
  })
}

/**
 * Helper para obter o usuário autenticado (ou null).
 */
export async function getUser() {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  return data.user ?? null
}
