"use server"

import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email e senha são obrigatórios" }
  }

  try {
    const supabase = await createServerClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Erro no login:", error)
      return { error: error.message }
    }

    revalidatePath("/", "layout")
    redirect("/dashboard")
  } catch (error) {
    console.error("Erro interno no login:", error)
    return { error: "Erro interno do servidor" }
  }
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  if (!email || !password || !name) {
    return { error: "Todos os campos são obrigatórios" }
  }

  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    })

    if (error) {
      console.error("Erro no cadastro:", error)
      return { error: error.message }
    }

    // Criar perfil do usuário
    if (data.user) {
      const { error: profileError } = await supabase.from("users").insert([
        {
          id: data.user.id,
          email: data.user.email,
          name: name,
          created_at: new Date().toISOString(),
        },
      ])

      if (profileError) {
        console.error("Erro ao criar perfil:", profileError)
      }
    }

    revalidatePath("/", "layout")
    redirect("/dashboard")
  } catch (error) {
    console.error("Erro interno no cadastro:", error)
    return { error: "Erro interno do servidor" }
  }
}

export async function signOut() {
  try {
    const supabase = await createServerClient()
    await supabase.auth.signOut()
    revalidatePath("/", "layout")
    redirect("/login")
  } catch (error) {
    console.error("Erro no logout:", error)
    return { error: "Erro ao fazer logout" }
  }
}
