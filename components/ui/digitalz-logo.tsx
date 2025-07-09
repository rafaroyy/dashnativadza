"use client"

import { cn } from "@/lib/utils"

interface DigitalzLogoProps {
  className?: string
}

export function DigitalzLogo({ className }: DigitalzLogoProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
        <span className="text-sm font-bold text-white">D</span>
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        DigitalZ
      </span>
    </div>
  )
}
