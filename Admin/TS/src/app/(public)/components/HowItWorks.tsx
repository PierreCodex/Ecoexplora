import { Icon as IconifyIcon } from '@iconify/react'
import { Card, CardBody, Col, Container, Row } from 'react-bootstrap'
import { botSteps } from '../data'

const HowItWorks = () => {
  return (
    <section className="section-custom pt-5 pb-5 bg-body" id="como-funciona">
      <Container>
        <Row>
          <Col xs={12} className="text-center">
            <span className="text-muted rounded-3 d-inline-block">🤖 Reservar nunca fue tan fácil</span>
            <h2 className="mt-3 fw-bold mb-5">
              Cómo funciona <span className="text-success">el bot</span>
            </h2>
          </Col>
        </Row>

        <Row className="text-center g-4">
          {botSteps.map((step, idx) => (
            <Col key={idx} md={6} xl={3}>
              <Card className="border-0 shadow-none p-2 card-h-100 position-relative">
                <div className="position-absolute top-0 end-0 m-3 fs-22 fw-bold text-success opacity-25">0{idx + 1}</div>
                <CardBody className="pb-3">
                  <span className="eco-step-icon bg-success-subtle text-success mb-3">
                    <IconifyIcon icon={step.icon} />
                  </span>
                  <h4 className="mb-2 fs-md">{step.title}</h4>
                  <p className="text-muted mb-0 fs-sm">{step.description}</p>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  )
}

export default HowItWorks