'use client'

import { ApiError, api } from '@/lib/api'
import { notifyError } from '@/lib/confirm'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

interface VariantOption {
  variantId: string
  variantLabel: string
  tourId: string
  tourName: string
}

interface FormValues {
  date: string
  scope: 'variant' | 'global'
  variantId: string
  reason: string
}

const schema: yup.ObjectSchema<FormValues> = yup.object({
  date: yup
    .string()
    .required('Fecha obligatoria')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD'),
  scope: yup.mixed<'variant' | 'global'>().oneOf(['variant', 'global']).default('variant').required(),
  variantId: yup.string().default('').when('scope', {
    is: 'variant',
    then: (s) => s.required('Selecciona una variante'),
  }),
  reason: yup.string().default('').max(500),
})

interface Props {
  show: boolean
  variants: VariantOption[]
  onClose: (changed: boolean) => void
}

export default function BlockDateModal({ show, variants, onClose }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      scope: 'variant',
      variantId: variants[0]?.variantId ?? '',
      reason: '',
    },
  })

  useEffect(() => {
    if (show) {
      reset({
        date: new Date().toISOString().slice(0, 10),
        scope: 'variant',
        variantId: variants[0]?.variantId ?? '',
        reason: '',
      })
    }
  }, [show, variants, reset])

  const scope = watch('scope')

  const submit = handleSubmit(async (v) => {
    try {
      await api.post('/admin/date-blocks', {
        date: v.date,
        tour_variant_id: v.scope === 'variant' ? v.variantId : null,
        reason: v.reason?.trim() || null,
      })
      onClose(true)
    } catch (err) {
      await notifyError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error al bloquear')
    }
  })

  return (
    <Modal show={show} onHide={() => onClose(false)} centered>
      <Form onSubmit={submit} noValidate>
        <Modal.Header closeButton>
          <Modal.Title>Bloquear fecha</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Fecha *</Form.Label>
            <Form.Control type="date" isInvalid={!!errors.date} {...register('date')} />
            <Form.Control.Feedback type="invalid">{errors.date?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Alcance del bloqueo</Form.Label>
            <Form.Select {...register('scope')}>
              <option value="variant">Solo una variante específica</option>
              <option value="global">Global (todas las variantes)</option>
            </Form.Select>
          </Form.Group>

          {scope === 'variant' && (
            <Form.Group className="mb-3">
              <Form.Label>Variante *</Form.Label>
              <Form.Select isInvalid={!!errors.variantId} {...register('variantId')}>
                {variants.map((v) => (
                  <option key={v.variantId} value={v.variantId}>
                    {v.tourName} — {v.variantLabel}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.variantId?.message}</Form.Control.Feedback>
            </Form.Group>
          )}

          <Form.Group>
            <Form.Label>Motivo (opcional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              {...register('reason')}
              placeholder="Clima, mantenimiento, feriado, etc."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => onClose(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button variant="danger" type="submit" disabled={isSubmitting}>
            {isSubmitting && <Spinner as="span" size="sm" className="me-2" />}
            Bloquear
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}