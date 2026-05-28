'use client'
import Icon from '@/components/wrappers/Icon'
import { RESERVA_STATUS_META, type ReservaResumen, type ReservaStatus } from '@/types/reservation'
import { Icon as IconifyIcon } from '@iconify/react'
import dayjs from 'dayjs'
import Link from 'next/link'
import { Card, CardBody, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap'

const initialsOf = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .join('') || '?'

const formatMoney = (amount: number, currency: string) =>
  new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: currency || 'PEN',
    maximumFractionDigits: 2,
  }).format(amount)

interface Props {
  reserva: ReservaResumen
  onAction: (action: ReservaAction, reserva: ReservaResumen) => void
}

export type ReservaAction =
  | 'view'
  | 'confirm'
  | 'reject'
  | 'cancel'
  | 'refund'
  | 'resend_payment'
  | 'reschedule'

const actionsByStatus: Record<ReservaStatus, ReservaAction[]> = {
  pending_payment: ['view', 'resend_payment', 'cancel'],
  pending_verification: ['view', 'confirm', 'reject'],
  confirmed: ['view', 'cancel', 'reschedule'],
  cancellation_requested: ['view', 'refund'],
  rejected: ['view'],
  cancelled: ['view'],
  expired: ['view'],
  completed: ['view'],
}

const ACTION_LABEL: Record<ReservaAction, { label: string; icon: string; danger?: boolean }> = {
  view: { label: 'Ver detalle', icon: 'eye' },
  confirm: { label: 'Confirmar pago', icon: 'circle-check' },
  reject: { label: 'Rechazar pago', icon: 'circle-x', danger: true },
  cancel: { label: 'Cancelar reserva', icon: 'ban', danger: true },
  refund: { label: 'Procesar reembolso', icon: 'banknote-arrow-down' },
  resend_payment: { label: 'Reenviar instrucciones', icon: 'send' },
  reschedule: { label: 'Reprogramar', icon: 'calendar-clock' },
}

const ReservaCard = ({ reserva, onAction }: Props) => {
  const meta = RESERVA_STATUS_META[reserva.status]
  const actions = actionsByStatus[reserva.status]

  return (
    <Card className="shadow-sm mb-2">
      <CardBody className="p-3">
        <div className="d-flex align-items-center mb-2">
          <div className="avatar-sm bg-light text-dark rounded-circle d-flex align-items-center justify-content-center fw-bold me-2 fs-12">
            {initialsOf(reserva.customer_name)}
          </div>
          <div className="flex-grow-1 min-w-0">
            <h6 className="mb-0 fw-semibold text-truncate">
              <Link href={`/reservas/${reserva.id}`} className="link-reset stretched-link-disabled">
                {reserva.code}
              </Link>
            </h6>
            <small className="text-muted text-truncate d-block">{reserva.customer_name}</small>
          </div>
          <Dropdown>
            <DropdownToggle
              className="btn btn-icon btn-sm drop-arrow-none btn-ghost-light text-muted content-none"
              type="button">
              <Icon icon="ellipsis-vertical" className="fs-lg" />
            </DropdownToggle>
            <DropdownMenu align="end">
              {actions.map((action) => {
                const a = ACTION_LABEL[action]
                return (
                  <DropdownItem
                    key={action}
                    onClick={() => onAction(action, reserva)}
                    className={a.danger ? 'text-danger' : ''}>
                    <Icon icon={a.icon} className="me-2" />
                    {a.label}
                  </DropdownItem>
                )
              })}
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="mb-2">
          <p className="mb-0 fs-13 fw-medium text-truncate">{reserva.tour_name}</p>
          <small className="text-muted">{reserva.variant_label}</small>
        </div>

        <div className="d-flex justify-content-between align-items-center fs-13">
          <span className="d-inline-flex align-items-center gap-1 text-muted">
            <IconifyIcon icon="tabler:calendar-event" className="fs-14" />
            {dayjs(reserva.service_date).format('DD/MM/YY')}
          </span>
          <span className="d-inline-flex align-items-center gap-1 text-muted">
            <IconifyIcon icon="tabler:users" className="fs-14" />
            {reserva.pax_count} pax
          </span>
          <span className={`fw-semibold text-${meta.variant}`}>
            {formatMoney(reserva.total_amount, reserva.currency)}
          </span>
        </div>
      </CardBody>
    </Card>
  )
}

export default ReservaCard