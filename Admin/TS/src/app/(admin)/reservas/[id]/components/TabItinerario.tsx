'use client'
import Icon from '@/components/wrappers/Icon'
import type { ReservaDetail } from '@/types/reservation'
import { Alert, Card, CardBody, CardTitle } from 'react-bootstrap'

const TabItinerario = ({ reserva }: { reserva: ReservaDetail }) => {
  const steps = reserva.snapshot.itinerary

  if (!steps || steps.length === 0) {
    return (
      <Alert variant="info">El itinerario congelado del snapshot está vacío.</Alert>
    )
  }

  return (
    <Card>
      <CardBody>
        <CardTitle as="h5" className="mb-3">
          Itinerario congelado
        </CardTitle>
        <small className="text-muted d-block mb-4">
          Lo que el cliente confirmó al momento de reservar. No cambia aunque luego edites el catálogo.
        </small>

        <div className="timeline timeline-icon-bordered">
          {steps.map((step) => (
            <div key={step.order} className="timeline-item d-flex align-items-start">
              {step.time && <div className="timeline-time pe-3 text-muted">{step.time}</div>}
              <div className="timeline-dot">
                <Icon icon="map-pin" className="fs-xl text-primary" />
              </div>
              <div className="timeline-content ps-3 pb-4">
                <h6 className="mb-1">
                  <span className="text-muted me-2">#{step.order}</span>
                  {step.title}
                </h6>
                {step.description && (
                  <p className="mb-0 fs-13 text-muted" style={{ whiteSpace: 'pre-line' }}>
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}

export default TabItinerario