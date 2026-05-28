'use client'

import Icon from '@/components/wrappers/Icon'
import { Icon as IconifyIcon } from '@iconify/react'
import dayjs from 'dayjs'
import Link from 'next/link'
import { Badge, Card, CardHeader, CardTitle, Table } from 'react-bootstrap'
import { RESERVA_STATUS_META, type ReservaResumen } from './types'

const formatMoney = (amount: number, currency: string) =>
  new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: currency || 'PEN',
    maximumFractionDigits: 2,
  }).format(amount)

const UltimasReservas = ({ reservas }: { reservas: ReservaResumen[] }) => {
  return (
    <Card>
      <CardHeader className="justify-content-between align-items-center border-dashed">
        <CardTitle as="h4" className="mb-0">
          Últimas reservas
        </CardTitle>
        <Link href="/reservas" className="link-reset text-decoration-underline fw-semibold link-offset-3">
          Ver todas <Icon icon="arrow-right" />
        </Link>
      </CardHeader>
      <div className="table-responsive">
        <Table className="table-centered table-hover mb-0">
          <thead className="bg-light bg-opacity-50">
            <tr>
              <th>Reserva</th>
              <th>Cliente</th>
              <th>Tour</th>
              <th>Fecha</th>
              <th>Pax</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {reservas.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-muted py-4">
                  Aún no hay reservas registradas.
                </td>
              </tr>
            )}
            {reservas.map((r) => {
              const meta = RESERVA_STATUS_META[r.status]
              return (
                <tr key={r.id}>
                  <td>
                    <Link href={`/reservas/${r.id}`} className="fw-semibold text-body">
                      {r.code}
                    </Link>
                  </td>
                  <td>{r.customer_name}</td>
                  <td>
                    <span className="d-block fw-medium">{r.tour_name}</span>
                    <small className="text-muted">{r.variant_label}</small>
                  </td>
                  <td>{dayjs(r.service_date).format('DD/MM/YYYY')}</td>
                  <td>{r.pax_count}</td>
                  <td className="fw-semibold">{formatMoney(r.total_amount, r.currency)}</td>
                  <td>
                    <Badge bg={meta.variant} className="text-uppercase fs-11">
                      <IconifyIcon icon="tabler:circle-filled" className="fs-xs me-1" />
                      {meta.label}
                    </Badge>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    </Card>
  )
}

export default UltimasReservas