import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://bikeyrdxrohmjcctusqx.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpa2V5cmR4cm9obWpjY3R1c3F4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MTg3OTQsImV4cCI6MjA2NzQ5NDc5NH0.iJh3rH9yBVLBB9xuWr7tUTqxd-3Roo3AkPwBbrTHLYg"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role?: string
  location?: string
  profile_image_url?: string
  online_status?: boolean
  created_at?: string
}

export interface Project {
  id: string
  title: string
  description?: string
  status?: string
  progress?: number
  deadline?: string
  members_count?: number
  tasks_total?: number
  created_by?: string
  created_at?: string
}

export interface Space {
  id: string
  name: string
  description?: string
  workspace_id?: string
  user_id?: string
  space_color?: string
  space_avatar?: string
  created_at?: string
}

export interface Task {
  id: string
  title: string
  description: string
  assigned_to: string
  project_id: string
  space_id?: string
  status: string
  due_date: string
  completed: boolean
  priority?: string
  created_at: string
  assigned_to_user?: User
  project?: Project
  space?: Space
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
}

// Helper function to validate UUID
export const isValidUUID = (uuid: string): boolean => {
  if (!uuid || typeof uuid !== "string") return false
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

// Helper function to get current user
export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

// Helper functions for database operations
export const dbOperations = {
  // Users
  async getUsers() {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, phone, role, location, profile_image_url, online_status")
      .order("name", { ascending: true })

    if (error) {
      console.error("Error fetching users:", error)
      throw new Error(`Erro ao carregar usuários: ${error.message}`)
    }
    return data || []
  },

  async createUser(user: Omit<User, "id" | "created_at">) {
    const { data, error } = await supabase.from("users").insert([user]).select()

    if (error) {
      console.error("Error creating user:", error)
      throw new Error(`Erro ao criar usuário: ${error.message}`)
    }
    return data?.[0]
  },

  async updateUser(identifier: string, updates: Partial<User>) {
    let query = supabase.from("users").update(updates)

    // Use email if not a valid UUID, otherwise use id
    if (isValidUUID(identifier)) {
      query = query.eq("id", identifier)
    } else {
      query = query.eq("email", identifier)
    }

    const { data, error } = await query.select()

    if (error) {
      console.error("Error updating user:", error)
      throw new Error(`Erro ao atualizar usuário: ${error.message}`)
    }
    return data?.[0]
  },

  // Projects
  async getProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select("id, title, description, status, progress, deadline")
      .order("title", { ascending: true })

    if (error) {
      console.error("Error fetching projects:", error)
      throw new Error(`Erro ao carregar projetos: ${error.message}`)
    }
    return data || []
  },

  async createProject(project: Omit<Project, "id" | "created_at">) {
    const { data, error } = await supabase.from("projects").insert([project]).select()

    if (error) {
      console.error("Error creating project:", error)
      throw new Error(`Erro ao criar projeto: ${error.message}`)
    }
    return data?.[0]
  },

  async updateProject(id: string, updates: Partial<Project>) {
    if (!isValidUUID(id)) {
      throw new Error("ID do projeto inválido")
    }

    const { data, error } = await supabase.from("projects").update(updates).eq("id", id).select()

    if (error) {
      console.error("Error updating project:", error)
      throw new Error(`Erro ao atualizar projeto: ${error.message}`)
    }
    return data?.[0]
  },

  async deleteProject(id: string) {
    if (!isValidUUID(id)) {
      throw new Error("ID do projeto inválido")
    }

    const { error } = await supabase.from("projects").delete().eq("id", id)

    if (error) {
      console.error("Error deleting project:", error)
      throw new Error(`Erro ao excluir projeto: ${error.message}`)
    }
  },

  // Spaces
  async getSpaces() {
    const { data, error } = await supabase
      .from("spaces")
      .select("id, name, description, space_color, space_avatar")
      .order("name", { ascending: true })

    if (error) {
      console.error("Error fetching spaces:", error)
      throw new Error(`Erro ao carregar espaços: ${error.message}`)
    }
    return data || []
  },

  // Tasks - Fixed relationship queries
  async getTasks() {
    // First get tasks with basic info
    const { data: tasksData, error: tasksError } = await supabase
      .from("tasks")
      .select(`
        id,
        title,
        description,
        assigned_to,
        project_id,
        space_id,
        status,
        due_date,
        completed,
        priority,
        created_at
      `)
      .order("created_at", { ascending: false })

    if (tasksError) {
      console.error("Error fetching tasks:", tasksError)
      throw new Error(`Erro ao carregar tarefas: ${tasksError.message}`)
    }

    if (!tasksData || tasksData.length === 0) {
      return []
    }

    // Get unique user IDs, project IDs, and space IDs
    const userIds = [...new Set(tasksData.map((task) => task.assigned_to).filter(Boolean))]
    const projectIds = [...new Set(tasksData.map((task) => task.project_id).filter(Boolean))]
    const spaceIds = [...new Set(tasksData.map((task) => task.space_id).filter(Boolean))]

    // Fetch related data separately
    const [usersData, projectsData, spacesData] = await Promise.all([
      userIds.length > 0
        ? supabase
            .from("users")
            .select("id, name, email, profile_image_url")
            .in("id", userIds)
            .then(({ data }) => data || [])
        : [],
      projectIds.length > 0
        ? supabase
            .from("projects")
            .select("id, title, description")
            .in("id", projectIds)
            .then(({ data }) => data || [])
        : [],
      spaceIds.length > 0
        ? supabase
            .from("spaces")
            .select("id, name, space_color")
            .in("id", spaceIds)
            .then(({ data }) => data || [])
        : [],
    ])

    // Create lookup maps
    const usersMap = new Map(usersData.map((user) => [user.id, user]))
    const projectsMap = new Map(projectsData.map((project) => [project.id, project]))
    const spacesMap = new Map(spacesData.map((space) => [space.id, space]))

    // Combine data
    const enrichedTasks = tasksData.map((task) => ({
      ...task,
      assigned_to_user: task.assigned_to ? usersMap.get(task.assigned_to) : undefined,
      project: task.project_id ? projectsMap.get(task.project_id) : undefined,
      space: task.space_id ? spacesMap.get(task.space_id) : undefined,
    }))

    return enrichedTasks
  },

  async createTask(task: {
    title: string
    description: string
    assigned_to: string
    project_id: string
    space_id?: string
    status: string
    due_date: string
    priority?: string
  }) {
    // Validate required UUIDs
    if (!isValidUUID(task.assigned_to)) {
      throw new Error("ID do usuário responsável inválido")
    }
    if (!isValidUUID(task.project_id)) {
      throw new Error("ID do projeto inválido")
    }
    if (task.space_id && !isValidUUID(task.space_id)) {
      throw new Error("ID do espaço inválido")
    }

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          title: task.title,
          description: task.description,
          assigned_to: task.assigned_to,
          project_id: task.project_id,
          space_id: task.space_id || null,
          status: task.status,
          due_date: task.due_date,
          priority: task.priority || "normal",
          completed: false,
        },
      ])
      .select()

    if (error) {
      console.error("Error creating task:", error)
      throw new Error(`Erro ao criar tarefa: ${error.message}`)
    }

    if (!data || data.length === 0) {
      throw new Error("Nenhuma tarefa foi criada")
    }

    // Get the created task with related data
    const createdTask = data[0]

    // Fetch related data
    const [userData, projectData, spaceData] = await Promise.all([
      supabase.from("users").select("id, name, email, profile_image_url").eq("id", createdTask.assigned_to).single(),
      supabase.from("projects").select("id, title, description").eq("id", createdTask.project_id).single(),
      createdTask.space_id
        ? supabase.from("spaces").select("id, name, space_color").eq("id", createdTask.space_id).single()
        : { data: null },
    ])

    return {
      ...createdTask,
      assigned_to_user: userData.data,
      project: projectData.data,
      space: spaceData.data,
    }
  },

  async updateTask(id: string, updates: Partial<Task>) {
    if (!isValidUUID(id)) {
      throw new Error("ID da tarefa inválido")
    }

    // Validate UUIDs in updates
    if (updates.assigned_to && !isValidUUID(updates.assigned_to)) {
      throw new Error("ID do usuário responsável inválido")
    }
    if (updates.project_id && !isValidUUID(updates.project_id)) {
      throw new Error("ID do projeto inválido")
    }
    if (updates.space_id && !isValidUUID(updates.space_id)) {
      throw new Error("ID do espaço inválido")
    }

    const { data, error } = await supabase
      .from("tasks")
      .update({
        title: updates.title,
        description: updates.description,
        assigned_to: updates.assigned_to,
        project_id: updates.project_id,
        space_id: updates.space_id,
        status: updates.status,
        due_date: updates.due_date,
        priority: updates.priority,
        completed: updates.completed,
      })
      .eq("id", id)
      .select()

    if (error) {
      console.error("Error updating task:", error)
      throw new Error(`Erro ao atualizar tarefa: ${error.message}`)
    }

    if (!data || data.length === 0) {
      throw new Error("Tarefa não encontrada")
    }

    const updatedTask = data[0]

    // Fetch related data
    const [userData, projectData, spaceData] = await Promise.all([
      supabase.from("users").select("id, name, email, profile_image_url").eq("id", updatedTask.assigned_to).single(),
      supabase.from("projects").select("id, title, description").eq("id", updatedTask.project_id).single(),
      updatedTask.space_id
        ? supabase.from("spaces").select("id, name, space_color").eq("id", updatedTask.space_id).single()
        : { data: null },
    ])

    return {
      ...updatedTask,
      assigned_to_user: userData.data,
      project: projectData.data,
      space: spaceData.data,
    }
  },

  async deleteTask(id: string) {
    if (!isValidUUID(id)) {
      throw new Error("ID da tarefa inválido")
    }

    const { error } = await supabase.from("tasks").delete().eq("id", id)

    if (error) {
      console.error("Error deleting task:", error)
      throw new Error(`Erro ao excluir tarefa: ${error.message}`)
    }
  },

  // Messages
  async getMessages(userId1: string, userId2: string) {
    if (!isValidUUID(userId1) || !isValidUUID(userId2)) {
      throw new Error("IDs dos usuários inválidos")
    }

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`,
      )
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching messages:", error)
      throw new Error(`Erro ao carregar mensagens: ${error.message}`)
    }
    return data || []
  },

  async sendMessage(message: Omit<Message, "id" | "created_at">) {
    if (!isValidUUID(message.sender_id) || !isValidUUID(message.receiver_id)) {
      throw new Error("IDs dos usuários inválidos")
    }

    const { data, error } = await supabase.from("messages").insert([message]).select()

    if (error) {
      console.error("Error sending message:", error)
      throw new Error(`Erro ao enviar mensagem: ${error.message}`)
    }
    return data?.[0]
  },

  // Storage
  async uploadAvatar(file: File, userId: string) {
    if (!isValidUUID(userId)) {
      throw new Error("ID do usuário inválido")
    }

    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}-${Math.random()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { data, error } = await supabase.storage.from("avatars").upload(filePath, file)

    if (error) {
      console.error("Error uploading avatar:", error)
      throw new Error(`Erro ao fazer upload do avatar: ${error.message}`)
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath)

    return publicUrl
  },
}
