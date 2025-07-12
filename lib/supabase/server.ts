import { cookies } from "next/headers"
import { createServerClient as createSupabaseServerClient } from "@supabase/ssr"

/**
 * Creates a Supabase client on the server, wired to the current
 * request/response cookie store.
 */
export function createServerClient(cookieStore: ReturnType<typeof cookies> = cookies()) {
  return createSupabaseServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch {
          /* called from a Server Component – ignore */
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch {
          /* called from a Server Component – ignore */
        }
      },
    },
  })
}

/**
 * Back-compat convenience alias for code that imports `createClient`.
 * Internally it just calls `createServerClient()`.
 */
export function createClient() {
  return createServerClient()
}

/**
 * Convenience wrapper – use inside **Server Components** to obtain the user
 * associated with the current session (returns `null` when não autenticado).
 */
export async function getUserFromSession() {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    console.error("Error getting user:", error)
    return null
  }
}

/**
 * Alias retained for backward-compatibility with legacy imports.
 */
export async function getUser() {
  return getUserFromSession()
}
