'use client'

import PageBreadcrumb from '@/components/PageBreadcrumb'
import Icon from '@/components/wrappers/Icon'
import { ApiError, api } from '@/lib/api'
import { confirmAction, notifyError, notifyOk } from '@/lib/confirm'
import { resyncRag } from '@/lib/rag'
import type { Destination, Tour, TourVariant } from '@/types/catalog'
import { DURATION_TYPE_LABEL, PRICE_UNIT_LABEL } from '@/types/catalog'
import Link from 'next/link'
import { use, useCallback, useEffect, useState } from 'react'
import { Alert, Badge, Button, Card, CardBody, Col, Form, Row, Spinner, Table } from 'react-bootstrap'
import VarianteFormModal, { type VarianteFormValues } from './components/VarianteFormModal'

const formatMoney = (amount: number, currency: string) =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: currency || 'PEN', maximumFractionDigits: 2 }).format(amount)

const durationLabel = (v: TourVariant) => {
  if (v.duration_type === 'half_day') return `Medio día${v.duration_hours ? ` (${v.duration_hours}h)` : ''}`
  if (v.duration_type === 'full_day') return `Día completo${v.duration_hours ? ` (${v.duration_hours}h)` : ''}`
  const days = v.duration_days ?? 0
  const nights = v.duration_nights ?? 0
  if (days || nights) return `${days}D / ${nights}N`
  return DURATION_TYPE_LABEL[v.duration_type] ?? '—'
}

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: tourId } = use(params)

  const [tour, setTour] = useState<Tour | null>(null)
  const [variants, setVariants] = useState<TourVariant[]>([])
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<TourVariant | null>(null)

  const loadAll = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setLoading(true)
        setError(null)
        const [tourRes, variantsRes, destsRes] = await Promise.all([
          api.get<Tour>(`/admin/catalog/tours/${tourId}`, { signal }),
          api.get<TourVariant[]>(`/admin/catalog/tours/${tourId}/variants`, { signal }),
          api.get<Destination[]>('/admin/catalog/destinations', { signal }),
        ])
        if (signal?.aborted) return
        setTour(tourRes)
        setVariants(variantsRes)
        setDestinations(destsRes)
      } catch (err) {
        if (signal?.aborted) return
        setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error al cargar')
      } finally {
        if (!signal?.aborted) setLoading(false)
      }
    },
    [tourId],
  )

  useEffect(() => {
    const c = new AbortController()
    void loadAll(c.signal)
    return () => c.abort()
  }, [loadAll])

  const handleSave = async (values: VarianteFormValues) => {
    // Las actividades se guardan aparte vía PUT /variants/:id/activities (no es campo de la variante).
    const { activities, ...variantValues } = values
    const variantPayload = {
      ...variantValues,
      tour_id: tourId,
      price_amount: Number(variantValues.price_amount),
      price_total_amount: variantValues.price_total_amount === '' ? null : Number(variantValues.price_total_amount),
      duration_hours: variantValues.duration_hours === '' ? null : Number(variantValues.duration_hours),
      duration_days: variantValues.duration_days === '' ? null : Number(variantValues.duration_days),
      duration_nights: variantValues.duration_nights === '' ? null : Number(variantValues.duration_nights),
      default_daily_capacity: Number(variantValues.default_daily_capacity),
      available_months: variantValues.available_months.length === 0 ? null : variantValues.available_months,
    }

    const activitiesPayload = {
      items: (activities ?? []).map((a) => ({
        day: a.day,
        title: a.title,
        description: a.description?.trim() || null,
        start_time: a.start_time && a.start_time.length >= 4 ? a.start_time.slice(0, 5) : null,
        end_time: a.end_time && a.end_time.length >= 4 ? a.end_time.slice(0, 5) : null,
        destination_id: a.destination_id || null,
      })),
    }

    try {
      let savedId: string
      if (editing) {
        await api.put(`/admin/catalog/variants/${editing.id}`, variantPayload)
        savedId = editing.id
      } else {
        const created = await api.post<{ id: string }>(`/admin/catalog/tours/${tourId}/variants`, variantPayload)
        savedId = created.id
      }

      await api.put(`/admin/catalog/variants/${savedId}/activities`, activitiesPayload)

      void resyncRag('variants')
      await notifyOk(editing ? 'Variante actualizada' : 'Variante creada')
      setModalOpen(false)
      setEditing(null)
      await loadAll()
    } catch (err) {
      await notifyError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error al guardar')
      throw err
    }
  }

  const handleDelete = async (v: TourVariant) => {
    const { confirmed } = await confirmAction({
      title: '¿Eliminar variante?',
      text: `Se eliminará "${v.variant_label}". Las reservas existentes mantendrán la referencia histórica.`,
      variant: 'danger',
      confirmText: 'Sí, eliminar',
    })
    if (!confirmed) return
    try {
      await api.delete(`/admin/catalog/variants/${v.id}`)
      void resyncRag('variants')
      await notifyOk('Variante eliminada')
      await loadAll()
    } catch (err) {
      await notifyError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error al eliminar')
    }
  }

  const handleToggleActive = async (v: TourVariant) => {
    try {
      await api.put(`/admin/catalog/variants/${v.id}`, { active: !v.active })
      setVariants((prev) => prev.map((x) => (x.id === v.id ? { ...x, active: !x.active } : x)))
      void resyncRag('variants')
    } catch (err) {
      await notifyError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error')
    }
  }

  return (
    <>
      <PageBreadcrumb title={tour ? `Variantes — ${tour.name}` : 'Variantes'} subtitle="Catálogo › Tours" />

      <Card className="mb-3">
        <CardBody>
          <Row className="g-2 align-items-center">
            <Col md={8}>
              <Link href="/catalogo/tours" className="link-reset fs-sm">
                <Icon icon="arrow-left" className="me-1" /> Volver al listado de tours
              </Link>
              {tour && (
                <div className="mt-2">
                  <div className="fw-semibold">{tour.name}</div>
                  <small className="text-muted">/{tour.slug}</small>
                </div>
              )}
            </Col>
            <Col className="text-md-end">
              <Button
                variant="primary"
                onClick={() => {
                  setEditing(null)
                  setModalOpen(true)
                }}>
                <Icon icon="plus" className="me-1" /> Nueva variante
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading && variants.length === 0 ? (
        <Card>
          <CardBody className="py-5 text-center">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-3 mb-0">Cargando…</p>
          </CardBody>
        </Card>
      ) : variants.length === 0 ? (
        <Card>
          <CardBody className="py-5 text-center">
            <Icon icon="layers-off" className="fs-1 text-muted mb-2" />
            <p className="text-muted mb-3">Este tour aún no tiene variantes.</p>
            <Button
              variant="primary"
              onClick={() => {
                setEditing(null)
                setModalOpen(true)
              }}>
              <Icon icon="plus" className="me-1" /> Crear primera variante
            </Button>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody className="p-0">
            <div className="table-responsive">
              <Table hover className="mb-0 align-middle">
                <thead>
                  <tr>
                    <th>Etiqueta</th>
                    <th>Precio</th>
                    <th>Duración</th>
                    <th className="text-center">Cupo/día</th>
                    <th>Destinos</th>
                    <th className="text-center">Activa</th>
                    <th style={{ width: 100 }} className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((v) => (
                    <tr key={v.id}>
                      <td>
                        <div className="fw-semibold">{v.variant_label}</div>
                        <small className="text-muted">/{v.slug}</small>
                      </td>
                      <td>
                        <div className="fw-semibold">{formatMoney(v.price_amount, v.price_currency)}</div>
                        <small className="text-muted">{PRICE_UNIT_LABEL[v.price_unit] ?? v.price_unit}</small>
                      </td>
                      <td className="text-muted fs-sm">{durationLabel(v)}</td>
                      <td className="text-center">{v.default_daily_capacity}</td>
                      <td>
                        {v.destinations.length === 0 ? (
                          <span className="text-muted fst-italic fs-sm">sin destinos</span>
                        ) : (
                          <div className="d-flex flex-wrap gap-1">
                            {v.destinations.map((d) => (
                              <Badge key={d.id} bg="light" text="dark" className="border">
                                {d.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="text-center">
                        <Form.Check
                          type="switch"
                          id={`variant-active-${v.id}`}
                          checked={v.active}
                          onChange={() => handleToggleActive(v)}
                        />
                      </td>
                      <td className="text-end">
                        <Button
                          size="sm"
                          variant="light"
                          className="me-1"
                          onClick={() => {
                            setEditing(v)
                            setModalOpen(true)
                          }}>
                          <Icon icon="edit" />
                        </Button>
                        <Button size="sm" variant="outline-danger" onClick={() => handleDelete(v)}>
                          <Icon icon="trash" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>
      )}

      <VarianteFormModal
        show={modalOpen}
        variant={editing}
        destinations={destinations}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        onSubmit={handleSave}
      />
    </>
  )
}

export default Page