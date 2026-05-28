'use client'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { ApiError, api } from '@/lib/api'
import type { ReservaResumen } from '@/types/reservation'
import { useEffect, useMemo, useState } from 'react'
import { Alert, Card, CardBody, CardHeader, Spinner } from 'react-bootstrap'
import ReservasBoard from './components/ReservasBoard'
import ReservasFilters, { type ReservasFiltersValue } from './components/ReservasFilters'
import { useReservaActions } from './hooks/useReservaActions'

interface ToursResponse {
  tours: { slug: string; name: string }[]
}

const Page = () => {
  const [reservas, setReservas] = useState<ReservaResumen[]>([])
  const [tours, setTours] = useState<{ slug: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [filters, setFilters] = useState<ReservasFiltersValue>({
    search: '',
    tour: '',
    dateFrom: '',
    dateTo: '',
  })

  useEffect(() => {
    let active = true
    api
      .get<ToursResponse | { slug: string; name: string }[]>('/admin/catalog/tours', { query: { active: true } })
      .then((res) => {
        if (!active) return
        const list = Array.isArray(res) ? res : res?.tours ?? []
        setTours(list)
      })
      .catch(() => {
        if (active) setTours([])
      })
    return () => {
      active = false
    }
  }, [])

  const loadReservas = useMemo(
    () => async (signal?: AbortSignal) => {
      try {
        setLoading(true)
        setError(null)
        const res = await api.get<ReservaResumen[] | { items: ReservaResumen[] }>('/admin/reservations', {
          query: {
            search: filters.search || undefined,
            tour_slug: filters.tour || undefined,
            service_date_from: filters.dateFrom || undefined,
            service_date_to: filters.dateTo || undefined,
            page_size: 200,
          },
          signal,
        })
        if (signal?.aborted) return
        setReservas(Array.isArray(res) ? res : res.items ?? [])
      } catch (err) {
        if (signal?.aborted) return
        setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error al cargar reservas')
      } finally {
        if (!signal?.aborted) setLoading(false)
      }
    },
    [filters.search, filters.tour, filters.dateFrom, filters.dateTo],
  )

  useEffect(() => {
    const controller = new AbortController()
    void loadReservas(controller.signal)
    return () => controller.abort()
  }, [loadReservas])

  const { handleAction } = useReservaActions({ onChange: () => loadReservas() })

  return (
    <>
      <PageBreadcrumb title="Reservas" subtitle="Operaciones" />

      <Card className="mb-3">
        <CardHeader className="border-light align-items-center gap-2">
          <ReservasFilters value={filters} onChange={setFilters} tours={tours} />
        </CardHeader>
      </Card>

      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {loading && reservas.length === 0 ? (
        <Card>
          <CardBody className="py-5 text-center">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-3 mb-0">Cargando reservas…</p>
          </CardBody>
        </Card>
      ) : (
        <ReservasBoard reservas={reservas} onAction={handleAction} />
      )}
    </>
  )
}

export default Page