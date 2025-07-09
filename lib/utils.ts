/**
 * Utility helpers shared across the app.
 * Currently just `cn`, a Tailwind variants helper.
 */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}
