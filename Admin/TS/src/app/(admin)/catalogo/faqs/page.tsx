'use client'

import PageBreadcrumb from '@/components/PageBreadcrumb'
import Icon from '@/components/wrappers/Icon'
import { ApiError, api } from '@/lib/api'
import { confirmAction, notifyError, notifyOk } from '@/lib/confirm'
import { resyncRag } from '@/lib/rag'
import type { FAQ } from '@/types/catalog'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Badge, Button, Card, CardBody, Col, Row, Spinner, Table } from 'react-bootstrap'
import FaqFormModal, { type FaqFormValues } from './components/FaqFormModal'

const Page = () => {
  const [items, setItems] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<FAQ | null>(null)

  const load = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true)
      setError(null)
      const res = await api.get<FAQ[]>('/admin/catalog/faqs', { signal })
      if (!signal?.aborted) setItems(res)
    } catch (err) {
      if (signal?.aborted) return
      setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error al cargar FAQs')
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
      (f) =>
        f.question.toLowerCase().includes(term) ||
        f.slug.toLowerCase().includes(term) ||
        (f.topic ?? '').toLowerCase().includes(term),
    )
  }, [items, search])

  const handleSave = async (values: FaqFormValues) => {
    try {
      if (editing) {
        await api.put(`/admin/catalog/faqs/${editing.id}`, values)
        await notifyOk('FAQ actualizada')
      } else {
        await api.post('/admin/catalog/faqs', values)
        await notifyOk('FAQ creada')
      }
      void resyncRag('faqs')
      setModalOpen(false)
      setEditing(null)
      await load()
    } catch (err) {
      await notifyError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error al guardar')
      throw err
    }
  }

  const handleDelete = async (f: FAQ) => {
    const { confirmed } = await confirmAction({
      title: '¿Eliminar FAQ?',
      text: `Se eliminará la pregunta "${f.question.slice(0, 60)}…".`,
      variant: 'danger',
      confirmText: 'Sí, eliminar',
    })
    if (!confirmed) return
    try {
      await api.delete(`/admin/catalog/faqs/${f.id}`)
      void resyncRag('faqs')
      await notifyOk('FAQ eliminada')
      await load()
    } catch (err) {
      await notifyError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error al eliminar')
    }
  }

  return (
    <>
      <PageBreadcrumb title="FAQs" subtitle="Catálogo" />

      <Card className="mb-3">
        <CardBody>
          <Row className="g-2 align-items-center">
            <Col md={6} lg={5}>
              <div className="app-search">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por pregunta, slug o tema…"
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
                <Icon icon="plus" className="me-1" /> Nueva FAQ
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
            <p className="text-muted mt-3 mb-0">Cargando FAQs…</p>
          </CardBody>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardBody className="py-5 text-center">
            <Icon icon="message-question" className="fs-1 text-muted mb-2" />
            <p className="text-muted mb-0">
              {items.length === 0 ? 'Aún no hay FAQs.' : 'Ninguna coincide con la búsqueda.'}
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
                    <th>Pregunta</th>
                    <th>Tema</th>
                    <th className="text-center">Prioridad</th>
                    <th className="text-center">Estado</th>
                    <th style={{ width: 100 }} className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((f) => (
                    <tr key={f.id}>
                      <td>
                        <div className="fw-semibold">{f.question}</div>
                        <small className="text-muted">/{f.slug}</small>
                      </td>
                      <td className="text-muted fs-sm">{f.topic ?? '—'}</td>
                      <td className="text-center">{f.priority}</td>
                      <td className="text-center">
                        <Badge bg={f.active ? 'success' : 'secondary'}>{f.active ? 'Activa' : 'Inactiva'}</Badge>
                      </td>
                      <td className="text-end">
                        <Button
                          size="sm"
                          variant="light"
                          className="me-1"
                          onClick={() => {
                            setEditing(f)
                            setModalOpen(true)
                          }}>
                          <Icon icon="edit" />
                        </Button>
                        <Button size="sm" variant="outline-danger" onClick={() => handleDelete(f)}>
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

      <FaqFormModal
        show={modalOpen}
        faq={editing}
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