import { cn } from "@/lib/utils"

interface DigitalzLogoProps {
  className?: string
}

export function DigitalzLogo({ className }: DigitalzLogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-lg">D</span>
      </div>
      <span className="text-xl font-bold gradient-text">DigitalZ</span>
    </div>
  )
}
