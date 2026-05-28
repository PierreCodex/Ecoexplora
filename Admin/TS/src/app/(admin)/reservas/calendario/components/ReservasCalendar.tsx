'use client'
import { ApiError, api } from '@/lib/api'
import { RESERVA_STATUS_META, type ReservaResumen } from '@/types/reservation'
import type { DatesSetArg, EventClickArg, EventInput } from '@fullcalendar/core/index.js'
import dayGridPlugin from '@fullcalendar/daygrid/index.js'
import interactionPlugin from '@fullcalendar/interaction/index.js'
import listPlugin from '@fullcalendar/list/index.js'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid/index.js'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Alert, Card } from 'react-bootstrap'
import { useWindowSize } from 'usehooks-ts'
import ReservaEventModal from './ReservaEventModal'

const tourPalette = ['primary', 'success', 'info', 'warning', 'purple', 'danger', 'secondary']
const tourClassFor = (slug: string) => {
  let hash = 0
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) & 0xffffffff
  return `bg-${tourPalette[Math.abs(hash) % tourPalette.length]}-subtle text-${tourPalette[Math.abs(hash) % tourPalette.length]}`
}

const ReservasCalendar = () => {
  const { height } = useWindowSize()
  const [events, setEvents] = useState<EventInput[]>([])
  const [reservas, setReservas] = useState<Record<string, ReservaResumen>>({})
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<ReservaResumen | null>(null)
  const [showModal, setShowModal] = useState(false)
  const lastRange = useRef<{ from: string; to: string } | null>(null)

  const loadRange = useCallback(async (from: string, to: string) => {
    try {
      setError(null)
      const res = await api.get<ReservaResumen[] | { items: ReservaResumen[] }>('/admin/reservations', {
        query: {
          status: 'confirmed',
          service_date_from: from,
          service_date_to: to,
          page_size: 500,
        },
      })
      const list = Array.isArray(res) ? res : res.items ?? []
      const map: Record<string, ReservaResumen> = {}
      const eventList: EventInput[] = list.map((r) => {
        map[r.id] = r
        return {
          id: r.id,
          title: `${r.code} · ${r.customer_name} (${r.pax_count} pax)`,
          start: r.service_date,
          allDay: true,
          className: tourClassFor(r.tour_name || ''),
        }
      })
      setReservas(map)
      setEvents(eventList)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error al cargar el calendario')
    }
  }, [])

  const onDatesSet = useCallback(
    (arg: DatesSetArg) => {
      const from = arg.start.toISOString().slice(0, 10)
      const to = arg.end.toISOString().slice(0, 10)
      if (lastRange.current?.from === from && lastRange.current?.to === to) return
      lastRange.current = { from, to }
      void loadRange(from, to)
    },
    [loadRange],
  )

  const onEventClick = useCallback(
    (arg: EventClickArg) => {
      const reserva = reservas[arg.event.id]
      if (reserva) {
        setSelected(reserva)
        setShowModal(true)
      }
    },
    [reservas],
  )

  const calendarHeight = useMemo(() => Math.max(500, (height || 800) - 220), [height])

  return (
    <>
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}
      <Card className="mb-0">
        <div className="card-body" style={{ minHeight: calendarHeight }}>
          <FullCalendar
            initialView="dayGridMonth"
            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin]}
            handleWindowResize
            buttonText={{
              today: 'Hoy',
              month: 'Mes',
              week: 'Semana',
              day: 'Día',
              list: 'Lista',
              prev: 'Anterior',
              next: 'Siguiente',
            }}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
            }}
            locale="es"
            firstDay={1}
            height={calendarHeight}
            editable={false}
            selectable={false}
            droppable={false}
            events={events}
            eventClick={onEventClick}
            datesSet={onDatesSet}
          />
        </div>
      </Card>

      <div className="d-flex flex-wrap align-items-center gap-3 mt-3 fs-12">
        <span className="text-muted">Estado:</span>
        <span className={`badge bg-${RESERVA_STATUS_META.confirmed.variant}-subtle text-${RESERVA_STATUS_META.confirmed.variant}`}>
          Solo reservas confirmadas
        </span>
      </div>

      <ReservaEventModal
        reserva={selected}
        show={showModal}
        onClose={() => {
          setShowModal(false)
          setTimeout(() => setSelected(null), 200)
        }}
      />
    </>
  )
}

export default ReservasCalendar