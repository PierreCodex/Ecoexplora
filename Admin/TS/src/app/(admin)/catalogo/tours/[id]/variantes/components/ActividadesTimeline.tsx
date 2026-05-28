'use client'

import Icon from '@/components/wrappers/Icon'
import type { VariantActivity, VariantDestinationRef } from '@/types/catalog'
import { useMemo, useState } from 'react'
import { Button, Col, Form, Nav, Row } from 'react-bootstrap'

interface Props {
  value: VariantActivity[]
  onChange: (next: VariantActivity[]) => void
  numberOfDays: number  // 1 si single-day, n si multi_day
  availableDestinations: VariantDestinationRef[]
}

const EMPTY_ACTIVITY = (day: number): VariantActivity => ({
  day,
  start_time: null,
  end_time: null,
  title: '',
  description: '',
  destination_id: null,
})

const normalizeTime = (raw: string): string | null => {
  if (!raw) return null
  // HTML time input emite HH:MM o HH:MM:SS — quedamos con HH:MM
  return raw.slice(0, 5)
}

export default function ActividadesTimeline({
  value,
  onChange,
  numberOfDays,
  availableDestinations,
}: Props) {
  const days = Math.max(1, numberOfDays)
  const [activeDay, setActiveDay] = useState(1)

  const byDay = useMemo(() => {
    const map = new Map<number, VariantActivity[]>()
    for (let d = 1; d <= days; d++) map.set(d, [])
    value.forEach((a) => {
      const d = Math.min(Math.max(a.day, 1), days)
      if (!map.has(d)) map.set(d, [])
      map.get(d)!.push(a)
    })
    return map
  }, [value, days])

  const updateOne = (idx: number, patch: Partial<VariantActivity>) => {
    const next = value.map((a, i) => (i === idx ? { ...a, ...patch } : a))
    onChange(next)
  }

  const removeOne = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx))
  }

  const addOne = () => {
    onChange([...value, EMPTY_ACTIVITY(activeDay)])
  }

  const renderActivityRow = (act: VariantActivity, globalIdx: number, dayCount: number) => {
    const destOptions = availableDestinations
    return (
      <div className="timeline-item d-flex align-items-start" key={`a-${globalIdx}`}>
        <div className="timeline-time pe-2 text-muted" style={{ minWidth: 88 }}>
          <div className="d-flex flex-column gap-1">
            <Form.Control
              type="time"
              size="sm"
              value={act.start_time ?? ''}
              onChange={(e) => updateOne(globalIdx, { start_time: normalizeTime(e.target.value) })}
              placeholder="HH:MM"
            />
            <Form.Control
              type="time"
              size="sm"
              value={act.end_time ?? ''}
              onChange={(e) => updateOne(globalIdx, { end_time: normalizeTime(e.target.value) })}
              placeholder="HH:MM"
            />
          </div>
        </div>
        <div className="timeline-dot">
          <Icon icon="clock" className="fs-xl text-primary" />
        </div>
        <div className="timeline-content ps-3 pb-3 flex-grow-1">
          <Row className="g-2">
            <Col md={8}>
              <Form.Control
                type="text"
                size="sm"
                placeholder="Actividad (ej. Recorrido en bote por los manglares)"
                value={act.title}
                onChange={(e) => updateOne(globalIdx, { title: e.target.value })}
              />
            </Col>
            <Col md={4}>
              <Form.Select
                size="sm"
                value={act.destination_id ?? ''}
                onChange={(e) => updateOne(globalIdx, { destination_id: e.target.value || null })}
                disabled={destOptions.length === 0}>
                <option value="">{destOptions.length === 0 ? 'Sin destinos vinculados' : '— Sin destino —'}</option>
                {destOptions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={12}>
              <Form.Control
                as="textarea"
                rows={2}
                size="sm"
                placeholder="Descripción (opcional): qué se hace, qué llevar, etc."
                value={act.description ?? ''}
                onChange={(e) => updateOne(globalIdx, { description: e.target.value })}
              />
            </Col>
          </Row>
          <div className="d-flex align-items-center justify-content-between mt-2">
            <small className="text-muted">
              Posición {dayCount + 1} · {act.start_time || act.end_time ? 'con horario' : 'bloque flexible'}
            </small>
            <Button size="sm" variant="outline-danger" onClick={() => removeOne(globalIdx)}>
              <Icon icon="trash" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const renderDay = (day: number) => {
    const acts = byDay.get(day) ?? []
    return (
      <div className="timeline timeline-icon-bordered">
        <div className="mb-3">
          {days > 1 && <h6 className="text-muted fw-bold mb-3">Día {day}</h6>}
          {acts.length === 0 ? (
            <p className="text-muted text-center fst-italic my-4">Aún no hay actividades para este día.</p>
          ) : (
            acts.map((a, localIdx) => {
              const globalIdx = value.findIndex(
                (x, gi) => x === a && gi >= 0,
              )
              return renderActivityRow(a, globalIdx, localIdx)
            })
          )}
        </div>
        <Button variant="outline-primary" size="sm" onClick={addOne}>
          <Icon icon="plus" className="me-1" /> Agregar actividad {days > 1 ? `al día ${day}` : ''}
        </Button>
      </div>
    )
  }

  if (days === 1) {
    return <div>{renderDay(1)}</div>
  }

  return (
    <div>
      <Nav variant="tabs" activeKey={String(activeDay)} onSelect={(k) => k && setActiveDay(Number(k))} className="mb-3">
        {Array.from({ length: days }, (_, i) => i + 1).map((d) => {
          const count = byDay.get(d)?.length ?? 0
          return (
            <Nav.Item key={d}>
              <Nav.Link eventKey={String(d)}>
                Día {d}
                {count > 0 && <span className="ms-1 badge bg-primary">{count}</span>}
              </Nav.Link>
            </Nav.Item>
          )
        })}
      </Nav>
      {renderDay(activeDay)}
    </div>
  )
}