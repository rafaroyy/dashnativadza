"use client"

import { useTransition } from "react"
import { signOut } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function Header() {
  const [isPending, startTransition] = useTransition()

  return (
    <header className={cn("flex h-14 items-center justify-between border-b px-4")}>
      <span className="font-semibold">Dashboard</span>
      <Button variant="secondary" onClick={() => startTransition(() => signOut())} disabled={isPending}>
        {isPending ? "…" : "Logout"}
      </Button>
    </header>
  )
}
