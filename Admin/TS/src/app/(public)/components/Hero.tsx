import { CountUp } from '@/components/wrappers/CountUp'
import { Icon as IconifyIcon } from '@iconify/react'
import Link from 'next/link'
import { Col, Container, Row } from 'react-bootstrap'
import { buildWaLink, ECOEXPLORA } from '../config'
import { heroStats } from '../data'
import WhatsAppMockup from './WhatsAppMockup'

const Hero = () => {
  return (
    <section 
      className="eco-hero position-relative overflow-hidden border-0 pb-5" 
      id="home"
      style={{
        backgroundImage: 'url(/images/TOUR/Full%20Manglares%202%20en%201.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
        {/* Overlay oscuro intenso */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'linear-gradient(135deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.75) 100%)',
          }}
        />

        <Container className="position-relative pt-5 pb-5">
          <Row className="align-items-start g-5">
            <Col lg={6}>
              <span className="badge bg-success bg-opacity-75 text-white rounded-pill px-3 py-2 mb-3 d-inline-flex align-items-center gap-1">
                <IconifyIcon icon="tabler:brand-whatsapp" /> Bot disponible 24/7 en WhatsApp
              </span>

              <h1 className="display-4 fw-bold lh-sm mb-3 text-white">
                Descubre Tumbes con un <span className="text-success">bot que reserva</span> tu tour por ti
              </h1>

              <p className="lead text-white text-opacity-75 mb-4">
                {ECOEXPLORA.brand} te lleva a los manglares, playas y selva tropical del norte del Perú. Conversa con nuestro bot por WhatsApp y arma tu aventura en minutos — sin llamadas, sin esperas.
              </p>

              <div className="d-flex gap-2 flex-wrap mb-4">
                <Link
                  href={buildWaLink('¡Hola! Quiero información sobre los tours disponibles.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success btn-lg fw-semibold d-inline-flex align-items-center gap-2">
                  <IconifyIcon icon="tabler:brand-whatsapp" className="fs-xl" />
                  Chatea con el bot
                </Link>
                <Link href="#tours" className="btn btn-outline-light btn-lg fw-semibold">
                  Ver tours
                </Link>
              </div>

              <div className="d-flex flex-wrap gap-4 mt-4">
                {heroStats.map((stat, idx) => (
                  <div key={idx} className="text-white">
                    <h3 className="mb-1 fw-bold">
                      <CountUp start={0} end={stat.value} decimals={Number.isInteger(stat.value) ? 0 : 1} duration={1.2} />
                      <span className="text-success">{stat.suffix}</span>
                    </h3>
                    <p className="text-white text-opacity-75 fs-sm mb-0">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Col>

            <Col lg={6} className="text-center d-flex justify-content-center">
              <div style={{ marginTop: '2rem' }}>
                <WhatsAppMockup />
              </div>
            </Col>
          </Row>
        </Container>
    </section>
  )
}

export default Hero
