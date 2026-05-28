import logo from '@/assets/images/logo.png'
import Icon from '@/components/wrappers/Icon'
import { currentYear } from '@/config/constants'
import { Icon as IconifyIcon } from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'
import { Col, Container, Row } from 'react-bootstrap'
import { buildWaLink, ECOEXPLORA } from '../config'
import { navItems, socialLinks } from '../data'

const Footer = () => {
  return (
    <footer className="section-custom section-footer pb-2" id="contacto">
      <Container>
        <Row className="g-4 justify-content-between">
          <Col lg={4}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <Image src={logo} alt={ECOEXPLORA.brand} height={28} />
              <span className="fw-bold text-white fs-lg">{ECOEXPLORA.brand}</span>
            </div>
            <p className="mt-3 fs-sm">
              Tours de naturaleza, manglares, playas y selva en el norte del Perú. Reserva por WhatsApp con nuestro bot disponible 24/7.
            </p>
            <div className="d-flex gap-2 mt-4 mb-2">
              {socialLinks.map((link, idx) => (
                <Link
                  href={link.url}
                  className="btn btn-sm btn-icon rounded-circle btn-dark"
                  title={link.title}
                  key={idx}
                  target="_blank"
                  rel="noopener noreferrer">
                  <IconifyIcon icon={link.icon} className="fs-sm" />
                </Link>
              ))}
            </div>
          </Col>

          <Col lg={3} md={6}>
            <h5 className="text-white mb-4">Navegación</h5>
            <ul className="nav flex-column">
              {navItems.map((item, idx) => (
                <li className="nav-item" key={idx}>
                  <Link href={item.href} className={`nav-link ${idx === 0 && 'pt-0'}`}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="nav-item">
                <Link href="/auth/sign-in" className="nav-link">
                  Ingresar al panel
                </Link>
              </li>
            </ul>
          </Col>

          <Col lg={4} md={6}>
            <h5 className="text-white mb-4">Contacto</h5>
            <ul className="list-unstyled fs-sm">
              <li className="d-flex gap-2 mb-3">
                <Icon icon="phone-call" className="fs-5 mt-1 text-white-50" />
                <div>
                  <div className="text-white-50">WhatsApp / Teléfono</div>
                  <Link
                    href={buildWaLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white text-decoration-none fw-semibold">
                    {ECOEXPLORA.phoneDisplay}
                  </Link>
                </div>
              </li>
              <li className="d-flex gap-2 mb-3">
                <Icon icon="mail" className="fs-5 mt-1 text-white-50" />
                <div>
                  <div className="text-white-50">Email</div>
                  <a href={`mailto:${ECOEXPLORA.email}`} className="text-white text-decoration-none">
                    {ECOEXPLORA.email}
                  </a>
                </div>
              </li>
              <li className="d-flex gap-2">
                <Icon icon="map-pin" className="fs-5 mt-1 text-white-50" />
                <div>
                  <div className="text-white-50">Dirección</div>
                  <span className="text-white">{ECOEXPLORA.address}</span>
                </div>
              </li>
            </ul>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col xs={12} className="text-center">
            <p className="mb-4">© {currentYear} {ECOEXPLORA.brand}. Todos los derechos reservados.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer