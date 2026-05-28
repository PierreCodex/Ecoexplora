import ctaImg from '@/assets/images/landing-cta.jpg'
import { Icon as IconifyIcon } from '@iconify/react'
import Link from 'next/link'
import { buildWaLink } from '../config'

const CTA = () => {
  return (
    <section>
      <div className="section-cta position-relative card-side-img overflow-hidden" style={{ backgroundImage: `url(${ctaImg.src})` }}>
        <div className="card-img-overlay d-flex align-items-center flex-column gap-3 justify-content-center auth-overlay text-center">
          <h3 className="text-white fs-24 mb-0 fw-bold">¿Listo para explorar Tumbes?</h3>
          <p className="text-white text-opacity-75 fs-md mb-0">
            Chatea con nuestro bot ahora y arma tu aventura en minutos. <br /> Sin descargas, sin esperas, disponible 24/7.
          </p>
          <Link
            href={buildWaLink('¡Hola! Estoy listo para reservar un tour.')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success rounded-pill d-inline-flex align-items-center gap-2 px-4 py-2">
            <IconifyIcon icon="tabler:brand-whatsapp" className="fs-xl" />
            Iniciar chat con el bot
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CTA