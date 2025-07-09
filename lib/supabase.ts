import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role?: string
  location?: string
  profile_image_url?: string
  online_status?: boolean
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  description?: string
  status: "active" | "completed" | "on-hold"
  progress: number
  deadline?: string
  members_count: number
  tasks_total: number
  space_id?: string
  created_by?: string
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: "todo" | "in-progress" | "completed"
  priority: "low" | "normal" | "high" | "urgent"
  due_date?: string
  completed: boolean
  assigned_to?: string
  project_id?: string
  space_id?: string
  created_by?: string
  created_at: string
  updated_at: string
}

export interface Space {
  id: string
  name: string
  description?: string
  color?: string
  workspace_id?: string
  created_by?: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  content: string
  sender_id: string
  receiver_id: string
  read_at?: string
  created_at: string
}

// Utility function to check if a string is a valid UUID
export function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}

// Database operations
export const dbOperations = {
  // Users
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase.from("users").select("*").order("name")

    if (error) {
      console.error("Error fetching users:", error)
      throw error
    }

    return data || []
  },

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching user:", error)
      return null
    }

    return data
  },

  async createUser(userData: Partial<User>): Promise<User | null> {
    const { data, error } = await supabase.from("users").insert([userData]).select().single()

    if (error) {
      console.error("Error creating user:", error)
      throw error
    }

    return data
  },

  async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    const { data, error } = await supabase.from("users").update(userData).eq("id", id).select().single()

    if (error) {
      console.error("Error updating user:", error)
      throw error
    }

    return data
  },

  // Projects
  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching projects:", error)
      throw error
    }

    return data || []
  },

  async getProjectById(id: string): Promise<Project | null> {
    const { data, error } = await supabase.from("projects").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching project:", error)
      return null
    }

    return data
  },

  async createProject(projectData: Partial<Project>): Promise<Project | null> {
    const { data, error } = await supabase.from("projects").insert([projectData]).select().single()

    if (error) {
      console.error("Error creating project:", error)
      throw error
    }

    return data
  },

  async updateProject(id: string, projectData: Partial<Project>): Promise<Project | null> {
    const { data, error } = await supabase.from("projects").update(projectData).eq("id", id).select().single()

    if (error) {
      console.error("Error updating project:", error)
      throw error
    }

    return data
  },

  async deleteProject(id: string): Promise<boolean> {
    const { error } = await supabase.from("projects").delete().eq("id", id)

    if (error) {
      console.error("Error deleting project:", error)
      throw error
    }

    return true
  },

  // Tasks
  async getTasks(): Promise<Task[]> {
    const { data, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching tasks:", error)
      throw error
    }

    return data || []
  },

  async getTaskById(id: string): Promise<Task | null> {
    const { data, error } = await supabase.from("tasks").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching task:", error)
      return null
    }

    return data
  },

  async createTask(taskData: Partial<Task>): Promise<Task | null> {
    const { data, error } = await supabase.from("tasks").insert([taskData]).select().single()

    if (error) {
      console.error("Error creating task:", error)
      throw error
    }

    return data
  },

  async updateTask(id: string, taskData: Partial<Task>): Promise<Task | null> {
    const { data, error } = await supabase.from("tasks").update(taskData).eq("id", id).select().single()

    if (error) {
      console.error("Error updating task:", error)
      throw error
    }

    return data
  },

  async deleteTask(id: string): Promise<boolean> {
    const { error } = await supabase.from("tasks").delete().eq("id", id)

    if (error) {
      console.error("Error deleting task:", error)
      throw error
    }

    return true
  },

  // Spaces
  async getSpaces(): Promise<Space[]> {
    const { data, error } = await supabase.from("spaces").select("*").order("name")

    if (error) {
      console.error("Error fetching spaces:", error)
      throw error
    }

    return data || []
  },

  async createSpace(spaceData: Partial<Space>): Promise<Space | null> {
    const { data, error } = await supabase.from("spaces").insert([spaceData]).select().single()

    if (error) {
      console.error("Error creating space:", error)
      throw error
    }

    return data
  },

  // Messages
  async getMessages(userId1: string, userId2: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`,
      )
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching messages:", error)
      throw error
    }

    return data || []
  },

  async sendMessage(messageData: Partial<Message>): Promise<Message | null> {
    const { data, error } = await supabase.from("messages").insert([messageData]).select().single()

    if (error) {
      console.error("Error sending message:", error)
      throw error
    }

    return data
  },

  // File upload
  async uploadAvatar(file: File, userId: string): Promise<string> {
    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}-${Math.random()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { data, error } = await supabase.storage.from("avatars").upload(filePath, file)

    if (error) {
      console.error("Error uploading avatar:", error)
      throw error
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath)

    return publicUrl
  },

  // Statistics
  async getStatistics() {
    const [users, projects, tasks] = await Promise.all([this.getUsers(), this.getProjects(), this.getTasks()])

    const completedTasks = tasks.filter((task) => task.completed).length
    const activeTasks = tasks.filter((task) => !task.completed).length
    const activeProjects = projects.filter((project) => project.status === "active").length

    return {
      totalUsers: users.length,
      totalProjects: projects.length,
      totalTasks: tasks.length,
      completedTasks,
      activeTasks,
      activeProjects,
      completionRate: tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0,
    }
  },
}
