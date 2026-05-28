'use client'

import PageBreadcrumb from '@/components/PageBreadcrumb'
import Icon from '@/components/wrappers/Icon'
import { ApiError, api } from '@/lib/api'
import { notifyError, notifyOk } from '@/lib/confirm'
import type { Tour, TourVariant } from '@/types/catalog'
import type { AvailabilityDay } from '@/types/availability'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, CardBody, Col, Form, Row, Spinner } from 'react-bootstrap'
import BlockDateModal from './components/BlockDateModal'
import DayModal from './components/DayModal'

const AvailabilityCalendar = dynamic(() => import('./components/AvailabilityCalendar'), { ssr: false })

interface VariantOption {
  variantId: string
  variantLabel: string
  tourId: string
  tourName: string
  defaultCapacity: number
}

const Page = () => {
  const [tours, setTours] = useState<Tour[]>([])
  const [variants, setVariants] = useState<VariantOption[]>([])
  const [loadingMeta, setLoadingMeta] = useState(true)
  const [metaError, setMetaError] = useState<string | null>(null)

  const [selectedVariantId, setSelectedVariantId] = useState<string>('')
  const [range, setRange] = useState<{ from: string; to: string } | null>(null)

  const [days, setDays] = useState<AvailabilityDay[]>([])
  const [loadingDays, setLoadingDays] = useState(false)
  const [daysError, setDaysError] = useState<string | null>(null)

  const [dayModalOpen, setDayModalOpen] = useState(false)
  const [dayModalDate, setDayModalDate] = useState<string | null>(null)
  const [blockModalOpen, setBlockModalOpen] = useState(false)

  // 1. Cargar tours + variantes una vez
  useEffect(() => {
    const c = new AbortController()
    const load = async () => {
      try {
        setLoadingMeta(true)
        setMetaError(null)
        const toursRes = await api.get<Tour[]>('/admin/catalog/tours', {
          query: { active: true },
          signal: c.signal,
        })
        if (c.signal.aborted) return
        setTours(toursRes)

        const variantsLists = await Promise.all(
          toursRes.map((t) =>
            api
              .get<TourVariant[]>(`/admin/catalog/tours/${t.id}/variants`, { signal: c.signal })
              .then((vs) =>
                vs
                  .filter((v) => v.active)
                  .map((v) => ({
                    variantId: v.id,
                    variantLabel: v.variant_label,
                    tourId: t.id,
                    tourName: t.name,
                    defaultCapacity: v.default_daily_capacity,
                  })),
              )
              .catch(() => [] as VariantOption[]),
          ),
        )
        if (c.signal.aborted) return
        const flat = variantsLists.flat()
        setVariants(flat)
        if (flat.length > 0 && !selectedVariantId) {
          setSelectedVariantId(flat[0].variantId)
        }
      } catch (err) {
        if (c.signal.aborted) return
        setMetaError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error al cargar tours')
      } finally {
        if (!c.signal.aborted) setLoadingMeta(false)
      }
    }
    void load()
    return () => c.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 2. Cargar disponibilidad cuando cambia variante o rango visible
  const loadDays = useCallback(
    async (signal?: AbortSignal) => {
      if (!selectedVariantId || !range) return
      try {
        setLoadingDays(true)
        setDaysError(null)
        const res = await api.get<AvailabilityDay[]>('/admin/availability', {
          query: { variant: selectedVariantId, date_from: range.from, date_to: range.to },
          signal,
        })
        if (!signal?.aborted) setDays(res)
      } catch (err) {
        if (signal?.aborted) return
        setDaysError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error al cargar disponibilidad')
        setDays([])
      } finally {
        if (!signal?.aborted) setLoadingDays(false)
      }
    },
    [selectedVariantId, range],
  )

  useEffect(() => {
    const c = new AbortController()
    void loadDays(c.signal)
    return () => c.abort()
  }, [loadDays])

  const daysByDate = useMemo(() => {
    const map = new Map<string, AvailabilityDay>()
    days.forEach((d) => map.set(d.date, d))
    return map
  }, [days])

  const selectedVariant = useMemo(
    () => variants.find((v) => v.variantId === selectedVariantId) ?? null,
    [variants, selectedVariantId],
  )

  const variantsByTour = useMemo(() => {
    const groups = new Map<string, VariantOption[]>()
    variants.forEach((v) => {
      const list = groups.get(v.tourId) ?? []
      list.push(v)
      groups.set(v.tourId, list)
    })
    return groups
  }, [variants])

  const handleDayClick = (dateStr: string) => {
    setDayModalDate(dateStr)
    setDayModalOpen(true)
  }

  const handleDayModalClose = (changed: boolean) => {
    setDayModalOpen(false)
    setDayModalDate(null)
    if (changed) void loadDays()
  }

  const handleBlockModalClose = async (changed: boolean) => {
    setBlockModalOpen(false)
    if (changed) {
      await notifyOk('Bloqueo registrado')
      void loadDays()
    }
  }

  return (
    <>
      <PageBreadcrumb title="Disponibilidad" subtitle="Operaciones" />

      <Card className="mb-3">
        <CardBody>
          <Row className="g-2 align-items-end">
            <Col md={7} lg={6}>
              <Form.Label className="fs-sm mb-1">Variante</Form.Label>
              <Form.Select
                value={selectedVariantId}
                onChange={(e) => setSelectedVariantId(e.target.value)}
                disabled={loadingMeta || variants.length === 0}>
                {tours.map((t) => (
                  <optgroup key={t.id} label={t.name}>
                    {(variantsByTour.get(t.id) ?? []).map((v) => (
                      <option key={v.variantId} value={v.variantId}>
                        {v.variantLabel} · cupo default {v.defaultCapacity}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </Form.Select>
            </Col>
            <Col md={5} lg={6} className="text-md-end">
              <div className="d-inline-flex gap-3 align-items-center flex-wrap">
                <Legend />
                <Button
                  variant="outline-danger"
                  onClick={() => setBlockModalOpen(true)}
                  disabled={variants.length === 0}>
                  <Icon icon="ban" className="me-1" /> Bloquear fecha
                </Button>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {metaError && <Alert variant="danger">{metaError}</Alert>}
      {daysError && <Alert variant="warning">{daysError}</Alert>}

      {loadingMeta ? (
        <Card>
          <CardBody className="py-5 text-center">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-3 mb-0">Cargando catálogo…</p>
          </CardBody>
        </Card>
      ) : variants.length === 0 ? (
        <Card>
          <CardBody className="py-5 text-center">
            <Icon icon="alert-circle" className="fs-1 text-muted mb-2" />
            <p className="text-muted mb-0">No hay variantes activas. Crea tours y variantes en Catálogo primero.</p>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody className="position-relative">
            {loadingDays && (
              <div className="position-absolute top-0 end-0 m-3" style={{ zIndex: 2 }}>
                <Spinner size="sm" animation="border" variant="primary" />
              </div>
            )}
            <AvailabilityCalendar daysByDate={daysByDate} onDayClick={handleDayClick} onRangeChange={setRange} />
          </CardBody>
        </Card>
      )}

      {selectedVariant && dayModalDate && (
        <DayModal
          show={dayModalOpen}
          variantId={selectedVariant.variantId}
          variantLabel={selectedVariant.variantLabel}
          tourName={selectedVariant.tourName}
          defaultCapacity={selectedVariant.defaultCapacity}
          date={dayModalDate}
          day={daysByDate.get(dayModalDate)}
          onClose={handleDayModalClose}
          onError={(msg) => void notifyError(msg)}
        />
      )}

      <BlockDateModal show={blockModalOpen} variants={variants} onClose={handleBlockModalClose} />
    </>
  )
}

const Legend = () => (
  <div className="d-inline-flex gap-3 align-items-center fs-sm flex-wrap">
    <span><span className="badge bg-success me-1">&nbsp;</span> Disponible</span>
    <span><span className="badge bg-warning me-1">&nbsp;</span> Cupo bajo</span>
    <span><span className="badge bg-danger me-1">&nbsp;</span> Sin cupo</span>
    <span><span className="badge bg-secondary me-1">&nbsp;</span> Bloqueado</span>
  </div>
)

export default Page