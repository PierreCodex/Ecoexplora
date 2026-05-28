'use client'
import { SimpleBar } from '@/components/wrappers/SimpleBar'
import {
  RESERVA_STATUS_META,
  RESERVA_STATUS_ORDER,
  type ReservaResumen,
  type ReservaStatus,
} from '@/types/reservation'
import { Card, CardBody } from 'react-bootstrap'
import ReservaCard, { type ReservaAction } from './ReservaCard'

interface Props {
  reservas: ReservaResumen[]
  onAction: (action: ReservaAction, reserva: ReservaResumen) => void
}

const groupByStatus = (reservas: ReservaResumen[]) => {
  const grouped: Record<ReservaStatus, ReservaResumen[]> = {
    pending_payment: [],
    pending_verification: [],
    confirmed: [],
    cancellation_requested: [],
    rejected: [],
    cancelled: [],
    expired: [],
    completed: [],
  }
  reservas.forEach((r) => {
    grouped[r.status]?.push(r)
  })
  return grouped
}

const ReservasBoard = ({ reservas, onAction }: Props) => {
  const grouped = groupByStatus(reservas)

  return (
    <div className="outlook-box kanban-app">
      <Card className="h-100 mb-0 flex-grow-1">
        <CardBody className="p-0">
          <div className="kanban-content">
            {RESERVA_STATUS_ORDER.map((status) => {
              const meta = RESERVA_STATUS_META[status]
              const items = grouped[status]
              return (
                <div key={status} className={`kanban-board bg-${meta.variant} bg-opacity-10`}>
                  <div className="kanban-item py-2 px-3 d-flex align-items-center">
                    <h5 className="m-0 fs-14 text-uppercase fw-bold">
                      {meta.label} <span className="text-muted fw-normal">({items.length})</span>
                    </h5>
                  </div>
                  <SimpleBar className="kanban-board-group px-2">
                    {items.length === 0 ? (
                      <p className="text-muted text-center fs-12 my-3 fst-italic">Sin reservas</p>
                    ) : (
                      <ul className="list-unstyled mb-0">
                        {items.map((r) => (
                          <li key={r.id} className="kanban-item">
                            <ReservaCard reserva={r} onAction={onAction} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </SimpleBar>
                </div>
              )
            })}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default ReservasBoard