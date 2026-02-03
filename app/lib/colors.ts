/** Accent colors used by the color-cycle composable and service icons. */
export const ACCENT_COLORS = [
  '#3B82F6', // Electric Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#F97316', // Coral
  '#8B5CF6', // Indigo
  '#06B6D4', // Cyan
]

/** Per-service icon color classes (Tailwind arbitrary values). */
export const SERVICE_COLORS: Record<string, string> = {
  custom: 'text-[#3B82F6]',
  redesign: 'text-[#06B6D4]',
  performance: 'text-[#F59E0B]',
  consulting: 'text-[#8B5CF6]',
  ai: 'text-[#F97316]',
  team: 'text-[#10B981]',
}
