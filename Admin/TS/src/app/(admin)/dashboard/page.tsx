'use client'

import PageBreadcrumb from '@/components/PageBreadcrumb'
import { ApiError, api } from '@/lib/api'
import { useEffect, useState } from 'react'
import { Alert, Card, CardBody, Col, Row, Spinner } from 'react-bootstrap'
import IngresosMes from './components/IngresosMes'
import ReservasAnalytics from './components/ReservasAnalytics'
import ReservasStats, { buildStatItems } from './components/ReservasStats'
import UltimasReservas from './components/UltimasReservas'
import type { DashboardStats, ReservaResumen } from './components/types'

interface DashboardPayload {
  stats: DashboardStats
  ultimas_reservas: ReservaResumen[]
}

const Page = () => {
  const [payload, setPayload] = useState<DashboardPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        setLoading(true)
        setError(null)

        const [stats, ultimas] = await Promise.all([
          api.get<DashboardStats>('/admin/stats/dashboard'),
          api
            .get<ReservaResumen[]>('/admin/reservations', { query: { page_size: 5, sort: '-created_at' } })
            .catch(() => [] as ReservaResumen[]),
        ])

        if (!active) return
        setPayload({ stats, ultimas_reservas: ultimas })
      } catch (err) {
        if (!active) return
        const message =
          err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error cargando dashboard'
        setError(message)
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [])

  return (
    <>
      <PageBreadcrumb title="Dashboard" subtitle="EcoExplora" />

      {error && (
        <Alert variant="danger" className="d-flex align-items-center gap-2">
          <i className="ti ti-alert-triangle" />
          <div>
            <strong>No se pudo cargar el dashboard.</strong> {error}
          </div>
        </Alert>
      )}

      {loading && !payload && (
        <Card>
          <CardBody className="py-5 text-center">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-3 mb-0">Cargando estadísticas…</p>
          </CardBody>
        </Card>
      )}

      {payload && (
        <>
          <Row className="row-cols-xxl-3 row-cols-md-2 row-cols-1">
            {buildStatItems(payload.stats).map((item, idx) => (
              <Col key={idx}>
                <ReservasStats item={item} />
              </Col>
            ))}
          </Row>

          <Row>
            <Col xs={12}>
              <Card>
                <CardBody className="p-0">
                  <Row className="g-0">
                    <Col xxl={3} xl={6} className="order-xl-1 order-xxl-0">
                      <IngresosMes
                        ingresosMes={payload.stats.ingresos_mes}
                        ingresosMesAnterior={payload.stats.ingresos_mes_anterior}
                      />
                      <hr className="d-xxl-none border-light m-0" />
                    </Col>
                    <Col xxl={9} className="order-xl-3 order-xxl-1">
                      <ReservasAnalytics data={payload.stats.reservas_por_dia} />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <UltimasReservas reservas={payload.ultimas_reservas} />
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

export default Page