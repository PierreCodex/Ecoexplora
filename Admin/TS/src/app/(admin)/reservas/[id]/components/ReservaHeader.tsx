'use client'
import StatusBadge from '@/components/StatusBadge'
import Icon from '@/components/wrappers/Icon'
import type { ReservaDetail } from '@/types/reservation'
import dayjs from 'dayjs'
import { Card, CardBody } from 'react-bootstrap'

const initialsOf = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .join('') || '?'

const ReservaHeader = ({ reserva }: { reserva: ReservaDetail }) => {
  const c = reserva.customer
  return (
    <Card>
      <CardBody>
        <div className="d-flex flex-wrap align-items-start gap-3">
          <div className="avatar avatar-xl bg-primary-subtle text-primary d-flex align-items-center justify-content-center rounded-circle fw-bold fs-22">
            {initialsOf(c.full_name)}
          </div>

          <div className="flex-grow-1 min-w-0">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
              <h3 className="mb-0">{c.full_name}</h3>
              <StatusBadge status={reserva.status} />
            </div>

            <div className="text-muted d-flex flex-wrap gap-3 fs-13">
              {c.dni && (
                <span className="d-inline-flex align-items-center gap-1">
                  <Icon icon="id-card" className="fs-14" />
                  DNI {c.dni}
                </span>
              )}
              {c.email && (
                <span className="d-inline-flex align-items-center gap-1">
                  <Icon icon="mail" className="fs-14" />
                  {c.email}
                </span>
              )}
              {c.phone && (
                <span className="d-inline-flex align-items-center gap-1">
                  <Icon icon="phone" className="fs-14" />
                  {c.phone}
                </span>
              )}
            </div>

            <hr className="border-light my-3" />

            <div className="d-flex flex-wrap gap-4 fs-13">
              <div>
                <small className="text-muted d-block">Código</small>
                <span className="fw-semibold">{reserva.code}</span>
              </div>
              <div>
                <small className="text-muted d-block">Tour</small>
                <span className="fw-semibold">{reserva.tour_variant.tour_name}</span>
                <small className="text-muted d-block">{reserva.tour_variant.variant_label}</small>
              </div>
              <div>
                <small className="text-muted d-block">Servicio</small>
                <span className="fw-semibold">{dayjs(reserva.service_date).format('DD/MM/YYYY')}</span>
              </div>
              <div>
                <small className="text-muted d-block">Pax</small>
                <span className="fw-semibold">{reserva.pax_count}</span>
              </div>
              <div>
                <small className="text-muted d-block">Creada</small>
                <span className="fw-semibold">{dayjs(reserva.created_at).format('DD/MM/YYYY HH:mm')}</span>
              </div>
              {reserva.expires_at && (
                <div>
                  <small className="text-muted d-block">Expira</small>
                  <span className="fw-semibold text-warning">
                    {dayjs(reserva.expires_at).format('DD/MM/YYYY HH:mm')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default ReservaHeader