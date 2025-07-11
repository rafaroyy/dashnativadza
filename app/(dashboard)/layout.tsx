import type React from "react"
import { Header } from "@/components/layout/header"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-digitalz-light-secondary dark:bg-digitalz-dark-secondary">
      <DashboardSidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
