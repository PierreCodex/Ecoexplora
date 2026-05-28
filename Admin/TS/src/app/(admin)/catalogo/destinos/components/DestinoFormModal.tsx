'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { slugify, type Destination } from '@/types/catalog'

export interface DestinoFormValues {
  name: string
  slug: string
  latitude: string | number | null
  longitude: string | number | null
  aliases: string
}

interface Props {
  show: boolean
  destino: Destination | null
  onClose: () => void
  onSubmit: (values: DestinoFormValues) => Promise<void>
}

const schema: yup.ObjectSchema<DestinoFormValues> = yup.object({
  name: yup.string().required('El nombre es obligatorio').max(120),
  slug: yup
    .string()
    .required('El slug es obligatorio')
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Solo minúsculas, números y guiones'),
  latitude: yup
    .mixed<string | number | null>()
    .nullable()
    .test('range', 'Entre -90 y 90', (v) => v == null || v === '' || (Number(v) >= -90 && Number(v) <= 90)),
  longitude: yup
    .mixed<string | number | null>()
    .nullable()
    .test('range', 'Entre -180 y 180', (v) => v == null || v === '' || (Number(v) >= -180 && Number(v) <= 180)),
  aliases: yup.string().default(''),
})

const EMPTY: DestinoFormValues = { name: '', slug: '', latitude: '', longitude: '', aliases: '' }

export default function DestinoFormModal({ show, destino, onClose, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<DestinoFormValues>({
    resolver: yupResolver(schema),
    defaultValues: EMPTY,
  })

  useEffect(() => {
    if (!show) return
    if (destino) {
      reset({
        name: destino.name,
        slug: destino.slug,
        latitude: destino.latitude ?? '',
        longitude: destino.longitude ?? '',
        aliases: (destino.aliases ?? []).join(', '),
      })
    } else {
      reset(EMPTY)
    }
  }, [show, destino, reset])

  const name = watch('name')
  useEffect(() => {
    if (destino || dirtyFields.slug) return
    setValue('slug', slugify(name ?? ''))
  }, [name, destino, dirtyFields.slug, setValue])

  const submit = handleSubmit(async (v) => onSubmit(v))

  return (
    <Modal show={show} onHide={onClose} size="lg" backdrop="static" centered>
      <Form onSubmit={submit} noValidate>
        <Modal.Header closeButton>
          <Modal.Title>{destino ? 'Editar destino' : 'Nuevo destino'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={12}>
              <Form.Label>Nombre *</Form.Label>
              <Form.Control type="text" isInvalid={!!errors.name} {...register('name')} placeholder="Manglares de Puerto Pizarro" />
              <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
            </Col>
            <Col md={12}>
              <Form.Label>Slug *</Form.Label>
              <Form.Control type="text" isInvalid={!!errors.slug} {...register('slug')} />
              <Form.Control.Feedback type="invalid">{errors.slug?.message}</Form.Control.Feedback>
            </Col>
            <Col md={6}>
              <Form.Label>Latitud</Form.Label>
              <Form.Control type="number" step="any" isInvalid={!!errors.latitude} {...register('latitude')} placeholder="-3.4953" />
              <Form.Control.Feedback type="invalid">{errors.latitude?.message}</Form.Control.Feedback>
            </Col>
            <Col md={6}>
              <Form.Label>Longitud</Form.Label>
              <Form.Control type="number" step="any" isInvalid={!!errors.longitude} {...register('longitude')} placeholder="-80.4117" />
              <Form.Control.Feedback type="invalid">{errors.longitude?.message}</Form.Control.Feedback>
            </Col>
            <Col md={12}>
              <Form.Label>Aliases</Form.Label>
              <Form.Control as="textarea" rows={2} {...register('aliases')} placeholder="Puerto Pizarro, manglares, Tumbes manglares" />
              <Form.Text className="text-muted">Separa con coma. Ayudan al bot a entender variantes del nombre.</Form.Text>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting && <Spinner as="span" size="sm" className="me-2" />}
            {destino ? 'Guardar cambios' : 'Crear destino'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}