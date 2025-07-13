"use server"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email e senha são obrigatórios" }
  }

  const supabase = await createClient()

  // Buscar usuário na tabela users
  const { data: user, error } = await supabase.from("users").select("*").eq("email", email).single()

  if (error || !user) {
    return { error: "Credenciais inválidas" }
  }

  // Verificar senha (em produção, use hash)
  if (user.password !== password) {
    return { error: "Credenciais inválidas" }
  }

  // Criar sessão via cookie
  const cookieStore = await cookies()
  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }

  cookieStore.set("user_session", JSON.stringify(userData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  redirect("/dashboard")
}

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete("user_session")
  redirect("/login")
}
