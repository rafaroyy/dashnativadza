"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm \
  ring-offset-background file:border-0 file:bg-transparent \
  file:text-sm file:font-medium placeholder:text-muted-foreground \
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring \
  focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-10",
        sm: "h-8 text-xs",
        lg: "h-12 text-base",
      },
    },
    defaultVariants: { size: "default" },
  },
)

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, size, ...props }, ref) => (
  <input ref={ref} className={cn(inputVariants({ size, className }))} {...props} />
))
Input.displayName = "Input"

export { Input }
