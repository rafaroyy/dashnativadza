"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("user_token")
        const isAuth = !!token
        setIsAuthenticated(isAuth)

        // Public routes that don't require authentication
        const publicRoutes = ["/", "/login"]

        if (!isAuth && !publicRoutes.includes(pathname)) {
          router.push("/login")
        }
      }
    }

    checkAuth()
  }, [router, pathname])

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-digitalz-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-digitalz-cyan"></div>
      </div>
    )
  }

  return <>{children}</>
}
