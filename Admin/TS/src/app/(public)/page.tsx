import type { Metadata } from 'next'
import About from './components/About'
import CTA from './components/CTA'
import Faq from './components/Faq'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Testimonials from './components/Testimonials'
import Tours from './components/Tours'
import { ECOEXPLORA } from './config'

export const metadata: Metadata = {
  title: `${ECOEXPLORA.brand} — Tours en Tumbes con bot de WhatsApp`,
  description: 'Reserva tours de naturaleza en Tumbes (manglares, playas, fauna) por WhatsApp. Bot disponible 24/7 en español e inglés.',
}

const PublicLanding = () => {
  return (
    <div className="bg-body-secondary">
      <Header />
      <Hero />
      <HowItWorks />
      <About />
      <Tours />
      <CTA />
      <Testimonials />
      <Faq />
      <Footer />
    </div>
  )
}

export default PublicLanding