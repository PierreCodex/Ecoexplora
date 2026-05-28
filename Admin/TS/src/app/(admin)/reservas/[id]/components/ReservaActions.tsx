'use client'
import { confirmAction, notifyError, notifyOk } from '@/lib/confirm'
import { ApiError, api } from '@/lib/api'
import type { ReservaDetail } from '@/types/reservation'
import Icon from '@/components/wrappers/Icon'
import { Button, Card, CardBody, CardTitle } from 'react-bootstrap'

interface Props {
  reserva: ReservaDetail
  onChanged: () => void | Promise<void>
}

interface ActionDef {
  key: string
  label: string
  icon: string
  variant: string
  requireReason?: boolean
  variantConfirm: 'warning' | 'danger' | 'success' | 'info'
  endpoint: string
  successMsg: string
}

const actionsByStatus = (reserva: ReservaDetail): ActionDef[] => {
  const id = reserva.id
  switch (reserva.status) {
    case 'pending_payment':
      return [
        {
          key: 'resend',
          label: 'Reenviar instrucciones',
          icon: 'send',
          variant: 'info',
          variantConfirm: 'info',
          endpoint: `/admin/reservations/${id}/resend-payment-instructions`,
          successMsg: 'Instrucciones reenviadas',
        },
        {
          key: 'cancel',
          label: 'Cancelar reserva',
          icon: 'ban',
          variant: 'outline-danger',
          variantConfirm: 'danger',
          requireReason: true,
          endpoint: `/admin/reservations/${id}/cancel`,
          successMsg: 'Reserva cancelada',
        },
      ]
    case 'pending_verification':
      return [
        {
          key: 'confirm',
          label: 'Confirmar pago',
          icon: 'circle-check',
          variant: 'success',
          variantConfirm: 'success',
          endpoint: `/admin/reservations/${id}/confirm`,
          successMsg: 'Reserva confirmada',
        },
        {
          key: 'reject',
          label: 'Rechazar pago',
          icon: 'circle-x',
          variant: 'outline-danger',
          variantConfirm: 'danger',
          requireReason: true,
          endpoint: `/admin/reservations/${id}/reject`,
          successMsg: 'Pago rechazado',
        },
      ]
    case 'confirmed':
      return [
        {
          key: 'reschedule',
          label: 'Reprogramar',
          icon: 'calendar-clock',
          variant: 'info',
          variantConfirm: 'info',
          endpoint: `/admin/reservations/${id}/reschedule`,
          successMsg: 'Reserva reprogramada',
        },
        {
          key: 'cancel',
          label: 'Cancelar',
          icon: 'ban',
          variant: 'outline-danger',
          variantConfirm: 'danger',
          requireReason: true,
          endpoint: `/admin/reservations/${id}/cancel`,
          successMsg: 'Reserva cancelada',
        },
        {
          key: 'refund',
          label: 'Reembolsar',
          icon: 'banknote-arrow-down',
          variant: 'outline-warning',
          variantConfirm: 'warning',
          endpoint: `/admin/reservations/${id}/process-refund`,
          successMsg: 'Reembolso procesado',
        },
      ]
    case 'cancellation_requested':
      return [
        {
          key: 'refund',
          label: 'Procesar reembolso',
          icon: 'banknote-arrow-down',
          variant: 'warning',
          variantConfirm: 'warning',
          endpoint: `/admin/reservations/${id}/process-refund`,
          successMsg: 'Reembolso procesado',
        },
      ]
    default:
      return []
  }
}

const ReservaActions = ({ reserva, onChanged }: Props) => {
  const actions = actionsByStatus(reserva)

  if (actions.length === 0) {
    return (
      <Card className="card-top-sticky">
        <CardBody>
          <CardTitle as="h5" className="mb-2">
            Acciones
          </CardTitle>
          <p className="text-muted fs-13 mb-0">No hay acciones disponibles para este estado.</p>
        </CardBody>
      </Card>
    )
  }

  const onClick = async (a: ActionDef) => {
    const { confirmed, reason } = await confirmAction({
      title: a.label,
      text: `Reserva ${reserva.code}`,
      variant: a.variantConfirm,
      requireReason: a.requireReason,
      confirmText: a.label,
    })
    if (!confirmed) return
    try {
      await api.post(a.endpoint, reason ? { reason } : undefined)
      await notifyOk(a.successMsg)
      await onChanged()
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error al ejecutar la acción'
      await notifyError(msg)
    }
  }

  return (
    <Card className="card-top-sticky">
      <CardBody>
        <CardTitle as="h5" className="mb-3">
          Acciones
        </CardTitle>
        <div className="d-grid gap-2">
          {actions.map((a) => (
            <Button key={a.key} variant={a.variant} onClick={() => onClick(a)}>
              <Icon icon={a.icon} className="me-2" />
              {a.label}
            </Button>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}

export default ReservaActions