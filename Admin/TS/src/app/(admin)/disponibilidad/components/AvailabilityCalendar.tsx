'use client'

import type { DateClickArg } from '@fullcalendar/interaction'
import type { EventClickArg, EventInput } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import { useMemo, useRef } from 'react'
import { dayColor, type AvailabilityDay } from '@/types/availability'

interface Props {
  daysByDate: Map<string, AvailabilityDay>
  onDayClick: (dateStr: string) => void
  onRangeChange: (range: { from: string; to: string }) => void
}

const formatDate = (date: Date): string => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function AvailabilityCalendar({ daysByDate, onDayClick, onRangeChange }: Props) {
  const lastRangeRef = useRef<string>('')

  // 1 event por día. Renderizado vía eventContent, ocupando el ancho de la celda.
  const events: EventInput[] = useMemo(() => {
    return Array.from(daysByDate.values()).map((d) => ({
      start: d.date,
      allDay: true,
      title: '',
      display: 'auto',
      extendedProps: { day: d },
    }))
  }, [daysByDate])

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      locale="es"
      firstDay={1}
      height="auto"
      fixedWeekCount={false}
      contentHeight="auto"
      selectable={false}
      editable={false}
      droppable={false}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: '',
      }}
      buttonText={{ today: 'Hoy', prev: 'Anterior', next: 'Siguiente' }}
      events={events}
      datesSet={(arg) => {
        const from = formatDate(arg.start)
        const endExclusive = new Date(arg.end)
        endExclusive.setDate(endExclusive.getDate() - 1)
        const to = formatDate(endExclusive)
        const key = `${from}__${to}`
        if (lastRangeRef.current === key) return
        lastRangeRef.current = key
        onRangeChange({ from, to })
      }}
      dateClick={(arg: DateClickArg) => onDayClick(formatDate(arg.date))}
      eventClick={(arg: EventClickArg) => {
        // Click en el evento del día → mismo handler que click en la celda
        arg.jsEvent.preventDefault()
        onDayClick(formatDate(arg.event.start ?? new Date()))
      }}
      dayCellClassNames={(arg) => {
        const dateStr = formatDate(arg.date)
        const day = daysByDate.get(dateStr)
        if (!day) return []
        return [`bg-${dayColor(day)}-subtle`]
      }}
      eventContent={(arg) => {
        const day = arg.event.extendedProps.day as AvailabilityDay | undefined
        if (!day) return null
        const color = dayColor(day)
        if (day.blocked) {
          return (
            <div
              className={`d-flex align-items-center justify-content-center gap-1 w-100 px-1 py-1 rounded bg-${color} bg-opacity-25 text-${color === 'secondary' ? 'dark' : color}`}
              style={{ fontSize: '0.78rem', cursor: 'pointer' }}
              title={day.block_reason ?? 'Bloqueado'}>
              <span>🔒</span>
              <span className="fw-semibold">Bloqueado</span>
            </div>
          )
        }
        return (
          <div
            className={`d-flex align-items-baseline justify-content-center gap-1 w-100 px-1 py-1 rounded bg-${color} bg-opacity-25 text-${color}`}
            style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
            <span className="fw-bold" style={{ fontSize: '1.1rem', lineHeight: 1 }}>
              {day.remaining}
            </span>
            <span className="text-muted" style={{ fontSize: '0.7rem' }}>
              / {day.capacity}
            </span>
            {day.is_override && (
              <span className="text-info" style={{ fontSize: '0.75rem' }} title="Capacidad personalizada">
                ★
              </span>
            )}
          </div>
        )
      }}
    />
  )
}