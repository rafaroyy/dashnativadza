import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Junta classes de forma condicional preservando a ordem do Tailwind
 */
export function cn(...inputs: Array<string | undefined | null | false>) {
  return twMerge(clsx(inputs))
}
