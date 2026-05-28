'use client'

import { Accordion, Col, Container, Row } from 'react-bootstrap'
import { faqItems } from '../data'

const Faq = () => {
  return (
    <section className="section-custom bg-light bg-opacity-30 border-top eco-faq" id="faq">
      <Container>
        <Row>
          <Col xs={12} className="text-center">
            <span className="text-muted rounded-3 d-inline-block">❓ Preguntas frecuentes</span>
            <h2 className="mt-3 fw-bold mb-5">
              Todo lo que necesitas saber del <span className="text-success">bot</span>
            </h2>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col lg={8}>
            <Accordion defaultActiveKey="0" flush>
              {faqItems.map((item, idx) => (
                <Accordion.Item eventKey={String(idx)} key={idx} className="mb-2 border rounded-3 px-2">
                  <Accordion.Header>
                    <span className="fw-semibold">{item.question}</span>
                  </Accordion.Header>
                  <Accordion.Body className="text-muted">{item.answer}</Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Faq