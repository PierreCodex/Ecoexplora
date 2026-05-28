// Shared types for the Catálogo module (Tours, Variantes, Destinos, Políticas, FAQs, Empresa).

export interface Tour {
  id: string
  slug: string
  name: string
  base_description?: string | null
  image_url?: string | null
  active: boolean
  display_order: number
  variants_count?: number
  created_at?: string
  updated_at?: string
}

export interface TourFormValues {
  name: string
  slug: string
  base_description: string
  active: boolean
  display_order: number
}

export type PriceCurrency = 'PEN' | 'USD'
export type PriceUnit = 'per_person' | 'per_person_per_day' | 'group'
export type DurationType = 'half_day' | 'full_day' | 'multi_day'

export interface VariantDestinationRef {
  id: string
  slug: string
  name: string
  latitude?: number | null
  longitude?: number | null
}

export interface VariantTourRef {
  id: string
  slug: string
  name: string
}

export interface VariantActivity {
  id?: string  // ausente cuando aún no se ha guardado (rows nuevas)
  variant_id?: string
  day: number  // 1-indexed
  display_order?: number
  start_time: string | null  // 'HH:MM' o null para bloque flexible
  end_time: string | null
  title: string
  description?: string | null
  destination_id?: string | null
  destination_name?: string | null
}

export interface TourVariant {
  id: string
  tour_id: string
  tour?: VariantTourRef | null
  slug: string
  variant_label: string
  summary?: string | null
  active: boolean
  price_amount: number
  price_currency: PriceCurrency
  price_unit: PriceUnit
  price_total_amount?: number | null
  payment_terms_json?: Record<string, unknown>
  duration_type: DurationType
  duration_hours?: number | null
  duration_days?: number | null
  duration_nights?: number | null
  default_daily_capacity: number
  available_months?: number[] | null
  includes_lodging: boolean
  is_international: boolean
  includes_text?: string | null
  recommendations_text?: string | null
  important_notes_text?: string | null
  destinations: VariantDestinationRef[]
  activities: VariantActivity[]
  created_at?: string
  updated_at?: string
}

export const PRICE_UNIT_LABEL: Record<PriceUnit, string> = {
  per_person: 'Por persona',
  per_person_per_day: 'Por persona / día',
  group: 'Por grupo',
}

export const DURATION_TYPE_LABEL: Record<DurationType, string> = {
  half_day: 'Medio día',
  full_day: 'Día completo',
  multi_day: 'Multi-día',
}

export const MONTH_LABEL: Record<number, string> = {
  1: 'Ene', 2: 'Feb', 3: 'Mar', 4: 'Abr', 5: 'May', 6: 'Jun',
  7: 'Jul', 8: 'Ago', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dic',
}

export interface Destination {
  id: string
  slug: string
  name: string
  latitude?: number | null
  longitude?: number | null
  aliases?: string[]
  created_at?: string
  updated_at?: string
}

export interface Policy {
  id: string
  slug: string
  title: string
  topic?: string | null
  content: string
  priority: number
  active: boolean
  created_at?: string
  updated_at?: string
}

export interface FAQ {
  id: string
  slug: string
  question: string
  answer: string
  topic?: string | null
  priority: number
  active: boolean
  created_at?: string
  updated_at?: string
}

export interface CompanyOffice {
  name?: string
  address?: string
  phone?: string
  email?: string
  schedule?: string
}

export interface Company {
  id?: string
  name: string
  short_description?: string | null
  long_description?: string | null
  phone?: string | null
  email?: string | null
  website?: string | null
  offices?: CompanyOffice[]
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}