"use server"

import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"

/**
 * Validação simples sem dependências extras.
 */
function validateCredentials(email: unknown, password: unknown) {
  if (typeof email !== "string" || typeof password !== "string") return false
  if (!email.includes("@") || password.length < 6) return false
  return true
}

/**
 * Action de cadastro (sign up).
 * Retorna objeto { error?: string } para uso no hook useActionState.
 */
export async function signUp(_prevState: unknown, formData: FormData): Promise<{ error?: string }> {
  const email = formData.get("email")
  const password = formData.get("password")

  if (!validateCredentials(email, password)) {
    return { error: "Email ou senha inválidos" }
  }

  const supabase = getSupabaseServerClient()
  const { error } = await supabase.auth.signUp({
    email: email as string,
    password: password as string,
  })

  if (error) {
    return { error: error.message }
  }

  // Usuário criado com sucesso ➜ redirecionar para dashboard
  redirect("/dashboard")
}

/**
 * Action de login (sign in).
 */
export async function signIn(_prevState: unknown, formData: FormData): Promise<{ error?: string }> {
  const email = formData.get("email")
  const password = formData.get("password")

  if (!validateCredentials(email, password)) {
    return { error: "Email ou senha inválidos" }
  }

  const supabase = getSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: email as string,
    password: password as string,
  })

  if (error) {
    return { error: error.message }
  }

  redirect("/dashboard")
}
