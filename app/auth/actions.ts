"use server"

import { redirect } from "next/navigation"
import { dbOperations } from "@/lib/supabase"

export async function signInWithEmail(formData: FormData) {
  try {
    const email = String(formData.get("email") ?? "").trim()
    const password = String(formData.get("password") ?? "").trim()

    console.log("=== LOGIN ATTEMPT ===")
    console.log("Email:", email)
    console.log("Password provided:", password ? "yes" : "no")

    if (!email || !password) {
      console.log("Missing email or password")
      return { error: "Email e senha são obrigatórios" }
    }

    // Verificar credenciais na tabela users
    const user = await dbOperations.getUserByEmailAndPassword(email, password)

    if (!user) {
      console.log("Invalid credentials")
      return { error: "Credenciais inválidas" }
    }

    console.log("Login successful for:", user.email)
    redirect("/dashboard")
  } catch (error) {
    console.error("=== LOGIN ERROR ===", error)
    return { error: "Erro interno do servidor" }
  }
}

export async function signUpWithEmail(formData: FormData) {
  try {
    const name = String(formData.get("name") ?? "").trim()
    const email = String(formData.get("email") ?? "").trim()
    const password = String(formData.get("password") ?? "").trim()

    console.log("=== SIGNUP ATTEMPT ===")
    console.log("Name:", name)
    console.log("Email:", email)
    console.log("Password provided:", password ? "yes" : "no")

    if (!name || !email || !password) {
      console.log("Missing required fields")
      return { error: "Todos os campos são obrigatórios" }
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("Invalid email format")
      return { error: "Formato de email inválido" }
    }

    // Verificar se o email já existe
    const existingUser = await dbOperations.getUserByEmail(email)

    if (existingUser) {
      console.log("Email already exists")
      return { error: "Este email já está em uso" }
    }

    // Criar usuário na tabela users
    const newUser = await dbOperations.createUser({
      name,
      email,
      password,
      profile_image_url: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(name)}`,
    })

    if (!newUser) {
      console.log("Failed to create user")
      return { error: "Erro ao criar usuário. Tente novamente." }
    }

    console.log("Signup successful for:", newUser.email)
    redirect("/dashboard")
  } catch (error) {
    console.error("=== SIGNUP ERROR ===", error)
    return { error: "Erro interno do servidor" }
  }
}

export async function signOut() {
  try {
    console.log("User signing out")
    redirect("/login")
  } catch (error) {
    console.error("Signout error:", error)
    redirect("/login")
  }
}
