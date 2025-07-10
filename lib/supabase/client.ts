import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Singleton do Supabase para o lado do cliente (browser).
 * Evita recriar a instância a cada render.
 */
let browserClient: SupabaseClient | undefined

export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error("⚠️  Variáveis NEXT_PUBLIC_SUPABASE_URL/ANON_KEY não definidas.")
  }

  browserClient = createBrowserClient(url, anonKey)
  return browserClient
}
