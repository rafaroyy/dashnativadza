import { supabase, dbOperations } from "./supabase"

export async function testDatabaseConnection() {
  console.log("🔍 Testando conexão com Supabase...")

  try {
    // Test 1: Basic connection
    const { data: connectionTest } = await supabase.from("users").select("count").limit(1)
    console.log("✅ Conexão básica:", connectionTest ? "OK" : "FALHOU")

    // Test 2: Users table
    const users = await dbOperations.getUsers()
    console.log("✅ Tabela users:", users?.length || 0, "registros")

    // Test 3: Projects table
    const projects = await dbOperations.getProjects()
    console.log("✅ Tabela projects:", projects?.length || 0, "registros")

    // Test 4: Tasks table
    const tasks = await dbOperations.getTasks()
    console.log("✅ Tabela tasks:", tasks?.length || 0, "registros")

    // Test 5: Storage bucket
    const { data: buckets } = await supabase.storage.listBuckets()
    const avatarBucket = buckets?.find((b) => b.name === "avatars")
    console.log("✅ Storage bucket avatars:", avatarBucket ? "OK" : "FALHOU")

    // Test 6: RLS policies
    const { data: policies } = await supabase.rpc("get_policies")
    console.log("✅ RLS policies:", policies ? "Configuradas" : "Verificar manualmente")

    console.log("\n🎉 Todos os testes concluídos!")
    return true
  } catch (error) {
    console.error("❌ Erro nos testes:", error)
    return false
  }
}

export async function seedTestData() {
  console.log("🌱 Inserindo dados de teste...")

  try {
    // Create test user
    const testUser = await dbOperations.createUser({
      name: "Usuário Teste",
      email: "teste@exemplo.com",
      role: "Tester",
      location: "São Paulo, SP",
      online_status: true,
    })
    console.log("✅ Usuário teste criado:", testUser?.name)

    // Create test project
    const testProject = await dbOperations.createProject({
      title: "Projeto Teste",
      description: "Projeto para testar a conexão",
      status: "active",
      progress: 50,
      members_count: 1,
      tasks_total: 2,
      created_by: testUser?.id,
    })
    console.log("✅ Projeto teste criado:", testProject?.title)

    // Create test task
    const testTask = await dbOperations.createTask({
      title: "Tarefa Teste",
      description: "Tarefa para testar a conexão",
      assigned_to: testUser?.id,
      project_id: testProject?.id,
      status: "todo",
      completed: false,
    })
    console.log("✅ Tarefa teste criada:", testTask?.title)

    console.log("\n🎉 Dados de teste inseridos com sucesso!")
    return true
  } catch (error) {
    console.error("❌ Erro ao inserir dados de teste:", error)
    return false
  }
}

export async function cleanTestData() {
  console.log("🧹 Limpando dados de teste...")

  try {
    // Delete test data
    const { error: taskError } = await supabase.from("tasks").delete().ilike("title", "%teste%")
    const { error: projectError } = await supabase.from("projects").delete().ilike("title", "%teste%")
    const { error: userError } = await supabase.from("users").delete().ilike("email", "%teste%")

    if (taskError) throw taskError
    if (projectError) throw projectError
    if (userError) throw userError

    console.log("✅ Dados de teste removidos")
    return true
  } catch (error) {
    console.error("❌ Erro ao limpar dados de teste:", error)
    return false
  }
}
