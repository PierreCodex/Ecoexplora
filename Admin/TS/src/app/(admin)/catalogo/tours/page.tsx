'use client'

import PageBreadcrumb from '@/components/PageBreadcrumb'
import Icon from '@/components/wrappers/Icon'
import { ApiError, api } from '@/lib/api'
import { confirmAction, notifyError, notifyOk } from '@/lib/confirm'
import { resyncRag } from '@/lib/rag'
import type { Tour, TourFormValues } from '@/types/catalog'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, CardBody, Col, Row, Spinner } from 'react-bootstrap'
import TourCard from './components/TourCard'
import TourFormModal from './components/TourFormModal'

interface ToursResponse {
  tours?: Tour[]
  items?: Tour[]
}

const Page = () => {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTour, setEditingTour] = useState<Tour | null>(null)

  const loadTours = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true)
      setError(null)
      const res = await api.get<Tour[] | ToursResponse>('/admin/catalog/tours', { signal })
      if (signal?.aborted) return
      const list = Array.isArray(res) ? res : (res.tours ?? res.items ?? [])
      setTours(list)
    } catch (err) {
      if (signal?.aborted) return
      setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error al cargar tours')
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    void loadTours(controller.signal)
    return () => controller.abort()
  }, [loadTours])

  const filteredTours = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return tours
    return tours.filter(
      (t) =>
        t.name.toLowerCase().includes(term) ||
        t.slug.toLowerCase().includes(term) ||
        (t.base_description ?? '').toLowerCase().includes(term),
    )
  }, [tours, search])

  const handleNew = () => {
    setEditingTour(null)
    setModalOpen(true)
  }

  const handleEdit = (tour: Tour) => {
    setEditingTour(tour)
    setModalOpen(true)
  }

  const handleSave = async (values: TourFormValues) => {
    try {
      if (editingTour) {
        await api.put<Tour>(`/admin/catalog/tours/${editingTour.id}`, values)
        await notifyOk('Tour actualizado')
      } else {
        await api.post<Tour>('/admin/catalog/tours', values)
        await notifyOk('Tour creado')
      }
      void resyncRag('tours')
      setModalOpen(false)
      setEditingTour(null)
      await loadTours()
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error al guardar el tour'
      await notifyError(msg)
      throw err
    }
  }

  const handleToggleActive = async (tour: Tour) => {
    try {
      await api.put<Tour>(`/admin/catalog/tours/${tour.id}`, { active: !tour.active })
      setTours((prev) => prev.map((t) => (t.id === tour.id ? { ...t, active: !t.active } : t)))
      void resyncRag('tours')
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error al cambiar estado'
      await notifyError(msg)
    }
  }

  const handleDelete = async (tour: Tour) => {
    const { confirmed } = await confirmAction({
      title: '¿Eliminar tour?',
      text: `Se eliminará "${tour.name}" y sus variantes asociadas.`,
      variant: 'danger',
      confirmText: 'Sí, eliminar',
    })
    if (!confirmed) return
    try {
      await api.delete(`/admin/catalog/tours/${tour.id}`)
      void resyncRag('tours')
      await notifyOk('Tour eliminado')
      await loadTours()
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error al eliminar el tour'
      await notifyError(msg)
    }
  }

  return (
    <>
      <PageBreadcrumb title="Tours" subtitle="Catálogo" />

      <Card className="mb-3">
        <CardBody>
          <Row className="g-2 align-items-center">
            <Col md={6} lg={5}>
              <div className="app-search">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por nombre, slug o descripción…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Icon icon="search" className="app-search-icon text-muted" />
              </div>
            </Col>
            <Col className="text-md-end">
              <Button variant="primary" onClick={handleNew}>
                <Icon icon="plus" className="me-1" /> Nuevo tour
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {loading && tours.length === 0 ? (
        <Card>
          <CardBody className="py-5 text-center">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-3 mb-0">Cargando tours…</p>
          </CardBody>
        </Card>
      ) : filteredTours.length === 0 ? (
        <Card>
          <CardBody className="py-5 text-center">
            <Icon icon="package-off" className="fs-1 text-muted mb-2" />
            <p className="text-muted mb-3">
              {tours.length === 0 ? 'Aún no hay tours en el catálogo.' : 'Ningún tour coincide con la búsqueda.'}
            </p>
            {tours.length === 0 && (
              <Button variant="primary" onClick={handleNew}>
                <Icon icon="plus" className="me-1" /> Crear primer tour
              </Button>
            )}
          </CardBody>
        </Card>
      ) : (
        <Row>
          {filteredTours.map((tour) => (
            <Col xxl={3} lg={4} md={6} key={tour.id}>
              <TourCard
                tour={tour}
                onEdit={() => handleEdit(tour)}
                onDelete={() => handleDelete(tour)}
                onToggleActive={() => handleToggleActive(tour)}
              />
            </Col>
          ))}
        </Row>
      )}

      <TourFormModal
        show={modalOpen}
        tour={editingTour}
        onClose={() => {
          setModalOpen(false)
          setEditingTour(null)
        }}
        onSubmit={handleSave}
      />
    </>
  )
}

export default Page