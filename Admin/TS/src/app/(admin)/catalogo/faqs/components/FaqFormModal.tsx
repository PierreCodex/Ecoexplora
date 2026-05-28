'use client'

import RichTextEditor from '@/components/RichTextEditor'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { slugify, type FAQ } from '@/types/catalog'

export interface FaqFormValues {
  question: string
  answer: string
  slug: string
  topic: string
  priority: number
  active: boolean
  display_order: number
}

interface Props {
  show: boolean
  faq: FAQ | null
  onClose: () => void
  onSubmit: (values: FaqFormValues) => Promise<void>
}

const schema: yup.ObjectSchema<FaqFormValues> = yup.object({
  question: yup.string().required('La pregunta es obligatoria').max(500),
  answer: yup
    .string()
    .required('La respuesta es obligatoria')
    .test('not-empty-html', 'La respuesta no puede quedar vacía', (v) => !!v && v.replace(/<[^>]+>/g, '').trim().length > 0),
  slug: yup
    .string()
    .required('Slug obligatorio')
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Solo minúsculas, números y guiones'),
  topic: yup.string().default(''),
  priority: yup.number().typeError('Debe ser un número').integer().default(0).required(),
  active: yup.boolean().default(true).required(),
  display_order: yup.number().typeError('Debe ser un número').integer().min(0).default(0).required(),
})

const EMPTY: FaqFormValues = {
  question: '',
  answer: '',
  slug: '',
  topic: '',
  priority: 0,
  active: true,
  display_order: 0,
}

export default function FaqFormModal({ show, faq, onClose, onSubmit }: Props) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<FaqFormValues>({
    resolver: yupResolver(schema),
    defaultValues: EMPTY,
  })

  useEffect(() => {
    if (!show) return
    if (faq) {
      reset({
        question: faq.question,
        answer: faq.answer,
        slug: faq.slug,
        topic: faq.topic ?? '',
        priority: faq.priority ?? 0,
        active: faq.active,
        display_order: faq.display_order ?? 0,
      })
    } else {
      reset(EMPTY)
    }
  }, [show, faq, reset])

  const question = watch('question')
  useEffect(() => {
    if (faq || dirtyFields.slug) return
    setValue('slug', slugify(question ?? ''))
  }, [question, faq, dirtyFields.slug, setValue])

  const submit = handleSubmit(async (v) => onSubmit({ ...v, topic: v.topic?.trim() || '' }))

  return (
    <Modal show={show} onHide={onClose} size="xl" backdrop="static" centered>
      <Form onSubmit={submit} noValidate>
        <Modal.Header closeButton>
          <Modal.Title>{faq ? 'Editar FAQ' : 'Nueva FAQ'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={12}>
              <Form.Label>Pregunta *</Form.Label>
              <Form.Control as="textarea" rows={2} isInvalid={!!errors.question} {...register('question')} placeholder="¿Cuánto cuesta el tour a los manglares?" />
              <Form.Control.Feedback type="invalid">{errors.question?.message}</Form.Control.Feedback>
            </Col>
            <Col md={8}>
              <Form.Label>Slug *</Form.Label>
              <Form.Control type="text" isInvalid={!!errors.slug} {...register('slug')} />
              <Form.Control.Feedback type="invalid">{errors.slug?.message}</Form.Control.Feedback>
            </Col>
            <Col md={4}>
              <Form.Label>Tema</Form.Label>
              <Form.Control type="text" {...register('topic')} placeholder="precios" />
            </Col>
            <Col md={6}>
              <Form.Label>Prioridad</Form.Label>
              <Form.Control type="number" isInvalid={!!errors.priority} {...register('priority', { valueAsNumber: true })} />
            </Col>
            <Col md={6}>
              <Form.Label>Orden</Form.Label>
              <Form.Control type="number" isInvalid={!!errors.display_order} {...register('display_order', { valueAsNumber: true })} />
            </Col>
            <Col md={12}>
              <Form.Label>Respuesta *</Form.Label>
              <Controller
                name="answer"
                control={control}
                render={({ field }) => (
                  <RichTextEditor value={field.value} onChange={field.onChange} placeholder="Escribe la respuesta…" minHeight={220} />
                )}
              />
              {errors.answer && <div className="invalid-feedback d-block">{errors.answer.message}</div>}
            </Col>
            <Col md={12}>
              <Form.Check type="switch" id="faq-form-active" label="FAQ activa" {...register('active')} />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting && <Spinner as="span" size="sm" className="me-2" />}
            {faq ? 'Guardar cambios' : 'Crear FAQ'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}