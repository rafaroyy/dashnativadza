import { createClient } from "./server"

interface CreateUserArgs {
  name: string
  email: string
  password: string
  profile_image_url?: string
}

/**
 * Low-level DB helpers used by auth & header components.
 * Every helper waits for `createClient()` (async) and then
 * performs a PostgREST query.
 */
export const dbOperations = {
  /** Find user by email & password (plain-text temp password). */
  async getUserByEmailAndPassword(email: string, password: string) {
    const supabase = await createClient()
    const { data } = await supabase.from("users").select("*").eq("email", email).eq("password", password).single()
    return data
  },

  /** Get user by email (for sign-up existence check). */
  async getUserByEmail(email: string) {
    const supabase = await createClient()
    const { data } = await supabase.from("users").select("*").eq("email", email).single()
    return data
  },

  /** Get user by primary key UUID. */
  async getUserById(id: string) {
    const supabase = await createClient()
    const { data } = await supabase.from("users").select("*").eq("id", id).single()
    return data
  },

  /** Insert a new user row and return it. */
  async createUser(args: CreateUserArgs) {
    const supabase = await createClient()
    const { data, error } = await supabase.from("users").insert(args).select().single()
    if (error) throw error
    return data
  },
}
