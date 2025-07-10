import { createClient as createServerClient } from "./server"

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
      console.log("Searching for user with email:", email)
      const supabase = await createServerClient()
      const { data, error } = await supabase.from("users").select("*").eq("email", email).maybeSingle()

      if (error) {
        console.error("Supabase error in getUserByEmail:", error)
        return null
      }

      console.log("User found:", data ? "yes" : "no")
      return data
    } catch (error) {
      console.error("Database error in getUserByEmail:", error)
      return null
    }
  },

  async getUserByEmailAndPassword(email: string, password: string): Promise<User | null> {
    try {
      console.log("Authenticating user:", email)
      const supabase = await createServerClient()
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("password", password)
        .maybeSingle()

      if (error) {
        console.error("Supabase error in getUserByEmailAndPassword:", error)
        return null
      }

      console.log("Authentication result:", data ? "success" : "failed")
      return data
    } catch (error) {
      console.error("Database error in getUserByEmailAndPassword:", error)
      return null
    }
  },

  async createUser(userData: CreateUserArgs): Promise<User | null> {
    try {
      console.log("Creating user:", userData.email)
      const supabase = await createServerClient()

      const newUser = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        profile_image_url:
          userData.profile_image_url || `https://api.dicebear.com/8.x/initials/svg?seed=${userData.name}`,
        role: "member",
        online_status: false,
      }

      const { data, error } = await supabase.from("users").insert(newUser).select().single()

      if (error) {
        console.error("Supabase error in createUser:", error)
        return null
      }

      console.log("User created successfully:", data.email)
      return data
    } catch (error) {
      console.error("Database error in createUser:", error)
      return null
    }
  },

  async getUserById(id: string): Promise<User | null> {
    try {
      console.log("Fetching user by ID:", id)
      const supabase = await createServerClient()
      const { data, error } = await supabase.from("users").select("*").eq("id", id).maybeSingle()

      if (error) {
        console.error("Supabase error in getUserById:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Database error in getUserById:", error)
      return null
    }
  },
}
