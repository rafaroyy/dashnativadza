import { cookies } from "next/headers"
import { Button } from "@/components/ui/button"
import { signOut } from "@/app/auth/actions"

export default function Header() {
  const cookieStore = cookies()
  const userSession = cookieStore.get("user_session")

  let user = null
  if (userSession) {
    try {
      user = JSON.parse(userSession.value)
    } catch {
      // Invalid session
    }
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">DigitalZ</h1>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Olá, {user.name}</span>
              <form action={signOut}>
                <Button variant="outline" size="sm" type="submit">
                  Sair
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
