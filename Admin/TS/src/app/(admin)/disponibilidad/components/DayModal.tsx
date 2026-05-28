'use client'

import Icon from '@/components/wrappers/Icon'
import { ApiError, api } from '@/lib/api'
import { confirmAction, notifyError, notifyOk } from '@/lib/confirm'
import type { AvailabilityDay } from '@/types/availability'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { useEffect, useState } from 'react'
import { Badge, Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap'

dayjs.locale('es')

interface Props {
  show: boolean
  variantId: string
  variantLabel: string
  tourName: string
  defaultCapacity: number
  date: string  // YYYY-MM-DD
  day?: AvailabilityDay
  onClose: (changed: boolean) => void
  onError: (msg: string) => void
}

export default function DayModal({
  show,
  variantId,
  variantLabel,
  tourName,
  defaultCapacity,
  date,
  day,
  onClose,
  onError,
}: Props) {
  const [capacity, setCapacity] = useState<number>(day?.capacity ?? defaultCapacity)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (show) {
      setCapacity(day?.capacity ?? defaultCapacity)
    }
  }, [show, day, defaultCapacity])

  const isOverride = day?.is_override ?? false
  const isBlocked = day?.blocked ?? false
  const isGlobalBlock = day?.block_scope === 'global'

  const handleSaveCapacity = async () => {
    if (capacity < 0) {
      onError('La capacidad no puede ser negativa')
      return
    }
    try {
      setSaving(true)
      await api.put(`/admin/availability/${variantId}/${date}`, { capacity })
      await notifyOk('Capacidad actualizada')
      onClose(true)
    } catch (err) {
      onError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleResetCapacity = async () => {
    const { confirmed } = await confirmAction({
      title: '¿Restaurar capacidad por defecto?',
      text: `Se eliminará el override de capacidad para esta fecha. Volverá al default de la variante (${defaultCapacity}).`,
      variant: 'warning',
      confirmText: 'Sí, restaurar',
    })
    if (!confirmed) return
    try {
      setSaving(true)
      await api.delete(`/admin/availability/${variantId}/${date}`)
      await notifyOk('Capacidad restaurada')
      onClose(true)
    } catch (err) {
      onError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error al restaurar')
    } finally {
      setSaving(false)
    }
  }

  const handleBlock = async () => {
    const { confirmed, reason } = await confirmAction({
      title: '¿Bloquear esta fecha para la variante?',
      text: `Indica un motivo (opcional). Las reservas existentes no se cancelan automáticamente.`,
      requireReason: false,
      variant: 'danger',
      confirmText: 'Sí, bloquear',
      inputPlaceholder: 'Motivo (opcional): clima, mantenimiento, feriado…',
    })
    if (!confirmed) return
    try {
      setSaving(true)
      await api.post('/admin/date-blocks', {
        date,
        tour_variant_id: variantId,
        reason: (reason ?? '').trim() || null,
      })
      await notifyOk('Fecha bloqueada')
      onClose(true)
    } catch (err) {
      onError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error al bloquear')
    } finally {
      setSaving(false)
    }
  }

  const handleUnblock = async () => {
    if (!day?.block_id) return
    const { confirmed } = await confirmAction({
      title: isGlobalBlock ? '¿Quitar bloqueo global?' : '¿Quitar bloqueo de la variante?',
      text: isGlobalBlock
        ? 'Esto desbloquea la fecha para TODAS las variantes.'
        : 'Esto desbloquea la fecha solo para esta variante.',
      variant: 'warning',
      confirmText: 'Sí, desbloquear',
    })
    if (!confirmed) return
    try {
      setSaving(true)
      await api.delete(`/admin/date-blocks/${day.block_id}`)
      await notifyOk('Bloqueo eliminado')
      onClose(true)
    } catch (err) {
      onError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error al desbloquear')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal show={show} onHide={() => onClose(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title className="fs-5">
          {dayjs(date).format('dddd, D [de] MMMM [de] YYYY')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted mb-3">
          <span className="fw-semibold">{tourName}</span> · {variantLabel}
        </p>

        {isBlocked && (
          <div className="alert alert-secondary d-flex align-items-start gap-2">
            <Icon icon="lock" className="fs-xl mt-1" />
            <div>
              <div className="fw-semibold">
                Fecha bloqueada{' '}
                <Badge bg={isGlobalBlock ? 'dark' : 'secondary'}>
                  {isGlobalBlock ? 'global' : 'esta variante'}
                </Badge>
              </div>
              {day?.block_reason && <small className="text-muted">Motivo: {day.block_reason}</small>}
            </div>
          </div>
        )}

        <Row className="g-3 mb-3">
          <Col xs={4}>
            <div className="border rounded p-2 text-center bg-light">
              <div className="fs-3 fw-bold lh-1">{day?.capacity ?? defaultCapacity}</div>
              <small className="text-muted">Cupo total</small>
            </div>
          </Col>
          <Col xs={4}>
            <div className="border rounded p-2 text-center bg-light">
              <div className="fs-3 fw-bold lh-1">{day?.reserved ?? 0}</div>
              <small className="text-muted">Reservado</small>
            </div>
          </Col>
          <Col xs={4}>
            <div className="border rounded p-2 text-center bg-light">
              <div className="fs-3 fw-bold lh-1 text-success">{isBlocked ? 0 : (day?.remaining ?? defaultCapacity)}</div>
              <small className="text-muted">Restante</small>
            </div>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label className="d-flex justify-content-between align-items-center">
            <span>
              Capacidad personalizada
              {isOverride && <Badge bg="info" className="ms-2">Override activo</Badge>}
            </span>
            <small className="text-muted">Default: {defaultCapacity}</small>
          </Form.Label>
          <div className="d-flex gap-2">
            <Form.Control
              type="number"
              min={0}
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              disabled={saving || isGlobalBlock}
            />
            <Button variant="primary" onClick={handleSaveCapacity} disabled={saving || isGlobalBlock}>
              {saving ? <Spinner size="sm" /> : 'Guardar'}
            </Button>
          </div>
          {isOverride && (
            <Button
              variant="link"
              size="sm"
              className="px-0 mt-1 text-decoration-none"
              onClick={handleResetCapacity}
              disabled={saving}>
              <Icon icon="rotate-ccw" className="me-1" /> Restaurar al default
            </Button>
          )}
        </Form.Group>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        {isBlocked ? (
          <Button variant="outline-success" onClick={handleUnblock} disabled={saving || isGlobalBlock}>
            <Icon icon="lock-open" className="me-1" /> Desbloquear
          </Button>
        ) : (
          <Button variant="outline-danger" onClick={handleBlock} disabled={saving}>
            <Icon icon="lock" className="me-1" /> Bloquear esta variante
          </Button>
        )}
        <Button variant="light" onClick={() => onClose(false)} disabled={saving}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}