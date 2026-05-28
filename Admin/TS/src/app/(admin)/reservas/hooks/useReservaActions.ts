'use client'
import { confirmAction, notifyError, notifyOk } from '@/lib/confirm'
import { ApiError, api } from '@/lib/api'
import type { ReservaResumen } from '@/types/reservation'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import type { ReservaAction } from '../components/ReservaCard'

interface Options {
  onChange?: () => void | Promise<void>
}

export function useReservaActions({ onChange }: Options = {}) {
  const router = useRouter()

  const handleAction = useCallback(
    async (action: ReservaAction, reserva: ReservaResumen) => {
      if (action === 'view') {
        router.push(`/reservas/${reserva.id}`)
        return
      }

      const flows: Record<
        Exclude<ReservaAction, 'view'>,
        { confirm: Parameters<typeof confirmAction>[0]; endpoint: string; successMsg: string }
      > = {
        confirm: {
          confirm: {
            title: 'Confirmar pago',
            text: `Marcar la reserva ${reserva.code} como pagada y confirmada.`,
            variant: 'success',
            confirmText: 'Sí, confirmar',
          },
          endpoint: `/admin/reservations/${reserva.id}/confirm`,
          successMsg: 'Reserva confirmada',
        },
        reject: {
          confirm: {
            title: 'Rechazar pago',
            text: `Esta acción rechaza el comprobante de la reserva ${reserva.code}.`,
            variant: 'danger',
            confirmText: 'Rechazar',
            requireReason: true,
            inputPlaceholder: 'Motivo del rechazo',
          },
          endpoint: `/admin/reservations/${reserva.id}/reject`,
          successMsg: 'Pago rechazado',
        },
        cancel: {
          confirm: {
            title: 'Cancelar reserva',
            text: `¿Seguro que quieres cancelar la reserva ${reserva.code}?`,
            variant: 'danger',
            confirmText: 'Sí, cancelar',
            requireReason: true,
            inputPlaceholder: 'Motivo de cancelación',
          },
          endpoint: `/admin/reservations/${reserva.id}/cancel`,
          successMsg: 'Reserva cancelada',
        },
        refund: {
          confirm: {
            title: 'Procesar reembolso',
            text: `Esta acción procesa el reembolso de la reserva ${reserva.code}.`,
            variant: 'warning',
            confirmText: 'Procesar',
          },
          endpoint: `/admin/reservations/${reserva.id}/process-refund`,
          successMsg: 'Reembolso procesado',
        },
        resend_payment: {
          confirm: {
            title: 'Reenviar instrucciones',
            text: `Se enviarán nuevamente las instrucciones de pago al cliente.`,
            variant: 'info',
            confirmText: 'Reenviar',
          },
          endpoint: `/admin/reservations/${reserva.id}/resend-payment-instructions`,
          successMsg: 'Instrucciones reenviadas',
        },
        reschedule: {
          confirm: {
            title: 'Reprogramar reserva',
            text: 'La reprogramación se hace desde el detalle de la reserva.',
            variant: 'info',
            confirmText: 'Ir al detalle',
          },
          endpoint: '',
          successMsg: '',
        },
      }

      if (action === 'reschedule') {
        const { confirmed } = await confirmAction(flows.reschedule.confirm)
        if (confirmed) router.push(`/reservas/${reserva.id}?action=reschedule`)
        return
      }

      const flow = flows[action]
      const { confirmed, reason } = await confirmAction(flow.confirm)
      if (!confirmed) return

      try {
        await api.post(flow.endpoint, reason ? { reason } : undefined)
        await notifyOk(flow.successMsg)
        await onChange?.()
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error al ejecutar la acción'
        await notifyError(msg)
      }
    },
    [router, onChange],
  )

  return { handleAction }
}