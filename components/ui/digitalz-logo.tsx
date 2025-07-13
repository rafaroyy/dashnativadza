import { cn } from "@/lib/utils"

interface DigitalzLogoProps {
  className?: string
}

export function DigitalzLogo({ className }: DigitalzLogoProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    </div>
  )
}
