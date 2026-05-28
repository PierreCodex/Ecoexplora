import { CountUp } from '@/components/wrappers/CountUp'
import { Icon as IconifyIcon } from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'
import { Col, Container, Row } from 'react-bootstrap'
import { buildWaLink, ECOEXPLORA } from '../config'
import { aboutStats } from '../data'

const About = () => {
  return (
    <section className="section-custom bg-light bg-opacity-30 border-top border-light border-bottom" id="sobre-nosotros">
      <Container>
        <Row>
          <Col xs={12} className="text-center">
            <span className="text-muted rounded-3 d-inline-block">🌿 Turismo responsable en el norte del Perú</span>
            <h2 className="mt-3 fw-bold mb-5">
              Sobre <span className="text-success">{ECOEXPLORA.brand}</span>
            </h2>
          </Col>
        </Row>

        <Row className="align-items-center pb-5">
          <Col lg={6} xl={5} className="py-3">
            <div className="text-center">
              <Image
                src="/images/sobreecoexplora.jpg"
                className="rounded-3 img-fluid"
                width={530}
                height={530}
                alt="Naturaleza Tumbes"
              />
            </div>
          </Col>
          <Col lg={5} className="ms-auto py-3">
            <h3 className="mb-3 fs-xl lh-base">Naturaleza, cultura y aventura en una sola región</h3>
            <p className="mb-2 lead">
              Operamos desde Tumbes hace varios años, conectando viajeros con manglares vivos, playas vírgenes y la única selva tropical seca del Perú.
            </p>
            <p className="text-muted fs-sm mb-4">
              Trabajamos con guías locales certificados y comunidades nativas. Cada reserva apoya conservación y empleo justo en la región.
            </p>
            <ul className="list-unstyled mb-4">
              <li className="d-flex gap-2 mb-2">
                <IconifyIcon icon="tabler:circle-check" className="text-success fs-5 mt-1" />
                <span>Guías locales certificados y bilingües</span>
              </li>
              <li className="d-flex gap-2 mb-2">
                <IconifyIcon icon="tabler:circle-check" className="text-success fs-5 mt-1" />
                <span>Pagos seguros con tarjeta, Yape o transferencia</span>
              </li>
              <li className="d-flex gap-2">
                <IconifyIcon icon="tabler:circle-check" className="text-success fs-5 mt-1" />
                <span>Voucher digital y soporte humano cuando lo necesites</span>
              </li>
            </ul>
            <Link
              href={buildWaLink('Quiero conocer más sobre EcoExplora Tumbes')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success mb-4 d-inline-flex align-items-center gap-2">
              <IconifyIcon icon="tabler:brand-whatsapp" />
              Conversa con nosotros
            </Link>
            <div className="d-flex flex-wrap gap-4 mt-4">
              {aboutStats.map((state, idx) => (
                <div key={idx}>
                  <h3 className="mb-2">
                    <CountUp start={0} end={state.value} decimals={Number.isInteger(state.value) ? 0 : 1} duration={1.2} />
                    <span className="text-success">{state.suffix}</span>
                  </h3>
                  <p className="text-muted mb-0">{state.label}</p>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default About