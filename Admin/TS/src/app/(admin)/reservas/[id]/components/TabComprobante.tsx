'use client'
import { confirmAction, notifyError, notifyOk } from '@/lib/confirm'
import { ApiError, api } from '@/lib/api'
import Icon from '@/components/wrappers/Icon'
import type { ReservaDetail } from '@/types/reservation'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { Alert, Badge, Button, Card, CardBody, CardTitle, Spinner } from 'react-bootstrap'

interface Props {
  reserva: ReservaDetail
  onChanged: () => void | Promise<void>
}

const STATUS_VARIANT = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
} as const

const STATUS_LABEL = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
} as const

const TabComprobante = ({ reserva, onChanged }: Props) => {
  const [signedUrl, setSignedUrl] = useState<string | null>(reserva.receipt?.signed_url ?? null)
  const [loadingUrl, setLoadingUrl] = useState(false)
  const [urlError, setUrlError] = useState<string | null>(null)

  useEffect(() => {
    if (!reserva.receipt || signedUrl) return
    let active = true
    setLoadingUrl(true)
    api
      .get<{ signed_url: string }>(`/admin/receipts/${reserva.receipt.id}/signed-url`)
      .then((res) => {
        if (active) setSignedUrl(res.signed_url)
      })
      .catch((err) => {
        if (active) {
          const msg = err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error'
          setUrlError(msg)
        }
      })
      .finally(() => {
        if (active) setLoadingUrl(false)
      })
    return () => {
      active = false
    }
  }, [reserva.receipt, signedUrl])

  if (!reserva.receipt) {
    return (
      <Alert variant="info" className="d-flex align-items-center gap-2">
        <Icon icon="info" />
        Esta reserva todavía no tiene comprobante cargado.
      </Alert>
    )
  }

  const r = reserva.receipt
  const variant = STATUS_VARIANT[r.status]

  const onAct = async (action: 'approve' | 'reject') => {
    const isReject = action === 'reject'
    const { confirmed, reason } = await confirmAction({
      title: isReject ? 'Rechazar comprobante' : 'Aprobar comprobante',
      text: `Reserva ${reserva.code}`,
      variant: isReject ? 'danger' : 'success',
      requireReason: isReject,
      confirmText: isReject ? 'Rechazar' : 'Aprobar',
    })
    if (!confirmed) return
    try {
      const endpoint = isReject ? `/admin/reservations/${reserva.id}/reject` : `/admin/reservations/${reserva.id}/confirm`
      await api.post(endpoint, reason ? { reason } : undefined)
      await notifyOk(isReject ? 'Comprobante rechazado' : 'Comprobante aprobado')
      await onChanged()
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Error'
      await notifyError(msg)
    }
  }

  return (
    <Card>
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div>
            <CardTitle as="h5" className="mb-1">
              Comprobante de pago
            </CardTitle>
            <small className="text-muted">Cargado el {dayjs(r.uploaded_at).format('DD/MM/YYYY HH:mm')}</small>
          </div>
          <Badge bg={`${variant}-subtle`} text={variant} className="fs-12 px-2 py-1 text-uppercase">
            {STATUS_LABEL[r.status]}
          </Badge>
        </div>

        {urlError && <Alert variant="danger">{urlError}</Alert>}

        <div className="bg-light rounded p-3 d-flex align-items-center justify-content-center mb-3" style={{ minHeight: 360 }}>
          {loadingUrl && <Spinner animation="border" variant="primary" />}
          {!loadingUrl && signedUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={signedUrl}
              alt="Comprobante de pago"
              style={{ maxHeight: 480, maxWidth: '100%', objectFit: 'contain' }}
            />
          )}
          {!loadingUrl && !signedUrl && !urlError && (
            <span className="text-muted">No se pudo cargar la imagen.</span>
          )}
        </div>

        {r.notes && (
          <Alert variant="secondary" className="fs-13">
            <strong className="me-1">Notas:</strong>
            {r.notes}
          </Alert>
        )}

        {r.status === 'pending' && (
          <div className="d-flex gap-2">
            <Button variant="success" onClick={() => onAct('approve')}>
              <Icon icon="circle-check" className="me-2" />
              Aprobar pago
            </Button>
            <Button variant="outline-danger" onClick={() => onAct('reject')}>
              <Icon icon="circle-x" className="me-2" />
              Rechazar pago
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export default TabComprobante