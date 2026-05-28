import bgPattern from '@/assets/images/bg-pattern.png'
import { Icon as IconifyIcon } from '@iconify/react'
import Image from 'next/image'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import { testimonials, type Testimonial } from '../data'

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <Card className="border border-dashed shadow-none rounded-4 p-3 card-h-100">
      <CardBody className="pb-0 text-center">
        <div className="avatar avatar-xl mx-auto mb-3">
          <Image src={testimonial.avatar} alt={testimonial.name} className="img-fluid rounded-circle" />
        </div>
        <span className="text-warning fs-lg mb-3 d-flex align-items-center justify-content-center gap-1">
          {Array.from({ length: 5 }).map((_, idx) => (
            <IconifyIcon key={idx} icon="tabler:star-filled" />
          ))}
        </span>
        <h4 className="mb-2 fs-md">{testimonial.title}</h4>
        <p className="text-muted mb-3 fst-italic fs-sm">&ldquo;{testimonial.description}&rdquo;</p>
        <p className="mb-0 fw-semibold">
          {testimonial.name} <span className="text-muted fw-normal">· {testimonial.country}</span>
        </p>
      </CardBody>
    </Card>
  )
}

const Testimonials = () => {
  return (
    <section className="section-custom position-relative overflow-hidden" id="resenas">
      <div className="position-absolute top-0 start-50 translate-middle-x mt-5 opacity-50">
        <Image src={bgPattern} alt="" />
      </div>

      <div className="container position-relative">
        <Row>
          <Col xs={12} className="text-center">
            <span className="text-muted rounded-3 d-inline-block">💬 Lo que dicen nuestros viajeros</span>
            <h2 className="mt-3 fw-bold mb-5">
              Reseñas <span className="text-success">verificadas</span>
            </h2>
          </Col>
        </Row>

        <Row className="justify-content-center">
          {testimonials.map((testimonial, idx) => (
            <Col lg={4} key={idx} className="mb-4">
              <TestimonialCard testimonial={testimonial} />
            </Col>
          ))}
        </Row>
      </div>
    </section>
  )
}

export default Testimonials