export interface AvailabilityDay {
  date: string  // YYYY-MM-DD
  capacity: number
  reserved: number
  remaining: number
  is_override: boolean
  blocked: boolean
  block_scope: 'global' | 'variant' | null
  block_id: string | null
  block_reason: string | null
}

export interface DateBlock {
  id: string
  date: string
  tour_variant_id: string | null
  reason: string | null
  is_global: boolean
  created_at?: string | null
}

export type DayColor = 'success' | 'warning' | 'danger' | 'secondary'

export function dayColor(day: AvailabilityDay | undefined): DayColor {
  if (!day) return 'success'
  if (day.blocked) return 'secondary'
  if (day.remaining <= 0) return 'danger'
  if (day.remaining <= 3) return 'warning'
  return 'success'
}