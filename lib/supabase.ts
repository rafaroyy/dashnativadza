import { createClient } from "./supabase/client"

export const supabase = createClient()

export interface User {
  id: string
  name: string
  email: string
  role?: string
  phone?: string
  location?: string
  profile_image_url?: string
  online_status?: boolean
  created_at?: string
  updated_at?: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: "todo" | "in_progress" | "done"
  priority: "low" | "medium" | "high"
  assigned_to?: string
  project_id?: string
  space_id?: string
  due_date?: string
  completed?: boolean
  created_at?: string
  updated_at?: string
  assignee?: User
  project?: Project
}

export interface Project {
  id: string
  name: string
  title?: string
  description?: string
  status: "active" | "completed" | "on_hold"
  progress?: number
  color?: string
  deadline?: string
  members_count?: number
  tasks_total?: number
  created_at?: string
  updated_at?: string
}

export interface ProjectMember {
  id: string
  project_id: string
  user_id: string
  role: string
  user?: User
}

export const dbOperations = {
  // Users
  async getUsers() {
    const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })
    if (error) throw error
    return data as User[]
  },

  async getUserById(id: string) {
    const { data, error } = await supabase.from("users").select("*").eq("id", id).single()
    if (error) throw error
    return data as User
  },

  async updateUser(id: string, updates: Partial<User>) {
    const { data, error } = await supabase.from("users").update(updates).eq("id", id).select().single()
    if (error) throw error
    return data as User
  },

  async createUser(user: Omit<User, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase.from("users").insert([user]).select().single()
    if (error) throw error
    return data as User
  },

  // Tasks
  async getTasks() {
    const { data, error } = await supabase
      .from("tasks")
      .select(`
        *,
        assignee:users!assigned_to(id, name, email, profile_image_url),
        project:projects!project_id(id, name, title, color)
      `)
      .order("created_at", { ascending: false })
    if (error) throw error
    return data as Task[]
  },

  async getTasksByProject(projectId: string) {
    const { data, error } = await supabase
      .from("tasks")
      .select(`
        *,
        assignee:users!assigned_to(id, name, email, profile_image_url)
      `)
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })
    if (error) throw error
    return data as Task[]
  },

  async createTask(task: Omit<Task, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase
      .from("tasks")
      .insert([task])
      .select(`
        *,
        assignee:users!assigned_to(id, name, email, profile_image_url),
        project:projects!project_id(id, name, title, color)
      `)
      .single()
    if (error) throw error
    return data as Task
  },

  async updateTask(id: string, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .select(`
        *,
        assignee:users!assigned_to(id, name, email, profile_image_url),
        project:projects!project_id(id, name, title, color)
      `)
      .single()
    if (error) throw error
    return data as Task
  },

  async deleteTask(id: string) {
    const { error } = await supabase.from("tasks").delete().eq("id", id)
    if (error) throw error
  },

  // Projects
  async getProjects() {
    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })
    if (error) throw error
    return data as Project[]
  },

  async getProjectById(id: string) {
    const { data, error } = await supabase.from("projects").select("*").eq("id", id).single()
    if (error) throw error
    return data as Project
  },

  async createProject(project: Omit<Project, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase.from("projects").insert([project]).select().single()
    if (error) throw error
    return data as Project
  },

  async updateProject(id: string, updates: Partial<Project>) {
    const { data, error } = await supabase.from("projects").update(updates).eq("id", id).select().single()
    if (error) throw error
    return data as Project
  },

  async deleteProject(id: string) {
    const { error } = await supabase.from("projects").delete().eq("id", id)
    if (error) throw error
  },

  async getProjectMembers(projectId: string) {
    const { data, error } = await supabase
      .from("project_members")
      .select(`
        *,
        user:users(*)
      `)
      .eq("project_id", projectId)
    if (error) throw error
    return data as ProjectMember[]
  },

  // File upload
  async uploadAvatar(file: File, userId: string) {
    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}-${Math.random()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath)
    return data.publicUrl
  },
}
