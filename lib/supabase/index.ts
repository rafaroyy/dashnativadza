import { createClient as createServerClient } from "./server"
import { createClient as createBrowserClient } from "./client"

// Operações de banco de dados
export const dbOperations = {
  async getUserById(id: string) {
    const supabase = createServerClient()
    const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

    if (error) {
      console.error("Erro ao buscar usuário:", error)
      return null
    }

    return data
  },

  async getUserByEmail(email: string) {
    const supabase = createServerClient()
    const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

    if (error) {
      console.error("Erro ao buscar usuário por email:", error)
      return null
    }

    return data
  },

  async createUser(userData: any) {
    const supabase = createServerClient()
    const { data, error } = await supabase.from("users").insert(userData).select().single()

    if (error) {
      console.error("Erro ao criar usuário:", error)
      throw error
    }

    return data
  },
}

export { createServerClient, createBrowserClient }
