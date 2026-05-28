'use client'
import StatusBadge from '@/components/StatusBadge'
import type { ReservaResumen } from '@/types/reservation'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { Button, Modal } from 'react-bootstrap'

interface Props {
  reserva: ReservaResumen | null
  show: boolean
  onClose: () => void
}

const formatMoney = (amount: number, currency: string) =>
  new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: currency || 'PEN',
    maximumFractionDigits: 2,
  }).format(amount)

const ReservaEventModal = ({ reserva, show, onClose }: Props) => {
  const router = useRouter()

  if (!reserva) return null

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center gap-2">
          <span>{reserva.code}</span>
          <StatusBadge status={reserva.status} />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <dl className="row mb-0">
          <dt className="col-4 text-muted">Cliente</dt>
          <dd className="col-8">{reserva.customer_name}</dd>

          <dt className="col-4 text-muted">Tour</dt>
          <dd className="col-8">
            {reserva.tour_name}
            <br />
            <small className="text-muted">{reserva.variant_label}</small>
          </dd>

          <dt className="col-4 text-muted">Fecha de servicio</dt>
          <dd className="col-8">{dayjs(reserva.service_date).format('dddd DD MMMM YYYY')}</dd>

          <dt className="col-4 text-muted">Pax</dt>
          <dd className="col-8">{reserva.pax_count}</dd>

          <dt className="col-4 text-muted">Total</dt>
          <dd className="col-8 fw-semibold">{formatMoney(reserva.total_amount, reserva.currency)}</dd>
        </dl>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={onClose}>
          Cerrar
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            onClose()
            router.push(`/reservas/${reserva.id}`)
          }}>
          Ver detalle completo
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ReservaEventModal