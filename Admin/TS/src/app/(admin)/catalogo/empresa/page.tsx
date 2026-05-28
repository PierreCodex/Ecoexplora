'use client'

import PageBreadcrumb from '@/components/PageBreadcrumb'
import RichTextEditor from '@/components/RichTextEditor'
import Icon from '@/components/wrappers/Icon'
import { ApiError, api } from '@/lib/api'
import { notifyError, notifyOk } from '@/lib/confirm'
import { resyncRag } from '@/lib/rag'
import type { Company, CompanyOffice } from '@/types/catalog'
import { yupResolver } from '@hookform/resolvers/yup'
import { useCallback, useEffect, useState } from 'react'
import { Alert, Button, Card, CardBody, CardHeader, Col, Form, Row, Spinner } from 'react-bootstrap'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import * as yup from 'yup'

interface FormValues {
  name: string
  short_description: string
  long_description: string
  phone: string
  email: string
  website: string
  offices: CompanyOffice[]
}

const officeSchema: yup.ObjectSchema<CompanyOffice> = yup.object({
  name: yup.string().default(''),
  address: yup.string().default(''),
  phone: yup.string().default(''),
  email: yup.string().default(''),
  schedule: yup.string().default(''),
})

const schema: yup.ObjectSchema<FormValues> = yup.object({
  name: yup.string().required('Nombre obligatorio').max(200),
  short_description: yup.string().default(''),
  long_description: yup.string().default(''),
  phone: yup.string().default(''),
  email: yup
    .string()
    .default('')
    .test('email', 'Email inválido', (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)),
  website: yup
    .string()
    .default('')
    .test('url', 'Debe ser una URL válida', (v) => !v || /^https?:\/\/.+/i.test(v)),
  offices: yup.array().of(officeSchema).default([]),
})

const EMPTY: FormValues = {
  name: '',
  short_description: '',
  long_description: '',
  phone: '',
  email: '',
  website: '',
  offices: [],
}

const Page = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: EMPTY,
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'offices' })

  const load = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true)
      setError(null)
      const res = await api.get<Company>('/admin/catalog/company', { signal })
      if (signal?.aborted) return
      reset({
        name: res.name ?? '',
        short_description: res.short_description ?? '',
        long_description: res.long_description ?? '',
        phone: res.phone ?? '',
        email: res.email ?? '',
        website: res.website ?? '',
        offices: res.offices ?? [],
      })
    } catch (err) {
      if (signal?.aborted) return
      setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error al cargar empresa')
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [reset])

  useEffect(() => {
    const c = new AbortController()
    void load(c.signal)
    return () => c.abort()
  }, [load])

  const submit = handleSubmit(async (v) => {
    try {
      const payload = {
        ...v,
        short_description: v.short_description?.trim() || null,
        long_description: v.long_description || null,
        phone: v.phone?.trim() || null,
        email: v.email?.trim() || null,
        website: v.website?.trim() || null,
        offices: (v.offices ?? []).filter((o) => o.name || o.address || o.phone || o.email),
      }
      await api.put('/admin/catalog/company', payload)
      void resyncRag('company')
      await notifyOk('Información de empresa actualizada')
      await load()
    } catch (err) {
      await notifyError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error al guardar')
    }
  })

  if (loading) {
    return (
      <>
        <PageBreadcrumb title="Información de empresa" subtitle="Catálogo" />
        <Card>
          <CardBody className="py-5 text-center">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-3 mb-0">Cargando…</p>
          </CardBody>
        </Card>
      </>
    )
  }

  return (
    <>
      <PageBreadcrumb title="Información de empresa" subtitle="Catálogo" />

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={submit} noValidate>
        <Card className="mb-3">
          <CardHeader className="border-light">
            <h5 className="m-0">Datos generales</h5>
          </CardHeader>
          <CardBody>
            <Row className="g-3">
              <Col md={8}>
                <Form.Label>Nombre *</Form.Label>
                <Form.Control type="text" isInvalid={!!errors.name} {...register('name')} />
                <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
              </Col>
              <Col md={4}>
                <Form.Label>Teléfono</Form.Label>
                <Form.Control type="text" {...register('phone')} placeholder="+51 999 999 999" />
              </Col>
              <Col md={6}>
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" isInvalid={!!errors.email} {...register('email')} placeholder="contacto@ecoexploratumbes.com" />
                <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
              </Col>
              <Col md={6}>
                <Form.Label>Sitio web</Form.Label>
                <Form.Control type="url" isInvalid={!!errors.website} {...register('website')} placeholder="https://ecoexploratumbes.com" />
                <Form.Control.Feedback type="invalid">{errors.website?.message}</Form.Control.Feedback>
              </Col>
              <Col md={12}>
                <Form.Label>Descripción corta</Form.Label>
                <Form.Control as="textarea" rows={2} {...register('short_description')} placeholder="Operador turístico especializado en ecoturismo en Tumbes." />
              </Col>
              <Col md={12}>
                <Form.Label>Descripción larga</Form.Label>
                <Controller
                  name="long_description"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor value={field.value ?? ''} onChange={field.onChange} placeholder="Quiénes somos, qué hacemos, historia, valores…" minHeight={220} />
                  )}
                />
              </Col>
            </Row>
          </CardBody>
        </Card>

        <Card className="mb-3">
          <CardHeader className="border-light d-flex align-items-center justify-content-between">
            <h5 className="m-0">Oficinas</h5>
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() => append({ name: '', address: '', phone: '', email: '', schedule: '' })}>
              <Icon icon="plus" className="me-1" /> Agregar oficina
            </Button>
          </CardHeader>
          <CardBody>
            {fields.length === 0 ? (
              <p className="text-muted mb-0 text-center fst-italic">Aún no hay oficinas registradas.</p>
            ) : (
              fields.map((field, idx) => (
                <div key={field.id} className="border rounded p-3 mb-3">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <strong>Oficina #{idx + 1}</strong>
                    <Button size="sm" variant="outline-danger" onClick={() => remove(idx)}>
                      <Icon icon="trash" />
                    </Button>
                  </div>
                  <Row className="g-2">
                    <Col md={6}>
                      <Form.Label className="fs-sm">Nombre</Form.Label>
                      <Form.Control type="text" {...register(`offices.${idx}.name`)} placeholder="Oficina principal" />
                    </Col>
                    <Col md={6}>
                      <Form.Label className="fs-sm">Dirección</Form.Label>
                      <Form.Control type="text" {...register(`offices.${idx}.address`)} placeholder="Av. Tumbes 123, Tumbes" />
                    </Col>
                    <Col md={4}>
                      <Form.Label className="fs-sm">Teléfono</Form.Label>
                      <Form.Control type="text" {...register(`offices.${idx}.phone`)} />
                    </Col>
                    <Col md={4}>
                      <Form.Label className="fs-sm">Email</Form.Label>
                      <Form.Control type="email" {...register(`offices.${idx}.email`)} />
                    </Col>
                    <Col md={4}>
                      <Form.Label className="fs-sm">Horario</Form.Label>
                      <Form.Control type="text" {...register(`offices.${idx}.schedule`)} placeholder="Lun-Vie 8am-6pm" />
                    </Col>
                  </Row>
                </div>
              ))
            )}
          </CardBody>
        </Card>

        <div className="d-flex justify-content-end gap-2">
          <Button variant="light" onClick={() => load()} disabled={isSubmitting}>
            Descartar cambios
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting || !isDirty}>
            {isSubmitting && <Spinner as="span" size="sm" className="me-2" />}
            Guardar
          </Button>
        </div>
      </Form>
    </>
  )
}

export default Page