'use client'
import Icon from '@/components/wrappers/Icon'
import { Form, FormControl, FormSelect } from 'react-bootstrap'

export interface ReservasFiltersValue {
  search: string
  tour: string
  dateFrom: string
  dateTo: string
}

interface Props {
  value: ReservasFiltersValue
  onChange: (next: ReservasFiltersValue) => void
  tours: { slug: string; name: string }[]
}

const ReservasFilters = ({ value, onChange, tours }: Props) => {
  const update = (patch: Partial<ReservasFiltersValue>) => onChange({ ...value, ...patch })

  return (
    <div className="d-flex flex-wrap gap-2 align-items-center w-100">
      <div className="app-search flex-grow-1" style={{ maxWidth: 320 }}>
        <FormControl
          type="search"
          placeholder="Buscar por código o cliente"
          value={value.search}
          onChange={(e) => update({ search: e.target.value })}
        />
        <Icon icon="search" className="app-search-icon text-muted" />
      </div>

      <div className="app-search">
        <FormSelect value={value.tour} onChange={(e) => update({ tour: e.target.value })}>
          <option value="">Todos los tours</option>
          {tours.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.name}
            </option>
          ))}
        </FormSelect>
        <Icon icon="leaf" className="app-search-icon text-muted" />
      </div>

      <div className="d-flex gap-1 align-items-center">
        <Form.Label className="mb-0 text-muted small">Desde</Form.Label>
        <FormControl
          type="date"
          value={value.dateFrom}
          onChange={(e) => update({ dateFrom: e.target.value })}
          style={{ maxWidth: 160 }}
        />
        <Form.Label className="mb-0 text-muted small">Hasta</Form.Label>
        <FormControl
          type="date"
          value={value.dateTo}
          onChange={(e) => update({ dateTo: e.target.value })}
          style={{ maxWidth: 160 }}
        />
      </div>
    </div>
  )
}

export default ReservasFilters