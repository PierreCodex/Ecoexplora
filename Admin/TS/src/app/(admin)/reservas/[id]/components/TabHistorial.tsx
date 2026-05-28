'use client'
import Icon from '@/components/wrappers/Icon'
import type { ReservaDetail, ReservaEvent } from '@/types/reservation'
import dayjs from 'dayjs'
import { Alert, Card, CardBody, CardTitle } from 'react-bootstrap'

const EVENT_META: Record<string, { icon: string; color: string; label: string }> = {
  reservation_created: { icon: 'sparkles', color: 'primary', label: 'Reserva creada' },
  payment_instructions_sent: { icon: 'send', color: 'info', label: 'Instrucciones enviadas' },
  receipt_uploaded: { icon: 'upload', color: 'info', label: 'Comprobante cargado' },
  payment_verified: { icon: 'circle-check', color: 'success', label: 'Pago verificado' },
  payment_rejected: { icon: 'circle-x', color: 'danger', label: 'Pago rechazado' },
  reservation_confirmed: { icon: 'flag-check', color: 'success', label: 'Reserva confirmada' },
  reservation_cancelled: { icon: 'ban', color: 'danger', label: 'Reserva cancelada' },
  cancellation_requested: { icon: 'alert-triangle', color: 'warning', label: 'Cancelación solicitada' },
  refund_processed: { icon: 'banknote-arrow-down', color: 'warning', label: 'Reembolso procesado' },
  reservation_rescheduled: { icon: 'calendar-clock', color: 'info', label: 'Reprogramada' },
  reservation_completed: { icon: 'star', color: 'primary', label: 'Reserva completada' },
}

const groupByDate = (events: ReservaEvent[]) => {
  const map = new Map<string, ReservaEvent[]>()
  for (const e of events) {
    const day = dayjs(e.created_at).format('YYYY-MM-DD')
    if (!map.has(day)) map.set(day, [])
    map.get(day)!.push(e)
  }
  return Array.from(map.entries()).sort(([a], [b]) => (a < b ? 1 : -1))
}

const TabHistorial = ({ reserva }: { reserva: ReservaDetail }) => {
  const events = reserva.events ?? []

  if (events.length === 0) {
    return <Alert variant="info">Aún no hay eventos registrados para esta reserva.</Alert>
  }

  const grouped = groupByDate(events)

  return (
    <Card>
      <CardBody>
        <CardTitle as="h5" className="mb-3">
          Historial
        </CardTitle>

        <div className="timeline timeline-icon-bordered">
          {grouped.map(([day, dayEvents]) => (
            <div key={day} className="mb-3">
              <h6 className="text-muted fw-bold mb-3">{dayjs(day).format('DD MMMM YYYY')}</h6>
              {dayEvents.map((e) => {
                const meta = EVENT_META[e.type] ?? { icon: 'circle', color: 'secondary', label: e.type }
                return (
                  <div key={e.id} className="timeline-item d-flex align-items-start">
                    <div className="timeline-time pe-3 text-muted">{dayjs(e.created_at).format('HH:mm')}</div>
                    <div className="timeline-dot">
                      <Icon icon={meta.icon} className={`fs-xl text-${meta.color}`} />
                    </div>
                    <div className="timeline-content ps-3 pb-4">
                      <p className="mb-1">
                        <strong>{meta.label}</strong>
                        {e.message && <span className="ms-1 text-muted">— {e.message}</span>}
                      </p>
                      {e.actor && (
                        <small className="text-muted">
                          <Icon icon="user" className="me-1 fs-13" />
                          {e.actor}
                        </small>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}

export default TabHistorial