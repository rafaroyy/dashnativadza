import { getUser } from "@/lib/supabase/server"

export default async function Header() {
  const user = await getUser()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Bem-vindo ao Dashboard</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">{user?.email || "Usuário"}</span>
        </div>
      </div>
    </header>
  )
}
