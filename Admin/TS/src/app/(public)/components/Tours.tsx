import Icon from '@/components/wrappers/Icon'
import { Icon as IconifyIcon } from '@iconify/react'
import Link from 'next/link'
import { Card, CardBody, CardFooter, Col, Container, Row } from 'react-bootstrap'
import { buildWaLink } from '../config'
import { featuredTours, type TourCard } from '../data'

const TourCardItem = ({ tour }: { tour: TourCard }) => {
  const message = `¡Hola! Me interesa el "${tour.name}". ¿Me puedes dar más información?`
  return (
    <Card className={`h-100 my-4 my-lg-0 ${tour.isPopular ? 'text-bg-success' : 'border bg-light bg-opacity-40 border-dashed shadow-none'}`}>
      <CardBody className="p-lg-4 pb-0 text-center">
        {tour.isPopular && (
          <span className="badge bg-white text-success fw-bold rounded-pill px-3 py-1 mb-2">
            Más reservado
          </span>
        )}
        <h3 className="fw-bold mb-1">{tour.name}</h3>
        <p className={`mb-0 ${tour.isPopular ? 'text-white-50' : 'text-muted'}`}>{tour.description}</p>

        <div className="my-4">
          <h1 className="display-6 fw-bold mb-0">
            {tour.currency} {tour.price}
          </h1>
          <small className={`d-block fs-base ${tour.isPopular ? 'text-white-50' : 'text-muted'}`}>por persona</small>
          <small className={`d-block ${tour.isPopular ? 'text-white-50' : 'text-muted'}`}>{tour.duration}</small>
        </div>

        <ul className="list-unstyled text-start fs-sm mb-0">
          {tour.features.map((feature, idx) => (
            <li key={idx} className="mb-2 d-flex align-items-start gap-2">
              <Icon icon="check" className={`fs-5 mt-1 ${tour.isPopular ? 'text-white' : 'text-success'}`} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardBody>

      <CardFooter className="bg-transparent border-0 px-5 pb-4">
        <Link
          href={buildWaLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn w-100 py-2 fw-semibold rounded-pill d-inline-flex align-items-center justify-content-center gap-2 ${tour.btnClass}`}>
          <IconifyIcon icon="tabler:brand-whatsapp" />
          Reservar por WhatsApp
        </Link>
      </CardFooter>
    </Card>
  )
}

const Tours = () => {
  return (
    <section className="section-custom" id="tours">
      <Container>
        <Row>
          <Col xs={12} className="text-center">
            <span className="text-muted rounded-3 d-inline-block">🗺️ Experiencias seleccionadas</span>
            <h2 className="mt-3 fw-bold mb-5">
              Tours <span className="text-success">destacados</span>
            </h2>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col xxl={11}>
            <Row>
              {featuredTours.map((tour, idx) => (
                <Col lg={4} key={idx} className={`${tour.isPopular ? 'my-4 my-lg-0' : ''}`}>
                  <TourCardItem tour={tour} />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col xs={12} className="text-center">
            <p className="text-muted mb-0">
              ¿Buscas algo distinto? El bot puede armarte un tour a medida — escríbele y cuéntale qué te interesa.
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Tours