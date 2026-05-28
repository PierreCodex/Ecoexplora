'use client'

import { Icon as IconifyIcon } from '@iconify/react'
import CountUp from 'react-countup'

interface Props {
  ingresosMes: number
  ingresosMesAnterior: number
}

const formatPEN = (value: number) =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 2 }).format(value)

const IngresosMes = ({ ingresosMes, ingresosMesAnterior }: Props) => {
  const delta = ingresosMes - ingresosMesAnterior
  const pct = ingresosMesAnterior === 0 ? null : (delta / ingresosMesAnterior) * 100
  const positive = delta >= 0

  return (
    <div className="p-4 border-end border-dashed h-100">
      <h4 className="card-title mb-1">Ingresos del mes</h4>
      <p className="text-muted fs-xs mb-4">Comparado con el mes anterior</p>

      <h2 className="display-6 fw-bold mb-2">
        <CountUp
          end={ingresosMes}
          duration={1.2}
          decimals={2}
          decimal="."
          separator=","
          prefix="S/. "
          enableScrollSpy
          scrollSpyOnce
        />
      </h2>

      {pct !== null && (
        <p className={`mb-3 fw-semibold ${positive ? 'text-success' : 'text-danger'}`}>
          <IconifyIcon
            icon={positive ? 'tabler:trending-up' : 'tabler:trending-down'}
            className="me-1 align-middle fs-18"
          />
          {positive ? '+' : ''}
          {pct.toFixed(1)}% vs mes anterior
        </p>
      )}

      <div className="bg-light rounded p-3 mt-3">
        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted fs-13">Mes anterior</span>
          <span className="fw-semibold">{formatPEN(ingresosMesAnterior)}</span>
        </div>
        <div className="d-flex justify-content-between">
          <span className="text-muted fs-13">Diferencia</span>
          <span className={`fw-semibold ${positive ? 'text-success' : 'text-danger'}`}>
            {positive ? '+' : ''}
            {formatPEN(delta)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default IngresosMes