import { createClient as createServerClient } from "./server"
import { createClient as createBrowserClient } from "./client"

// Operações de banco de dados diretas (sem Supabase Auth)
export const dbOperations = {
  async getUserByEmail(email: string) {
    const supabase = await createServerClient()
    const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

    if (error) {
      console.error("Error fetching user by email:", error)
      return null
    }

    return data
  },

  async getUserByEmailAndPassword(email: string, password: string) {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .single()

    if (error) {
      console.error("Error fetching user by credentials:", error)
      return null
    }

    return data
  },

  async createUser(userData: {
    name: string
    email: string
    password: string
    profile_image_url?: string
  }) {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          ...userData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating user:", error)
      return null
    }

    return data
  },
}

export { createServerClient, createBrowserClient }
