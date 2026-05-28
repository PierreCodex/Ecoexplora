import PhoneMockup from './PhoneMockup'
import { Col, Container, Row } from 'react-bootstrap'

const BotDemo = () => {
  return (
    <section className="section-custom bg-white border-top border-light" id="demo">
      <Container>
        <Row className="align-items-center">
          <Col lg={5} className="mb-5 mb-lg-0">
            <span className="badge bg-success bg-opacity-10 text-success mb-3">🤖 Bot Inteligente</span>
            <h2 className="fw-bold mb-4">
              Reserva tu tour de aventura <span className="text-success">por WhatsApp</span>
            </h2>
            <p className="lead text-muted mb-4">
              Nuestro asistente virtual te guía paso a paso para descubrir y reservar las mejores experiencias en Tumbes. 
              Sin descargar apps, sin llamadas, sin complicaciones.
            </p>
            <ul className="list-unstyled mb-4">
              <li className="d-flex align-items-center gap-2 mb-3">
                <span className="badge bg-success rounded-circle p-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span>Responde 24/7, incluso fuera de horario</span>
              </li>
              <li className="d-flex align-items-center gap-2 mb-3">
                <span className="badge bg-success rounded-circle p-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span>Catálogo interactivo con botones y listas</span>
              </li>
              <li className="d-flex align-items-center gap-2 mb-3">
                <span className="badge bg-success rounded-circle p-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span>Reserva completa sin intervención humana</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <span className="badge bg-success rounded-circle p-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span>Pago con Yape integrado</span>
              </li>
            </ul>
            <a 
              href="https://wa.me/51964261277?text=Hola%20EcoExplora" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-success btn-lg"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Probar el bot ahora
            </a>
          </Col>
          <Col lg={7} className="text-center">
            <PhoneMockup />
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default BotDemo
