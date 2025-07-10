"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { dbOperations } from "@/lib/supabase/server"

export async function loginAction(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase()
  const password = (formData.get("password") as string) ?? ""

  if (!email || !password) {
    redirect("/login?error=Preencha%20todos%20os%20campos")
  }

  // Consulta direta à tabela users
  const user = await dbOperations.getUserByEmail(email)

  if (!user || user.password !== password) {
    redirect("/login?error=Credenciais%20inv%C3%A1lidas")
  }

  // Salvamos sessão em cookie
  const cookieStore = cookies()
  cookieStore.set(
    "user_session",
    JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
    }),
    {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    },
  )

  revalidatePath("/dashboard")
  redirect("/dashboard")
}

export async function signOut() {
  const cookieStore = cookies()
  cookieStore.delete("user_session")
  redirect("/login")
}
