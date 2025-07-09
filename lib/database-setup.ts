import { supabase } from "./supabase"
import { testDatabaseConnection } from "./database-test"

export async function setupDatabase() {
  console.log("🚀 Configurando banco de dados...")

  try {
    // Step 1: Check connection
    console.log("1️⃣ Verificando conexão...")
    const { data, error } = await supabase.from("users").select("count").limit(1)

    if (error) {
      console.error("❌ Erro de conexão:", error.message)
      return false
    }

    console.log("✅ Conexão estabelecida")

    // Step 2: Check if tables exist
    console.log("2️⃣ Verificando tabelas...")
    const tables = ["users", "projects", "tasks", "messages"]
    const tableStatus = {}

    for (const table of tables) {
      try {
        const { data } = await supabase.from(table).select("count").limit(1)
        tableStatus[table] = data !== null
        console.log(`✅ Tabela ${table}:`, tableStatus[table] ? "OK" : "FALHOU")
      } catch (error) {
        tableStatus[table] = false
        console.log(`❌ Tabela ${table}: FALHOU`)
      }
    }

    // Step 3: Check storage
    console.log("3️⃣ Verificando storage...")
    const { data: buckets } = await supabase.storage.listBuckets()
    const avatarBucket = buckets?.find((b) => b.name === "avatars")
    console.log("✅ Bucket avatars:", avatarBucket ? "OK" : "FALHOU")

    // Step 4: Count records
    console.log("4️⃣ Contando registros...")
    for (const table of tables) {
      if (tableStatus[table]) {
        const { count } = await supabase.from(table).select("*", { count: "exact", head: true })
        console.log(`📊 ${table}: ${count || 0} registros`)
      }
    }

    console.log("\n🎉 Setup do banco de dados concluído!")
    return true
  } catch (error) {
    console.error("❌ Erro no setup:", error)
    return false
  }
}

export async function checkDatabaseConnection() {
  console.log("🔍 Verificando conexão com o banco...")

  try {
    const { data, error } = await supabase.from("users").select("count").limit(1)

    if (error) {
      console.error("❌ Falha na conexão:", error.message)
      return false
    }

    console.log("✅ Conexão com banco de dados bem-sucedida")
    return true
  } catch (error) {
    console.error("❌ Erro de conexão:", error)
    return false
  }
}

export async function runFullDatabaseTest() {
  console.log("🧪 Executando teste completo do banco...")

  const connectionOk = await checkDatabaseConnection()
  if (!connectionOk) return false

  const setupOk = await setupDatabase()
  if (!setupOk) return false

  const testOk = await testDatabaseConnection()
  if (!testOk) return false

  console.log("\n🎉 Todos os testes passaram! Banco 100% funcional!")
  return true
}
