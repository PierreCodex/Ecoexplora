export type ReservaStatus =
  | 'pending_payment'
  | 'pending_verification'
  | 'confirmed'
  | 'cancellation_requested'
  | 'rejected'
  | 'cancelled'
  | 'expired'
  | 'completed'

export const RESERVA_STATUS_META: Record<ReservaStatus, { label: string; variant: string; icon: string }> = {
  pending_payment: { label: 'Pendiente Pago', variant: 'warning', icon: 'tabler:credit-card' },
  pending_verification: { label: 'Pendiente Verificación', variant: 'info', icon: 'tabler:hourglass' },
  confirmed: { label: 'Confirmada', variant: 'success', icon: 'tabler:circle-check' },
  cancellation_requested: { label: 'Cancelación solicitada', variant: 'danger', icon: 'tabler:alert-triangle' },
  rejected: { label: 'Rechazada', variant: 'dark', icon: 'tabler:ban' },
  cancelled: { label: 'Cancelada', variant: 'secondary', icon: 'tabler:x' },
  expired: { label: 'Expirada', variant: 'secondary', icon: 'tabler:clock-x' },
  completed: { label: 'Completada', variant: 'primary', icon: 'tabler:flag-check' },
}

export const RESERVA_STATUS_ORDER: ReservaStatus[] = [
  'pending_payment',
  'pending_verification',
  'confirmed',
  'cancellation_requested',
  'completed',
  'rejected',
  'cancelled',
  'expired',
]

export interface ReservaCustomer {
  id: string
  full_name: string
  dni?: string
  email?: string
  phone?: string
}

export interface ReservaTourVariant {
  id: string
  tour_slug: string
  tour_name: string
  variant_label: string
}

export interface ReservaResumen {
  id: string
  code: string
  customer_name: string
  tour_name: string
  variant_label: string
  service_date: string
  pax_count: number
  total_amount: number
  currency: string
  status: ReservaStatus
}

export interface ReservaItinerarioStep {
  order: number
  title: string
  description?: string
  time?: string
}

export interface ReservaSnapshot {
  price_amount: number
  price_currency: string
  cancellation_policy_text?: string
  itinerary: ReservaItinerarioStep[]
}

export interface ReservaReceipt {
  id: string
  status: 'pending' | 'approved' | 'rejected'
  uploaded_at: string
  notes?: string
  signed_url?: string
}

export interface ReservaEvent {
  id: string
  type: string
  message?: string
  created_at: string
  actor?: string
}

export interface ReservaDetail {
  id: string
  code: string
  status: ReservaStatus
  service_date: string
  pax_count: number
  total_amount: number
  currency: string
  expires_at?: string
  created_at: string
  customer: ReservaCustomer
  tour_variant: ReservaTourVariant
  snapshot: ReservaSnapshot
  receipt?: ReservaReceipt
  events: ReservaEvent[]
}