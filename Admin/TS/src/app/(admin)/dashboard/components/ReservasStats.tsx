'use client'

import { Icon as IconifyIcon } from '@iconify/react'
import clsx from 'clsx'
import { Card, CardBody } from 'react-bootstrap'
import CountUp from 'react-countup'
import type { DashboardStats } from './types'

export interface StatItem {
  icon: string
  className: string
  value: number
  prefix?: string
  suffix?: string
  title: string
}

export const buildStatItems = (stats: DashboardStats): StatItem[] => [
  {
    icon: 'tabler:calendar-event',
    className: 'bg-primary-subtle text-primary',
    value: stats.reservas_hoy,
    title: 'Reservas hoy',
  },
  {
    icon: 'tabler:hourglass',
    className: 'bg-info-subtle text-info',
    value: stats.reservas_pendientes_verificacion,
    title: 'Pendientes verificación',
  },
  {
    icon: 'tabler:credit-card',
    className: 'bg-warning-subtle text-warning',
    value: stats.reservas_pendientes_pago,
    title: 'Pendientes de pago',
  },
  {
    icon: 'tabler:message-circle',
    className: 'bg-success-subtle text-success',
    value: stats.conversaciones_activas,
    title: 'Conversaciones activas',
  },
  {
    icon: 'tabler:headset',
    className: 'bg-danger-subtle text-danger',
    value: stats.conversaciones_takeover,
    title: 'En takeover humano',
  },
  {
    icon: 'tabler:cash',
    className: 'bg-purple-subtle text-purple',
    prefix: 'S/. ',
    value: stats.ingresos_mes,
    title: 'Ingresos del mes',
  },
]

const ReservasStats = ({ item }: { item: StatItem }) => {
  return (
    <Card>
      <CardBody>
        <div className="d-flex justify-content-between align-items-center">
          <div className="avatar fs-60 avatar-img-size flex-shrink-0">
            <span className={clsx('avatar-title rounded-circle fs-24', item.className)}>
              <IconifyIcon icon={item.icon} />
            </span>
          </div>
          <div className="text-end">
            <h3 className="mb-2 fw-normal">
              {item.prefix}
              <CountUp
                duration={1}
                decimals={Number.isInteger(item.value) ? 0 : 2}
                end={item.value}
                enableScrollSpy
                scrollSpyOnce
              />
              {item.suffix}
            </h3>
            <p className="mb-0 text-muted">
              <span>{item.title}</span>
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default ReservasStats