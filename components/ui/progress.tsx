"use client"

import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

export function Progress({ className, value, max = 100, ...props }: ProgressPrimitive.ProgressProps) {
  return (
    <ProgressPrimitive.Root
      max={max}
      value={value}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-muted", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        style={{ width: `${value ?? 0}%` }}
        className="h-full flex-1 rounded-full bg-primary transition-all"
      />
    </ProgressPrimitive.Root>
  )
}
