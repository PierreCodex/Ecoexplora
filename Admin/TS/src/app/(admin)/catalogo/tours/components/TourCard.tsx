'use client'

import Icon from '@/components/wrappers/Icon'
import type { Tour } from '@/types/catalog'
import Link from 'next/link'
import { Badge, Card, CardBody, Dropdown, Form } from 'react-bootstrap'

interface Props {
  tour: Tour
  onEdit: () => void
  onDelete: () => void
  onToggleActive: () => void
}

export default function TourCard({ tour, onEdit, onDelete, onToggleActive }: Props) {
  const description = tour.base_description ?? ''
  const truncated = description.length > 120 ? `${description.slice(0, 120)}…` : description

  return (
    <Card className="h-100">
      <div
        className="position-relative bg-light"
        style={{
          height: 160,
          backgroundImage: tour.image_url ? `url(${tour.image_url})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {!tour.image_url && (
          <div className="d-flex h-100 align-items-center justify-content-center text-muted">
            <Icon icon="photo" className="fs-1" />
          </div>
        )}
        <div className="position-absolute top-0 end-0 m-2">
          <Dropdown align="end">
            <Dropdown.Toggle as="button" className="btn btn-light btn-icon btn-sm shadow-sm border-0 after-none" id={`tour-menu-${tour.id}`}>
              <Icon icon="dots-vertical" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={onEdit}>
                <Icon icon="edit" className="me-2" /> Editar
              </Dropdown.Item>
              <Dropdown.Item as={Link} href={`/catalogo/tours/${tour.id}/variantes`}>
                <Icon icon="list-details" className="me-2" /> Ver variantes
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={onDelete} className="text-danger">
                <Icon icon="trash" className="me-2" /> Eliminar
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        {!tour.active && (
          <Badge bg="secondary" className="position-absolute top-0 start-0 m-2">
            Inactivo
          </Badge>
        )}
      </div>

      <CardBody>
        <h5 className="mb-1">
          <Link href={`/catalogo/tours/${tour.id}/variantes`} className="link-reset">
            {tour.name}
          </Link>
        </h5>
        <p className="text-muted fs-xs mb-2">/{tour.slug}</p>
        <p className="text-muted mb-3" style={{ minHeight: 48 }}>
          {truncated || <span className="fst-italic">Sin descripción</span>}
        </p>

        <div className="d-flex align-items-center justify-content-between border-top pt-2">
          <div className="d-flex align-items-center gap-2">
            <Icon icon="layers" className="text-muted" />
            <span className="text-muted fs-sm">{tour.variants_count ?? 0} variantes</span>
          </div>
          <Form.Check
            type="switch"
            id={`tour-active-${tour.id}`}
            checked={tour.active}
            onChange={onToggleActive}
            label={tour.active ? 'Activo' : 'Inactivo'}
          />
        </div>
      </CardBody>
    </Card>
  )
}