'use client'

import PageBreadcrumb from '@/components/PageBreadcrumb'
import Icon from '@/components/wrappers/Icon'
import { ApiError, api } from '@/lib/api'
import { confirmAction, notifyError, notifyOk } from '@/lib/confirm'
import { resyncRag } from '@/lib/rag'
import type { Destination } from '@/types/catalog'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Badge, Button, Card, CardBody, Col, Row, Spinner, Table } from 'react-bootstrap'
import DestinoFormModal, { type DestinoFormValues } from './components/DestinoFormModal'

const Page = () => {
  const [items, setItems] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Destination | null>(null)

  const load = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true)
      setError(null)
      const res = await api.get<Destination[]>('/admin/catalog/destinations', { signal })
      if (!signal?.aborted) setItems(res)
    } catch (err) {
      if (signal?.aborted) return
      setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error al cargar destinos')
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [])

  useEffect(() => {
    const c = new AbortController()
    void load(c.signal)
    return () => c.abort()
  }, [load])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return items
    return items.filter(
      (d) => d.name.toLowerCase().includes(term) || d.slug.toLowerCase().includes(term) || (d.aliases ?? []).some((a) => a.toLowerCase().includes(term)),
    )
  }, [items, search])

  const handleSave = async (values: DestinoFormValues) => {
    const payload = {
      ...values,
      latitude: values.latitude === '' || values.latitude == null ? null : Number(values.latitude),
      longitude: values.longitude === '' || values.longitude == null ? null : Number(values.longitude),
      aliases: values.aliases
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean),
    }
    try {
      if (editing) {
        await api.put(`/admin/catalog/destinations/${editing.id}`, payload)
        await notifyOk('Destino actualizado')
      } else {
        await api.post('/admin/catalog/destinations', payload)
        await notifyOk('Destino creado')
      }
      void resyncRag('destinations')
      setModalOpen(false)
      setEditing(null)
      await load()
    } catch (err) {
      await notifyError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error al guardar')
      throw err
    }
  }

  const handleDelete = async (d: Destination) => {
    const { confirmed } = await confirmAction({
      title: '¿Eliminar destino?',
      text: `Se eliminará "${d.name}". Las variantes vinculadas perderán esta referencia.`,
      variant: 'danger',
      confirmText: 'Sí, eliminar',
    })
    if (!confirmed) return
    try {
      await api.delete(`/admin/catalog/destinations/${d.id}`)
      void resyncRag('destinations')
      await notifyOk('Destino eliminado')
      await load()
    } catch (err) {
      await notifyError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error al eliminar')
    }
  }

  return (
    <>
      <PageBreadcrumb title="Destinos" subtitle="Catálogo" />

      <Card className="mb-3">
        <CardBody>
          <Row className="g-2 align-items-center">
            <Col md={6} lg={5}>
              <div className="app-search">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por nombre, slug o alias…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Icon icon="search" className="app-search-icon text-muted" />
              </div>
            </Col>
            <Col className="text-md-end">
              <Button
                variant="primary"
                onClick={() => {
                  setEditing(null)
                  setModalOpen(true)
                }}>
                <Icon icon="plus" className="me-1" /> Nuevo destino
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading && items.length === 0 ? (
        <Card>
          <CardBody className="py-5 text-center">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-3 mb-0">Cargando destinos…</p>
          </CardBody>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardBody className="py-5 text-center">
            <Icon icon="map-off" className="fs-1 text-muted mb-2" />
            <p className="text-muted mb-0">
              {items.length === 0 ? 'Aún no hay destinos registrados.' : 'Ningún destino coincide con la búsqueda.'}
            </p>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody className="p-0">
            <div className="table-responsive">
              <Table hover className="mb-0 align-middle">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Slug</th>
                    <th>Coordenadas</th>
                    <th>Aliases</th>
                    <th style={{ width: 100 }} className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d) => (
                    <tr key={d.id}>
                      <td className="fw-semibold">{d.name}</td>
                      <td className="text-muted fs-sm">/{d.slug}</td>
                      <td className="text-muted fs-sm">
                        {d.latitude != null && d.longitude != null
                          ? `${d.latitude.toFixed(4)}, ${d.longitude.toFixed(4)}`
                          : '—'}
                      </td>
                      <td>
                        {(d.aliases ?? []).length === 0 ? (
                          <span className="text-muted fst-italic fs-sm">sin aliases</span>
                        ) : (
                          <div className="d-flex flex-wrap gap-1">
                            {d.aliases?.map((a) => (
                              <Badge key={a} bg="light" text="dark" className="border">
                                {a}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="text-end">
                        <Button
                          size="sm"
                          variant="light"
                          className="me-1"
                          onClick={() => {
                            setEditing(d)
                            setModalOpen(true)
                          }}>
                          <Icon icon="edit" />
                        </Button>
                        <Button size="sm" variant="outline-danger" onClick={() => handleDelete(d)}>
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

      <DestinoFormModal
        show={modalOpen}
        destino={editing}
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