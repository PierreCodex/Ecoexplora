'use client'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { ApiError, api } from '@/lib/api'
import type { ReservaDetail } from '@/types/reservation'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Alert, Card, CardBody, Col, Nav, Row, Spinner, Tab } from 'react-bootstrap'
import ReservaActions from './components/ReservaActions'
import ReservaHeader from './components/ReservaHeader'
import TabComprobante from './components/TabComprobante'
import TabHistorial from './components/TabHistorial'
import TabItinerario from './components/TabItinerario'
import TabResumen from './components/TabResumen'

const Page = () => {
  const params = useParams<{ id: string }>()
  const id = params?.id

  const [reserva, setReserva] = useState<ReservaDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!id) return
    try {
      setLoading(true)
      setError(null)
      const res = await api.get<ReservaDetail>(`/admin/reservations/${id}`)
      setReserva(res)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error al cargar la reserva')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <>
      <PageBreadcrumb title={reserva?.code ?? 'Detalle de reserva'} subtitle="Reservas" />

      {error && <Alert variant="danger">{error}</Alert>}

      {loading && !reserva && (
        <Card>
          <CardBody className="py-5 text-center">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-3 mb-0">Cargando reserva…</p>
          </CardBody>
        </Card>
      )}

      {reserva && (
        <Row className="g-3">
          <Col xxl={9} lg={8}>
            <div className="d-flex flex-column gap-3">
              <ReservaHeader reserva={reserva} />

              <Tab.Container defaultActiveKey="resumen">
                <Card>
                  <Card.Header className="border-bottom-0 pb-0">
                    <Nav variant="tabs" className="card-header-tabs nav-bordered">
                      <Nav.Item>
                        <Nav.Link eventKey="resumen">Resumen</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="comprobante">Comprobante</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="itinerario">Itinerario</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="historial">Historial</Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Card.Header>
                  <CardBody>
                    <Tab.Content>
                      <Tab.Pane eventKey="resumen">
                        <TabResumen reserva={reserva} />
                      </Tab.Pane>
                      <Tab.Pane eventKey="comprobante">
                        <TabComprobante reserva={reserva} onChanged={load} />
                      </Tab.Pane>
                      <Tab.Pane eventKey="itinerario">
                        <TabItinerario reserva={reserva} />
                      </Tab.Pane>
                      <Tab.Pane eventKey="historial">
                        <TabHistorial reserva={reserva} />
                      </Tab.Pane>
                    </Tab.Content>
                  </CardBody>
                </Card>
              </Tab.Container>
            </div>
          </Col>

          <Col xxl={3} lg={4}>
            <ReservaActions reserva={reserva} onChanged={load} />
          </Col>
        </Row>
      )}
    </>
  )
}

export default Page