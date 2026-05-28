'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { slugify, type Tour, type TourFormValues } from '@/types/catalog'

interface Props {
  show: boolean
  tour: Tour | null
  onClose: () => void
  onSubmit: (values: TourFormValues) => Promise<void>
}

const schema: yup.ObjectSchema<TourFormValues> = yup.object({
  name: yup.string().required('El nombre es obligatorio').max(120, 'Máximo 120 caracteres'),
  slug: yup
    .string()
    .required('El slug es obligatorio')
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Solo minúsculas, números y guiones'),
  base_description: yup.string().default('').max(2000, 'Máximo 2000 caracteres'),
  active: yup.boolean().default(true).required(),
  display_order: yup.number().typeError('Debe ser un número').integer('Sin decimales').min(0, 'Mínimo 0').default(0).required(),
})

const EMPTY: TourFormValues = {
  name: '',
  slug: '',
  base_description: '',
  active: true,
  display_order: 0,
}

export default function TourFormModal({ show, tour, onClose, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<TourFormValues>({
    resolver: yupResolver(schema),
    defaultValues: EMPTY,
  })

  useEffect(() => {
    if (!show) return
    if (tour) {
      reset({
        name: tour.name,
        slug: tour.slug,
        base_description: tour.base_description ?? '',
        active: tour.active,
        display_order: tour.display_order ?? 0,
      })
    } else {
      reset(EMPTY)
    }
  }, [show, tour, reset])

  const name = watch('name')
  useEffect(() => {
    if (tour) return
    if (dirtyFields.slug) return
    setValue('slug', slugify(name ?? ''), { shouldValidate: false, shouldDirty: false })
  }, [name, tour, dirtyFields.slug, setValue])

  const submitHandler = handleSubmit(async (values) => {
    await onSubmit({
      ...values,
      base_description: values.base_description?.trim() || '',
    })
  })

  return (
    <Modal show={show} onHide={onClose} size="lg" backdrop="static" centered>
      <Form onSubmit={submitHandler} noValidate>
        <Modal.Header closeButton>
          <Modal.Title>{tour ? 'Editar tour' : 'Nuevo tour'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={8}>
              <Form.Label>Nombre *</Form.Label>
              <Form.Control type="text" isInvalid={!!errors.name} {...register('name')} placeholder="Tumbes Manglares Premium" />
              <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
            </Col>
            <Col md={4}>
              <Form.Label>Orden</Form.Label>
              <Form.Control type="number" isInvalid={!!errors.display_order} {...register('display_order', { valueAsNumber: true })} />
              <Form.Control.Feedback type="invalid">{errors.display_order?.message}</Form.Control.Feedback>
            </Col>
            <Col md={12}>
              <Form.Label>Slug *</Form.Label>
              <Form.Control type="text" isInvalid={!!errors.slug} {...register('slug')} placeholder="tumbes-manglares-premium" />
              <Form.Text className="text-muted">Se autogenera al escribir el nombre; puedes ajustarlo.</Form.Text>
              <Form.Control.Feedback type="invalid">{errors.slug?.message}</Form.Control.Feedback>
            </Col>
            <Col md={12}>
              <Form.Label>Descripción base</Form.Label>
              <Form.Control as="textarea" rows={4} isInvalid={!!errors.base_description} {...register('base_description')} />
              <Form.Control.Feedback type="invalid">{errors.base_description?.message}</Form.Control.Feedback>
            </Col>
            <Col md={12}>
              <Form.Check type="switch" id="tour-form-active" label="Tour activo" {...register('active')} />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting && <Spinner as="span" size="sm" className="me-2" />}
            {tour ? 'Guardar cambios' : 'Crear tour'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}