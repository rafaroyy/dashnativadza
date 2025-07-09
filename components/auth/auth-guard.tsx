import { redirect } from "next/navigation"
import type { ReactNode } from "react"
import { createClient } from "@/lib/supabase/server"

/**
 * Server Component that redirects to /login
 * when the user is not authenticated.
 */
export default async function AuthGuard({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")
  return <>{children}</>
}
