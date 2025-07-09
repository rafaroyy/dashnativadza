"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { dbOperations } from "@/lib/supabase"

export async function signInWithEmail(formData: FormData) {
  const email = String(formData.get("email") ?? "")
  const password = String(formData.get("password") ?? "")

  if (!email || !password) {
    return { error: "Email e senha são obrigatórios" }
  }

  try {
    // Verificar credenciais na tabela users
    const user = await dbOperations.getUserByEmailAndPassword(email, password)

    if (!user) {
      return { error: "Credenciais inválidas" }
    }

    // Criar sessão no Supabase Auth (usando o ID do usuário)
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: user.password,
    })

    if (error) {
      return { error: "Erro ao fazer login" }
    }

    redirect("/dashboard")
  } catch (error) {
    return { error: "Erro interno do servidor" }
  }
}

export async function signUpWithEmail(formData: FormData) {
  const name = String(formData.get("name") ?? "")
  const email = String(formData.get("email") ?? "")
  const password = String(formData.get("password") ?? "")

  if (!name || !email || !password) {
    return { error: "Todos os campos são obrigatórios" }
  }

  try {
    // Verificar se o email já existe
    const existingUser = await dbOperations.getUserByEmail(email)
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

    if (!newUser) {
      return { error: "Erro ao criar usuário" }
    }

    // Criar conta no Supabase Auth
    const supabase = await createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          user_id: newUser.id,
        },
      },
    })

    if (error) {
      return { error: "Erro ao criar conta" }
    }

    redirect("/dashboard")
  } catch (error) {
    return { error: "Erro interno do servidor" }
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
