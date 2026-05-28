'use client'

import RichTextEditor from '@/components/RichTextEditor'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { slugify, type Policy } from '@/types/catalog'

export interface PoliticaFormValues {
  title: string
  slug: string
  topic: string
  content: string
  priority: number
  active: boolean
  display_order: number
}

interface Props {
  show: boolean
  politica: Policy | null
  onClose: () => void
  onSubmit: (values: PoliticaFormValues) => Promise<void>
}

const schema: yup.ObjectSchema<PoliticaFormValues> = yup.object({
  title: yup.string().required('Título obligatorio').max(200),
  slug: yup
    .string()
    .required('Slug obligatorio')
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Solo minúsculas, números y guiones'),
  topic: yup.string().default(''),
  content: yup
    .string()
    .required('El contenido es obligatorio')
    .test('not-empty-html', 'El contenido no puede quedar vacío', (v) => !!v && v.replace(/<[^>]+>/g, '').trim().length > 0),
  priority: yup.number().typeError('Debe ser un número').integer().default(0).required(),
  active: yup.boolean().default(true).required(),
  display_order: yup.number().typeError('Debe ser un número').integer().min(0).default(0).required(),
})

const EMPTY: PoliticaFormValues = {
  title: '',
  slug: '',
  topic: '',
  content: '',
  priority: 0,
  active: true,
  display_order: 0,
}

export default function PoliticaFormModal({ show, politica, onClose, onSubmit }: Props) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<PoliticaFormValues>({
    resolver: yupResolver(schema),
    defaultValues: EMPTY,
  })

  useEffect(() => {
    if (!show) return
    if (politica) {
      reset({
        title: politica.title,
        slug: politica.slug,
        topic: politica.topic ?? '',
        content: politica.content,
        priority: politica.priority ?? 0,
        active: politica.active,
        display_order: politica.display_order ?? 0,
      })
    } else {
      reset(EMPTY)
    }
  }, [show, politica, reset])

  const title = watch('title')
  useEffect(() => {
    if (politica || dirtyFields.slug) return
    setValue('slug', slugify(title ?? ''))
  }, [title, politica, dirtyFields.slug, setValue])

  const submit = handleSubmit(async (v) =>
    onSubmit({
      ...v,
      topic: v.topic?.trim() || '',
    }),
  )

  return (
    <Modal show={show} onHide={onClose} size="xl" backdrop="static" centered>
      <Form onSubmit={submit} noValidate>
        <Modal.Header closeButton>
          <Modal.Title>{politica ? 'Editar política' : 'Nueva política'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={8}>
              <Form.Label>Título *</Form.Label>
              <Form.Control type="text" isInvalid={!!errors.title} {...register('title')} placeholder="Política de cancelación" />
              <Form.Control.Feedback type="invalid">{errors.title?.message}</Form.Control.Feedback>
            </Col>
            <Col md={4}>
              <Form.Label>Tema</Form.Label>
              <Form.Control type="text" {...register('topic')} placeholder="cancelacion" />
            </Col>
            <Col md={8}>
              <Form.Label>Slug *</Form.Label>
              <Form.Control type="text" isInvalid={!!errors.slug} {...register('slug')} />
              <Form.Control.Feedback type="invalid">{errors.slug?.message}</Form.Control.Feedback>
            </Col>
            <Col md={2}>
              <Form.Label>Prioridad</Form.Label>
              <Form.Control type="number" isInvalid={!!errors.priority} {...register('priority', { valueAsNumber: true })} />
              <Form.Control.Feedback type="invalid">{errors.priority?.message}</Form.Control.Feedback>
            </Col>
            <Col md={2}>
              <Form.Label>Orden</Form.Label>
              <Form.Control type="number" isInvalid={!!errors.display_order} {...register('display_order', { valueAsNumber: true })} />
              <Form.Control.Feedback type="invalid">{errors.display_order?.message}</Form.Control.Feedback>
            </Col>
            <Col md={12}>
              <Form.Label>Contenido *</Form.Label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <RichTextEditor value={field.value} onChange={field.onChange} placeholder="Escribe el contenido de la política…" minHeight={260} />
                )}
              />
              {errors.content && <div className="invalid-feedback d-block">{errors.content.message}</div>}
            </Col>
            <Col md={12}>
              <Form.Check type="switch" id="policy-form-active" label="Política activa" {...register('active')} />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting && <Spinner as="span" size="sm" className="me-2" />}
            {politica ? 'Guardar cambios' : 'Crear política'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}