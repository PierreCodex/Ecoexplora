import type { Metadata } from 'next'
import BotDemo from './components/BotDemo'
import Contact from './components/Contact'
import CTA from './components/CTA'
import Features from './components/Features'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import PricingPlans from './components/PricingPlans'
import Services from './components/Services'
import Testimonials from './components/Testimonials'

export const metadata: Metadata = { title: 'EcoExplora Tumbes - Reserva tu aventura por WhatsApp' }

const Landing = () => {
  return (
    <div className="bg-body-secondary">
      <Header />
      <Hero />
      <BotDemo />
      <Services />
      <Features />
      <PricingPlans />
      <CTA />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  )
}

export default Landing
