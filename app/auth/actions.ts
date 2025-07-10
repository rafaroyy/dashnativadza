"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email e senha são obrigatórios" }
  }

  try {
    const supabase = createClient()

    // Busca o usuário na tabela users
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email, password, name")
      .eq("email", email)
      .single()

    if (userError || !user) {
      return { error: "Usuário não encontrado" }
    }

    // Verifica a senha
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return { error: "Senha inválida" }
    }

    // Cria sessão no Supabase Auth
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: "dummy-password", // Usamos uma senha dummy pois a verificação real já foi feita
    })

    if (signInError) {
      // Se não existe no auth, cria
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password: "dummy-password",
        options: {
          data: {
            name: user.name,
            user_id: user.id,
          },
        },
      })

      if (signUpError) {
        console.error("Erro ao criar sessão:", signUpError)
        return { error: "Erro interno do servidor" }
      }
    }

    redirect("/dashboard")
  } catch (error) {
    console.error("Erro no login:", error)
    return { error: "Erro interno do servidor" }
  }
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
