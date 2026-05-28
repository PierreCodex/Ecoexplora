'use client'
import type { ReservaDetail } from '@/types/reservation'
import dayjs from 'dayjs'
import { Card, CardBody, CardTitle, Col, Row } from 'react-bootstrap'

const formatMoney = (amount: number, currency: string) =>
  new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: currency || 'PEN',
    maximumFractionDigits: 2,
  }).format(amount)

const TabResumen = ({ reserva }: { reserva: ReservaDetail }) => {
  return (
    <Row className="g-3">
      <Col md={6}>
        <Card className="h-100">
          <CardBody>
            <CardTitle as="h5" className="mb-3">
              Datos de la reserva
            </CardTitle>
            <dl className="row mb-0 fs-13">
              <dt className="col-5 text-muted">Código</dt>
              <dd className="col-7 fw-semibold">{reserva.code}</dd>

              <dt className="col-5 text-muted">Tour</dt>
              <dd className="col-7">{reserva.tour_variant.tour_name}</dd>

              <dt className="col-5 text-muted">Variante</dt>
              <dd className="col-7">{reserva.tour_variant.variant_label}</dd>

              <dt className="col-5 text-muted">Fecha de servicio</dt>
              <dd className="col-7">{dayjs(reserva.service_date).format('dddd DD MMMM YYYY')}</dd>

              <dt className="col-5 text-muted">Pax</dt>
              <dd className="col-7">{reserva.pax_count}</dd>

              <dt className="col-5 text-muted">Total</dt>
              <dd className="col-7 fw-semibold">{formatMoney(reserva.total_amount, reserva.currency)}</dd>

              {reserva.expires_at && (
                <>
                  <dt className="col-5 text-muted">Expira</dt>
                  <dd className="col-7 text-warning">{dayjs(reserva.expires_at).format('DD/MM/YYYY HH:mm')}</dd>
                </>
              )}
            </dl>
          </CardBody>
        </Card>
      </Col>

      <Col md={6}>
        <Card className="h-100">
          <CardBody>
            <CardTitle as="h5" className="mb-3">
              Snapshot
            </CardTitle>
            <dl className="row mb-3 fs-13">
              <dt className="col-5 text-muted">Precio congelado</dt>
              <dd className="col-7 fw-semibold">
                {formatMoney(reserva.snapshot.price_amount, reserva.snapshot.price_currency)}
              </dd>
            </dl>
            {reserva.snapshot.cancellation_policy_text && (
              <>
                <h6 className="text-muted text-uppercase fs-12 mb-2">Política de cancelación</h6>
                <p className="fs-13 mb-0 text-muted" style={{ whiteSpace: 'pre-line' }}>
                  {reserva.snapshot.cancellation_policy_text}
                </p>
              </>
            )}
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

export default TabResumen