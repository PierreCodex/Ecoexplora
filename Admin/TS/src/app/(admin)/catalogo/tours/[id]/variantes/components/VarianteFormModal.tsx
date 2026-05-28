'use client'

import RichTextEditor from '@/components/RichTextEditor'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useMemo } from 'react'
import { Button, Col, Form, Modal, Nav, Row, Spinner, Tab } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import {
  DURATION_TYPE_LABEL,
  MONTH_LABEL,
  PRICE_UNIT_LABEL,
  slugify,
  type Destination,
  type DurationType,
  type PriceCurrency,
  type PriceUnit,
  type TourVariant,
  type VariantActivity,
} from '@/types/catalog'
import ActividadesTimeline from './ActividadesTimeline'

export interface VarianteFormValues {
  variant_label: string
  slug: string
  summary: string
  active: boolean
  // precio
  price_amount: number | string
  price_currency: PriceCurrency
  price_unit: PriceUnit
  price_total_amount: number | string
  // duración
  duration_type: DurationType
  duration_hours: number | string
  duration_days: number | string
  duration_nights: number | string
  // contenido (Quill libre)
  includes_text: string
  recommendations_text: string
  important_notes_text: string
  // itinerario estructurado (timeline)
  activities: VariantActivity[]
  // cupos + destinos + extra
  default_daily_capacity: number | string
  destination_ids: string[]
  available_months: number[]
  includes_lodging: boolean
  is_international: boolean
}

interface Props {
  show: boolean
  variant: TourVariant | null
  destinations: Destination[]
  onClose: () => void
  onSubmit: (values: VarianteFormValues) => Promise<void>
}

const schema: yup.ObjectSchema<VarianteFormValues> = yup.object({
  variant_label: yup.string().required('Etiqueta obligatoria').max(120),
  slug: yup
    .string()
    .required('Slug obligatorio')
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Solo minúsculas, números y guiones'),
  summary: yup.string().default(''),
  active: yup.boolean().default(true).required(),
  price_amount: yup
    .number()
    .typeError('Precio inválido')
    .moreThan(0, 'Debe ser mayor a 0')
    .required('Precio obligatorio'),
  price_currency: yup.mixed<PriceCurrency>().oneOf(['PEN', 'USD']).default('PEN').required(),
  price_unit: yup.mixed<PriceUnit>().oneOf(['per_person', 'per_person_per_day', 'group']).default('per_person').required(),
  price_total_amount: yup
    .mixed<number | string>()
    .test('opt-number', 'Número inválido', (v) => v === '' || v == null || (!isNaN(Number(v)) && Number(v) >= 0)),
  duration_type: yup.mixed<DurationType>().oneOf(['half_day', 'full_day', 'multi_day']).default('full_day').required(),
  duration_hours: yup
    .mixed<number | string>()
    .test('opt-int', 'Entero positivo', (v) => v === '' || v == null || (Number.isInteger(Number(v)) && Number(v) > 0)),
  duration_days: yup
    .mixed<number | string>()
    .test('opt-int', 'Entero positivo', (v) => v === '' || v == null || (Number.isInteger(Number(v)) && Number(v) > 0)),
  duration_nights: yup
    .mixed<number | string>()
    .test('opt-int', 'Entero ≥ 0', (v) => v === '' || v == null || (Number.isInteger(Number(v)) && Number(v) >= 0)),
  includes_text: yup.string().default(''),
  recommendations_text: yup.string().default(''),
  important_notes_text: yup.string().default(''),
  activities: yup
    .mixed<VariantActivity[]>()
    .default([] as VariantActivity[])
    .test('activities-titles', 'Cada actividad necesita título', (v) =>
      !v || (v as VariantActivity[]).every((a) => !!a?.title && a.title.trim().length > 0),
    )
    .required() as yup.Schema<VariantActivity[]>,
  default_daily_capacity: yup
    .number()
    .typeError('Cupo inválido')
    .integer('Entero')
    .min(0, 'Mínimo 0')
    .default(20)
    .required(),
  destination_ids: yup.array().of(yup.string().required()).default([]),
  available_months: yup.array().of(yup.number().required().min(1).max(12)).default([]),
  includes_lodging: yup.boolean().default(false).required(),
  is_international: yup.boolean().default(false).required(),
})

