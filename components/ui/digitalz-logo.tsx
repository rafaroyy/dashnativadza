import { cn } from "@/lib/utils"

interface DigitalzLogoProps {
  className?: string
}

export function DigitalzLogo({ className }: DigitalzLogoProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-sm">D</span>
      </div>
      <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        DigitalZ
      </span>
    </div>
  )
}
