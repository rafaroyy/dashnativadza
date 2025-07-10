"use server"

import { redirect } from "next/navigation"
import { dbOperations } from "@/lib/supabase"

export async function signInWithEmail(formData: FormData) {
  const email = String(formData.get("email") ?? "")
  const password = String(formData.get("password") ?? "")

  console.log("Login attempt:", { email, password: password ? "***" : "empty" })

  if (!email || !password) {
    return { error: "Email e senha são obrigatórios" }
  }

  try {
    // Verificar credenciais na tabela users
    const user = await dbOperations.getUserByEmailAndPassword(email, password)
    console.log("User found:", user ? "yes" : "no")

    if (!user) {
      return { error: "Credenciais inválidas" }
    }

    // Simular sessão (em produção, use Supabase Auth)
    console.log("Login successful for:", user.email)
    redirect("/dashboard")
  } catch (error) {
    console.error("Login error:", error)
    return { error: "Erro interno do servidor" }
  }
}

export async function signUpWithEmail(formData: FormData) {
  const name = String(formData.get("name") ?? "")
  const email = String(formData.get("email") ?? "")
  const password = String(formData.get("password") ?? "")

  console.log("Signup attempt:", { name, email, password: password ? "***" : "empty" })

  if (!name || !email || !password) {
    return { error: "Todos os campos são obrigatórios" }
  }

  try {
    // Verificar se o email já existe
    const existingUser = await dbOperations.getUserByEmail(email)
    console.log("Existing user check:", existingUser ? "found" : "not found")

    if (existingUser) {
      return { error: "Este email já está em uso" }
    }

    // Criar usuário na tabela users
    const newUser = await dbOperations.createUser({
      name,
      email,
      password,
      profile_image_url: `https://api.dicebear.com/8.x/initials/svg?seed=${name}`,
    })

    console.log("User creation result:", newUser ? "success" : "failed")

    if (!newUser) {
      return { error: "Erro ao criar usuário" }
    }

    console.log("Signup successful for:", newUser.email)
    redirect("/dashboard")
  } catch (error) {
    console.error("Signup error:", error)
    return { error: "Erro interno do servidor" }
  }
}

export async function signOut() {
  redirect("/login")
}
