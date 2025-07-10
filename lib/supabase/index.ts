import { createClient } from "./server"

export interface User {
  id: string
  name: string
  email: string
  password: string
  phone?: string
  role?: string
  location?: string
  profile_image_url?: string
  online_status?: boolean
  created_at: string
  updated_at: string
}

export interface CreateUserArgs {
  name: string
  email: string
  password: string
  profile_image_url?: string
}

export const dbOperations = {
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

      if (error) {
        console.error("Error fetching user by email:", error)
        return null
      }
      return data
    } catch (error) {
      console.error("Database error:", error)
      return null
    }
  },

  async getUserByEmailAndPassword(email: string, password: string): Promise<User | null> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("password", password)
        .single()

      if (error) {
        console.error("Error fetching user by email and password:", error)
        return null
      }
      return data
    } catch (error) {
      console.error("Database error:", error)
      return null
    }
  },

  async createUser(userData: CreateUserArgs): Promise<User | null> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from("users")
        .insert({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          profile_image_url:
            userData.profile_image_url || `https://api.dicebear.com/8.x/initials/svg?seed=${userData.name}`,
          role: "member",
          online_status: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating user:", error)
        return null
      }
      return data
    } catch (error) {
      console.error("Database error:", error)
      return null
    }
  },

  async getUserById(id: string): Promise<User | null> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

      if (error) {
        console.error("Error fetching user by id:", error)
        return null
      }
      return data
    } catch (error) {
      console.error("Database error:", error)
      return null
    }
  },
}
