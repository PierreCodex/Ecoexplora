'use client'

import PageBreadcrumb from '@/components/PageBreadcrumb'
import Icon from '@/components/wrappers/Icon'
import { ApiError, api } from '@/lib/api'
import { confirmAction, notifyError, notifyOk } from '@/lib/confirm'
import { resyncRag } from '@/lib/rag'
import type { Policy } from '@/types/catalog'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Badge, Button, Card, CardBody, Col, Row, Spinner, Table } from 'react-bootstrap'
import PoliticaFormModal, { type PoliticaFormValues } from './components/PoliticaFormModal'

const Page = () => {
  const [items, setItems] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Policy | null>(null)

  const load = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true)
      setError(null)
      const res = await api.get<Policy[]>('/admin/catalog/policies', { signal })
      if (!signal?.aborted) setItems(res)
    } catch (err) {
      if (signal?.aborted) return
      setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error al cargar políticas')
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
      (p) => p.title.toLowerCase().includes(term) || p.slug.toLowerCase().includes(term) || (p.topic ?? '').toLowerCase().includes(term),
    )
  }, [items, search])

  const handleSave = async (values: PoliticaFormValues) => {
    try {
      if (editing) {
        await api.put(`/admin/catalog/policies/${editing.id}`, values)
        await notifyOk('Política actualizada')
      } else {
        await api.post('/admin/catalog/policies', values)
        await notifyOk('Política creada')
      }
      void resyncRag('policies')
      setModalOpen(false)
      setEditing(null)
      await load()
    } catch (err) {
      await notifyError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error al guardar')
      throw err
    }
  }

  const handleDelete = async (p: Policy) => {
    const { confirmed } = await confirmAction({
      title: '¿Eliminar política?',
      text: `Se eliminará "${p.title}".`,
      variant: 'danger',
      confirmText: 'Sí, eliminar',
    })
    if (!confirmed) return
    try {
      await api.delete(`/admin/catalog/policies/${p.id}`)
      void resyncRag('policies')
      await notifyOk('Política eliminada')
      await load()
    } catch (err) {
      await notifyError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error al eliminar')
    }
  }

  return (
    <>
      <PageBreadcrumb title="Políticas" subtitle="Catálogo" />

      <Card className="mb-3">
        <CardBody>
          <Row className="g-2 align-items-center">
            <Col md={6} lg={5}>
              <div className="app-search">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por título, slug o tema…"
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
                <Icon icon="plus" className="me-1" /> Nueva política
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
            <p className="text-muted mt-3 mb-0">Cargando políticas…</p>
          </CardBody>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardBody className="py-5 text-center">
            <Icon icon="file-text-off" className="fs-1 text-muted mb-2" />
            <p className="text-muted mb-0">
              {items.length === 0 ? 'Aún no hay políticas.' : 'Ninguna coincide con la búsqueda.'}
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
                    <th>Título</th>
                    <th>Slug</th>
                    <th>Tema</th>
                    <th className="text-center">Prioridad</th>
                    <th className="text-center">Estado</th>
                    <th style={{ width: 100 }} className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id}>
                      <td className="fw-semibold">{p.title}</td>
                      <td className="text-muted fs-sm">/{p.slug}</td>
                      <td className="text-muted fs-sm">{p.topic ?? '—'}</td>
                      <td className="text-center">{p.priority}</td>
                      <td className="text-center">
                        <Badge bg={p.active ? 'success' : 'secondary'}>{p.active ? 'Activa' : 'Inactiva'}</Badge>
                      </td>
                      <td className="text-end">
                        <Button
                          size="sm"
                          variant="light"
                          className="me-1"
                          onClick={() => {
                            setEditing(p)
                            setModalOpen(true)
                          }}>
                          <Icon icon="edit" />
                        </Button>
                        <Button size="sm" variant="outline-danger" onClick={() => handleDelete(p)}>
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

      <PoliticaFormModal
        show={modalOpen}
        politica={editing}
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