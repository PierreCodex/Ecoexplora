import { Icon as IconifyIcon } from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'
import { Col, Container, Row } from 'react-bootstrap'

const Hero = () => {
  return (
    <section className="bg-light bg-opacity-50 border-top border-light position-relative overflow-hidden" id="home">
      {/* Background decoration */}
      <div className="position-absolute top-0 end-0 w-50 h-100 opacity-10">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#25D366" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.3C93.5,8.6,82.2,21.5,71.1,32.6C60,43.7,49.1,53,37.2,60.6C25.3,68.2,12.4,74.1,-0.9,75.6C-14.2,77.1,-28.4,74.2,-40.8,67.3C-53.2,60.4,-63.8,49.5,-72.3,36.8C-80.8,24.1,-87.2,9.6,-85.6,-4.1C-84,-17.8,-74.4,-30.7,-63.3,-40.8C-52.2,-50.9,-39.6,-58.2,-27.1,-66.5C-14.6,-74.8,-2.2,-84.1,11.2,-83.8C24.6,-83.5,49.2,-74.6,44.7,-76.4Z" transform="translate(100 100)" />
        </svg>
      </div>

      <Container className="pt-5 position-relative">
        <Row className="align-items-center">
          <Col lg={6} className="mb-5 mb-lg-0">
            <div className="d-inline-flex align-items-center gap-2 bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill mb-4">
              <span className="badge bg-success rounded-circle p-1">
                <IconifyIcon icon="tabler:check" width={10} />
              </span>
              <span className="fw-semibold fs-sm">Bot activo 24/7 en WhatsApp</span>
            </div>

            <h1 className="display-4 fw-bold lh-sm mb-4">
              Descubre Tumbes <br />
              <span className="text-success">sin complicaciones</span>
            </h1>

            <p className="mb-4 fs-lg text-muted lh-lg">
              Reserva tours de aventura directamente por WhatsApp. Manglares, avistamiento de ballenas, 
              surf y más experiencias únicas en el norte del Perú, gestionadas por nuestro asistente inteligente.
            </p>

            <div className="d-flex gap-3 flex-wrap">
              <Link 
                href="https://wa.me/51964261277?text=Hola%20EcoExplora" 
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success btn-lg py-3 px-4 fw-semibold d-flex align-items-center"
              >
                <IconifyIcon icon="tabler:brand-whatsapp" className="fs-xl me-2" />
                Chatear por WhatsApp
              </Link>
              <Link href="#demo" className="btn btn-outline-dark btn-lg py-3 px-4 fw-semibold">
                <IconifyIcon icon="tabler:play" className="fs-lg me-2" />
                Ver cómo funciona
              </Link>
            </div>

            <div className="d-flex gap-4 mt-5 pt-3">
              <div>
                <h4 className="fw-bold text-success mb-1">+6</h4>
                <p className="text-muted fs-sm mb-0">Tours disponibles</p>
              </div>
              <div className="border-start ps-4">
                <h4 className="fw-bold text-success mb-1">24/7</h4>
                <p className="text-muted fs-sm mb-0">Atención inmediata</p>
              </div>
              <div className="border-start ps-4">
                <h4 className="fw-bold text-success mb-1">100%</h4>
                <p className="text-muted fs-sm mb-0">Por WhatsApp</p>
              </div>
            </div>
          </Col>

          <Col lg={6} className="text-center">
            <div className="position-relative">
              {/* Main image - could be a nice landscape of Tumbes */}
              <div className="rounded-4 overflow-hidden shadow-lg">
                <Image 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop" 
                  alt="Paisaje de Tumbes"
                  width={600}
                  height={450}
                  className="img-fluid"
                />
              </div>
              
              {/* Floating badge */}
              <div className="position-absolute bottom-0 start-0 m-3 bg-white rounded-3 shadow-lg p-3">
                <div className="d-flex align-items-center gap-2">
                  <div className="bg-success rounded-circle p-2">
                    <IconifyIcon icon="tabler:brand-whatsapp" className="text-white" width={20} />
                  </div>
                  <div>
                    <div className="fw-semibold fs-sm">+51 964 261 277</div>
                    <div className="text-success fs-xs">En línea ahora</div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Hero
