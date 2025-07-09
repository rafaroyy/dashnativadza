import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface User {
  id: string
  email: string
  name: string
  profile_image_url?: string
  online_status?: boolean
  created_at: string
  updated_at: string
}

export interface Workspace {
  id: string
  name: string
  description?: string
  owner_id: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  description?: string
  workspace_id: string
  status: string
  color: string
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  title: string
  description?: string
  project_id: string
  assignee_id?: string
  status: string
  priority: string
  due_date?: string
  created_at: string
  updated_at: string
  assignee?: User
  project?: Project
}

export interface Message {
  id: string
  content: string
  sender_id: string
  receiver_id: string
  created_at: string
}

export interface WorkspaceMember {
  id: string
  workspace_id: string
  user_id: string
  role: string
  created_at: string
  user?: User
}

export interface ProjectMember {
  id: string
  project_id: string
  user_id: string
  role: string
  created_at: string
  user?: User
}

export const dbOperations = {
  // Users
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase.from("users").select("*").order("name")

    if (error) throw error
    return data || []
  },

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

    if (error) throw error
    return data
  },

  async createUser(user: Omit<User, "id" | "created_at" | "updated_at">): Promise<User> {
    const { data, error } = await supabase.from("users").insert(user).select().single()

    if (error) throw error
    return data
  },

  // Workspaces
  async getWorkspaces(): Promise<Workspace[]> {
    const { data, error } = await supabase.from("workspaces").select("*").order("name")

    if (error) throw error
    return data || []
  },

  async createWorkspace(workspace: Omit<Workspace, "id" | "created_at" | "updated_at">): Promise<Workspace> {
    const { data, error } = await supabase.from("workspaces").insert(workspace).select().single()

    if (error) throw error
    return data
  },

  // Projects
  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase.from("projects").select("*").order("name")

    if (error) throw error
    return data || []
  },

  async getProjectsByWorkspace(workspaceId: string): Promise<Project[]> {
    const { data, error } = await supabase.from("projects").select("*").eq("workspace_id", workspaceId).order("name")

    if (error) throw error
    return data || []
  },

  async createProject(project: Omit<Project, "id" | "created_at" | "updated_at">): Promise<Project> {
    const { data, error } = await supabase.from("projects").insert(project).select().single()

    if (error) throw error
    return data
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const { data, error } = await supabase
      .from("projects")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteProject(id: string): Promise<void> {
    const { error } = await supabase.from("projects").delete().eq("id", id)

    if (error) throw error
  },

  // Tasks
  async getTasks(): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select(`
        *,
        assignee:users(id, name, email, profile_image_url),
        project:projects(id, name, color)
      `)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  },

  async getTasksByProject(projectId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select(`
        *,
        assignee:users(id, name, email, profile_image_url),
        project:projects(id, name, color)
      `)
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  },

  async createTask(task: Omit<Task, "id" | "created_at" | "updated_at">): Promise<Task> {
    const { data, error } = await supabase
      .from("tasks")
      .insert(task)
      .select(`
        *,
        assignee:users(id, name, email, profile_image_url),
        project:projects(id, name, color)
      `)
      .single()

    if (error) throw error
    return data
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const { data, error } = await supabase
      .from("tasks")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select(`
        *,
        assignee:users(id, name, email, profile_image_url),
        project:projects(id, name, color)
      `)
      .single()

    if (error) throw error
    return data
  },

  async deleteTask(id: string): Promise<void> {
    const { error } = await supabase.from("tasks").delete().eq("id", id)

    if (error) throw error
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

    if (error) throw error
    return data || []
  },

  async sendMessage(message: Omit<Message, "id" | "created_at">): Promise<Message> {
    const { data, error } = await supabase.from("messages").insert(message).select().single()

    if (error) throw error
    return data
  },

  // Workspace Members
  async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    const { data, error } = await supabase
      .from("workspace_members")
      .select(`
        *,
        user:users(id, name, email, profile_image_url, online_status)
      `)
      .eq("workspace_id", workspaceId)
      .order("created_at")

    if (error) throw error
    return data || []
  },

  async addWorkspaceMember(member: Omit<WorkspaceMember, "id" | "created_at">): Promise<WorkspaceMember> {
    const { data, error } = await supabase
      .from("workspace_members")
      .insert(member)
      .select(`
        *,
        user:users(id, name, email, profile_image_url, online_status)
      `)
      .single()

    if (error) throw error
    return data
  },

  async removeWorkspaceMember(workspaceId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from("workspace_members")
      .delete()
      .eq("workspace_id", workspaceId)
      .eq("user_id", userId)

    if (error) throw error
  },

  // Project Members
  async getProjectMembers(projectId: string): Promise<ProjectMember[]> {
    const { data, error } = await supabase
      .from("project_members")
      .select(`
        *,
        user:users(id, name, email, profile_image_url, online_status)
      `)
      .eq("project_id", projectId)
      .order("created_at")

    if (error) throw error
    return data || []
  },

  async addProjectMember(member: Omit<ProjectMember, "id" | "created_at">): Promise<ProjectMember> {
    const { data, error } = await supabase
      .from("project_members")
      .insert(member)
      .select(`
        *,
        user:users(id, name, email, profile_image_url, online_status)
      `)
      .single()

    if (error) throw error
    return data
  },

  async removeProjectMember(projectId: string, userId: string): Promise<void> {
    const { error } = await supabase.from("project_members").delete().eq("project_id", projectId).eq("user_id", userId)

    if (error) throw error
  },
}