const EMPTY: VarianteFormValues = {
  variant_label: '',
  slug: '',
  summary: '',
  active: true,
  price_amount: '',
  price_currency: 'PEN',
  price_unit: 'per_person',
  price_total_amount: '',
  duration_type: 'full_day',
  duration_hours: '',
  duration_days: '',
  duration_nights: '',
  includes_text: '',
  recommendations_text: '',
  important_notes_text: '',
  activities: [],
  default_daily_capacity: 20,
  destination_ids: [],
  available_months: [],
  includes_lodging: false,
  is_international: false,
}

export default function VarianteFormModal({ show, variant, destinations, onClose, onSubmit }: Props) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<VarianteFormValues>({
    resolver: yupResolver(schema),
    defaultValues: EMPTY,
  })

  useEffect(() => {
    if (!show) return
    if (variant) {
      reset({
        variant_label: variant.variant_label,
        slug: variant.slug,
        summary: variant.summary ?? '',
        active: variant.active,
        price_amount: variant.price_amount,
        price_currency: variant.price_currency,
        price_unit: variant.price_unit,
        price_total_amount: variant.price_total_amount ?? '',
        duration_type: variant.duration_type,
        duration_hours: variant.duration_hours ?? '',
        duration_days: variant.duration_days ?? '',
        duration_nights: variant.duration_nights ?? '',
        includes_text: variant.includes_text ?? '',
        recommendations_text: variant.recommendations_text ?? '',
        important_notes_text: variant.important_notes_text ?? '',
        activities: variant.activities ?? [],
        default_daily_capacity: variant.default_daily_capacity,
        destination_ids: variant.destinations.map((d) => d.id),
        available_months: variant.available_months ?? [],
        includes_lodging: variant.includes_lodging,
        is_international: variant.is_international,
      })
    } else {
      reset(EMPTY)
    }
  }, [show, variant, reset])

  const label = watch('variant_label')
  useEffect(() => {
    if (variant || dirtyFields.slug) return
    setValue('slug', slugify(label ?? ''))
  }, [label, variant, dirtyFields.slug, setValue])

  const durationType = watch('duration_type')
  const durationDays = watch('duration_days')
  const selectedDestinationIds = watch('destination_ids')

  // Cuántos días tiene el itinerario (1 para half/full_day, n para multi_day)
  const numberOfDays = useMemo(() => {
    if (durationType !== 'multi_day') return 1
    const n = Number(durationDays)
    return Number.isFinite(n) && n > 0 ? n : 1
  }, [durationType, durationDays])

  // Destinos disponibles para escoger por actividad: los que la variante tiene vinculados.
  const activityDestinations = useMemo(() => {
    const set = new Set(selectedDestinationIds ?? [])
    return destinations
      .filter((d) => set.has(d.id))
      .map((d) => ({ id: d.id, slug: d.slug, name: d.name, latitude: d.latitude, longitude: d.longitude }))
  }, [destinations, selectedDestinationIds])

  const submit = handleSubmit(async (v) =>
    onSubmit({
      ...v,
      summary: v.summary?.trim() || '',
    }),
  )

  return (
    <Modal show={show} onHide={onClose} size="xl" backdrop="static" centered scrollable>
      <Form onSubmit={submit} noValidate>
        <Modal.Header closeButton>
          <Modal.Title>{variant ? `Editar variante: ${variant.variant_label}` : 'Nueva variante'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tab.Container defaultActiveKey="basics">
            <Nav variant="pills" className="mb-3 gap-1 flex-wrap">
              <Nav.Item><Nav.Link eventKey="basics">1. Datos básicos</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="price">2. Precio</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="duration">3. Duración</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="itinerary">4. Itinerario</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="content">5. Contenido</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="capacity">6. Cupos y destinos</Nav.Link></Nav.Item>
            </Nav>

            <Tab.Content>
              {/* ----- 1. Datos básicos ----- */}
              <Tab.Pane eventKey="basics">
                <Row className="g-3">
                  <Col md={8}>
                    <Form.Label>Etiqueta *</Form.Label>
                    <Form.Control type="text" isInvalid={!!errors.variant_label} {...register('variant_label')} placeholder="Manglares Premium" />
                    <Form.Control.Feedback type="invalid">{errors.variant_label?.message}</Form.Control.Feedback>
                  </Col>
                  <Col md={4}>
                    <Form.Label>Activa</Form.Label>
                    <Form.Check type="switch" id="variant-form-active" label="Visible para el bot" {...register('active')} className="mt-2" />
                  </Col>
                  <Col md={12}>
                    <Form.Label>Slug *</Form.Label>
                    <Form.Control type="text" isInvalid={!!errors.slug} {...register('slug')} />
                    <Form.Control.Feedback type="invalid">{errors.slug?.message}</Form.Control.Feedback>
                  </Col>
                  <Col md={12}>
                    <Form.Label>Resumen</Form.Label>
                    <Form.Control as="textarea" rows={3} {...register('summary')} placeholder="Descripción corta de esta variante (1-2 líneas)" />
                  </Col>
                </Row>
              </Tab.Pane>

              {/* ----- 2. Precio ----- */}
              <Tab.Pane eventKey="price">
                <Row className="g-3">
                  <Col md={4}>
                    <Form.Label>Precio *</Form.Label>
                    <Form.Control type="number" step="0.01" isInvalid={!!errors.price_amount} {...register('price_amount', { valueAsNumber: true })} />
                    <Form.Control.Feedback type="invalid">{errors.price_amount?.message}</Form.Control.Feedback>
                  </Col>
                  <Col md={4}>
                    <Form.Label>Moneda</Form.Label>
                    <Form.Select {...register('price_currency')}>
                      <option value="PEN">PEN — Soles</option>
                      <option value="USD">USD — Dólares</option>
                    </Form.Select>
                  </Col>
                  <Col md={4}>
                    <Form.Label>Unidad</Form.Label>
                    <Form.Select {...register('price_unit')}>
                      {(Object.entries(PRICE_UNIT_LABEL) as [PriceUnit, string][]).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={6}>
                    <Form.Label>Precio total (opcional)</Form.Label>
                    <Form.Control type="number" step="0.01" isInvalid={!!errors.price_total_amount} {...register('price_total_amount')} placeholder="Precio total si la unidad es por grupo o si quieres mostrar un agregado" />
                    <Form.Control.Feedback type="invalid">{errors.price_total_amount?.message as string}</Form.Control.Feedback>
                  </Col>
                </Row>
              </Tab.Pane>

              {/* ----- 3. Duración ----- */}
              <Tab.Pane eventKey="duration">
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label>Tipo de duración</Form.Label>
                    <Form.Select {...register('duration_type')}>
                      {(Object.entries(DURATION_TYPE_LABEL) as [DurationType, string][]).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </Form.Select>
                  </Col>
                  {(durationType === 'half_day' || durationType === 'full_day') && (
                    <Col md={6}>
                      <Form.Label>Horas</Form.Label>
                      <Form.Control type="number" isInvalid={!!errors.duration_hours} {...register('duration_hours')} placeholder="6" />
                      <Form.Control.Feedback type="invalid">{errors.duration_hours?.message as string}</Form.Control.Feedback>
                    </Col>
                  )}
                  {durationType === 'multi_day' && (
                    <>
                      <Col md={3}>
                        <Form.Label>Días</Form.Label>
                        <Form.Control type="number" isInvalid={!!errors.duration_days} {...register('duration_days')} placeholder="3" />
                        <Form.Control.Feedback type="invalid">{errors.duration_days?.message as string}</Form.Control.Feedback>
                      </Col>
                      <Col md={3}>
                        <Form.Label>Noches</Form.Label>
                        <Form.Control type="number" isInvalid={!!errors.duration_nights} {...register('duration_nights')} placeholder="2" />
                        <Form.Control.Feedback type="invalid">{errors.duration_nights?.message as string}</Form.Control.Feedback>
                      </Col>
                    </>
                  )}
                </Row>
              </Tab.Pane>

              {/* ----- 4. Itinerario (timeline) ----- */}
              <Tab.Pane eventKey="itinerary">
                <div className="mb-2 text-muted fs-sm">
                  Agrega cada actividad del tour con su hora (opcional). Si la variante es multi-día, verás tabs por día.
                  Los destinos disponibles aquí son los que vinculas en la pestaña 6.
                </div>
                <Controller
                  name="activities"
                  control={control}
                  render={({ field }) => (
                    <ActividadesTimeline
                      value={field.value ?? []}
                      onChange={field.onChange}
                      numberOfDays={numberOfDays}
                      availableDestinations={activityDestinations}
                    />
                  )}
                />
                {errors.activities && (
                  <div className="text-danger mt-2 fs-sm">{errors.activities.message as string}</div>
                )}
              </Tab.Pane>

              {/* ----- 5. Contenido (Quill x3) ----- */}
              <Tab.Pane eventKey="content">
                <Row className="g-3">
                  <Col md={12}>
                    <Form.Label>Qué incluye</Form.Label>
                    <Controller
                      name="includes_text"
                      control={control}
                      render={({ field }) => (
                        <RichTextEditor value={field.value ?? ''} onChange={field.onChange} placeholder="Almuerzo, guía, transporte, etc." minHeight={140} />
                      )}
                    />
                  </Col>
                  <Col md={12}>
                    <Form.Label>Recomendaciones</Form.Label>
                    <Controller
                      name="recommendations_text"
                      control={control}
                      render={({ field }) => (
                        <RichTextEditor value={field.value ?? ''} onChange={field.onChange} placeholder="Qué llevar, qué evitar, etc." minHeight={140} />
                      )}
                    />
                  </Col>
                  <Col md={12}>
                    <Form.Label>Notas importantes</Form.Label>
                    <Controller
                      name="important_notes_text"
                      control={control}
                      render={({ field }) => (
                        <RichTextEditor value={field.value ?? ''} onChange={field.onChange} placeholder="Información clave que el cliente debe saber…" minHeight={140} />
                      )}
                    />
                  </Col>
                </Row>
              </Tab.Pane>

              {/* ----- 5. Cupos + destinos + extras ----- */}
              <Tab.Pane eventKey="capacity">
                <Row className="g-3">
                  <Col md={4}>
                    <Form.Label>Cupo diario por defecto *</Form.Label>
                    <Form.Control type="number" isInvalid={!!errors.default_daily_capacity} {...register('default_daily_capacity', { valueAsNumber: true })} />
                    <Form.Control.Feedback type="invalid">{errors.default_daily_capacity?.message}</Form.Control.Feedback>
                  </Col>
                  <Col md={4}>
                    <Form.Label>Incluye hospedaje</Form.Label>
                    <Form.Check type="switch" id="variant-form-lodging" label="Sí" {...register('includes_lodging')} className="mt-2" />
                  </Col>
                  <Col md={4}>
                    <Form.Label>Tour internacional</Form.Label>
                    <Form.Check type="switch" id="variant-form-international" label="Sí" {...register('is_international')} className="mt-2" />
                  </Col>

                  <Col md={12}>
                    <Form.Label>Meses disponibles</Form.Label>
                    <Controller
                      name="available_months"
                      control={control}
                      render={({ field }) => (
                        <div className="d-flex flex-wrap gap-2">
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
                            const active = field.value?.includes(m) ?? false
                            return (
                              <Button
                                key={m}
                                type="button"
                                size="sm"
                                variant={active ? 'primary' : 'outline-secondary'}
                                onClick={() => {
                                  const set = new Set(field.value ?? [])
                                  if (active) set.delete(m)
                                  else set.add(m)
                                  field.onChange(Array.from(set).sort((a, b) => a - b))
                                }}>
                                {MONTH_LABEL[m]}
                              </Button>
                            )
                          })}
                        </div>
                      )}
                    />
                    <Form.Text className="text-muted">Vacío = todo el año. Selecciona meses para limitar disponibilidad.</Form.Text>
                  </Col>

                  <Col md={12}>
                    <Form.Label>Destinos</Form.Label>
                    {destinations.length === 0 ? (
                      <p className="text-muted fst-italic mb-0">No hay destinos creados. Crea destinos primero en /catalogo/destinos.</p>
                    ) : (
                      <Controller
                        name="destination_ids"
                        control={control}
                        render={({ field }) => (
                          <div className="border rounded p-2" style={{ maxHeight: 240, overflowY: 'auto' }}>
                            {destinations.map((d) => {
                              const checked = field.value?.includes(d.id) ?? false
                              return (
                                <Form.Check
                                  key={d.id}
                                  type="checkbox"
                                  id={`dest-${d.id}`}
                                  label={
                                    <>
                                      <span className="fw-medium">{d.name}</span>{' '}
                                      <small className="text-muted">/{d.slug}</small>
                                    </>
                                  }
                                  checked={checked}
                                  onChange={() => {
                                    const set = new Set(field.value ?? [])
                                    if (checked) set.delete(d.id)
                                    else set.add(d.id)
                                    field.onChange(Array.from(set))
                                  }}
                                />
                              )
                            })}
                          </div>
                        )}
                      />
                    )}
                  </Col>
                </Row>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting && <Spinner as="span" size="sm" className="me-2" />}
            {variant ? 'Guardar cambios' : 'Crear variante'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}