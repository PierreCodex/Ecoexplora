export type { ReservaResumen, ReservaStatus } from '@/types/reservation'
export { RESERVA_STATUS_META } from '@/types/reservation'

export interface DashboardStats {
  reservas_hoy: number
  reservas_pendientes_verificacion: number
  reservas_pendientes_pago: number
  conversaciones_activas: number
  conversaciones_takeover: number
  ingresos_mes: number
  ingresos_mes_anterior: number
  reservas_por_dia: { date: string; count: number }[]
}