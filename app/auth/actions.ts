"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

/** Sign-in Server Action (email & password). */
export async function signInWithEmail(formData: FormData) {
  const supabase = await createClient()

  const email = String(formData.get("email") ?? "")
  const password = String(formData.get("password") ?? "")
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: error.message }
  redirect("/dashboard")
}

/** Sign-up Server Action (email & password). */
export async function signUpWithEmail(formData: FormData) {
  const supabase = await createClient()

  const email = String(formData.get("email") ?? "")
  const password = String(formData.get("password") ?? "")
  const { error } = await supabase.auth.signUp({ email, password })

  if (error) return { error: error.message }
  redirect("/dashboard")
}

/** Logout Server Action. */
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
