import { Icon as IconifyIcon } from '@iconify/react'
import Link from 'next/link'
import { Card, CardBody, CardFooter, Col, Container, Row } from 'react-bootstrap'
import { serviceData, ServiceType } from './data'

const ServiceCard = ({ service }: { service: ServiceType }) => {
  const { description, icon, title } = service
  return (
    <Card className="border-0 shadow-none p-2 card-h-100">
      <CardBody className="pb-0">
        <div className="avatar-xl mx-auto mb-3">
          <span className="avatar-title bg-success-subtle text-success rounded-circle fs-22">
            <IconifyIcon icon={icon} />
          </span>
        </div>
        <h4 className="mb-2">{title}</h4>
        <p className="text-muted mb-3">{description}</p>
      </CardBody>
      <CardFooter className="border-0 pt-0">
        <Link 
          className="link-success fw-semibold" 
          href="https://wa.me/51964261277?text=Hola%20EcoExplora%2C%20quiero%20info%20sobre%20"
          target="_blank"
          rel="noopener noreferrer"
        >
          Consultar por WhatsApp
          <IconifyIcon icon="tabler:arrow-right" className="ms-2 align-middle" />
        </Link>
      </CardFooter>
    </Card>
  )
}

const Services = () => {
  return (
    <section className="section-custom pb-5" id="services">
      <Container>
        <Row>
          <Col xs={12} className="text-center">
            <span className="text-muted rounded-3 d-inline-block">🌿 Experiencias únicas en Tumbes</span>
            <h2 className="mt-3 fw-bold mb-5">
              Descubre nuestros <span className="text-success">tours de aventura</span>
            </h2>
          </Col>
        </Row>

        <Row className="text-center">
          {serviceData.map((service, idx) => (
            <Col key={idx} xl={4} md={6}>
              <ServiceCard service={service} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  )
}

export default Services
