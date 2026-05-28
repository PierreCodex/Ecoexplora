import { StaticImageData } from 'next/image'

import user1 from '@/assets/images/users/user-1.jpg'
import user2 from '@/assets/images/users/user-2.jpg'
import user3 from '@/assets/images/users/user-3.jpg'
import user4 from '@/assets/images/users/user-4.jpg'
import user5 from '@/assets/images/users/user-5.jpg'

export type ServiceType = {
  icon: string
  title: string
  description: string
}

export const serviceData: ServiceType[] = [
  {
    icon: 'tabler:trees',
    title: 'Full Manglares',
    description: 'Recorrido completo por los manglares de Tumbes con guía especializado. Incluye avistamiento de fauna, kayak y almuerzo típico.',
  },
  {
    icon: 'tabler:fish',
    title: 'Avistamiento de Ballenas',
    description: 'Salida en lancha para avistar ballenas jorobadas en su hábitat natural. Temporada de julio a octubre.',
  },
  {
    icon: 'tabler:wave-sine',
    title: 'Surf en Zorritos',
    description: 'Clases de surf para todos los niveles en las playas de Zorritos. Equipo incluido y instructor certificado.',
  },
  {
    icon: 'tabler:binoculars',
    title: 'Birdwatching',
    description: 'Observación de aves en los humedales de Tumbes. Más de 200 especies registradas, ideal para fotógrafos.',
  },
  {
    icon: 'tabler:trekking',
    title: 'Cerros de Amotape',
    description: 'Trekking por el bosque seco ecuatorial en el Parque Nacional. Rutas de dificultad variable.',
  },
  {
    icon: 'tabler:sunset',
    title: 'Tumbes de Ensueño',
    description: 'Tour de medio día por los atractivos icónicos de Tumbes: playas, manglares y gastronomía local.',
  },
]

export type StateType = {
  value: number
  suffix: string
  label: string
}

export const stats1: StateType[] = [
  { value: 6, suffix: '+', label: 'Tours disponibles' },
  { value: 24, suffix: '/7', label: 'Atención continua' },
  { value: 100, suffix: '%', label: 'Por WhatsApp' },
]
export const stats2: StateType[] = [
  { value: 5, suffix: ' min', label: 'Tiempo promedio de reserva' },
  { value: 98, suffix: '%', label: 'Satisfacción del cliente' },
]

export type PricingPlanType = {
  name: string
  price: number
  description: string
  title: string
  features: {
    title: string
    included: boolean
  }[]
  btnClass: string
  isPopular?: boolean
}

export const pricingData: PricingPlanType[] = [
  {
    name: 'Starter Plan',
    price: 9,
    description: 'Best for freelancers and personal use',
    title: '1 project included',
    btnClass: 'btn-outline-primary',
    isPopular: false,
    features: [
      { title: '1 active project', included: true },
      { title: 'Access to all components', included: true },
      { title: 'Email support', included: true },
      { title: 'No team collaboration', included: false },
      { title: 'No SaaS rights', included: false },
    ],
  },
  {
    name: 'Professional',
    price: 29,
    description: 'Ideal for small teams and startups',
    title: 'Up to 5 projects',
    btnClass: 'btn-light',
    isPopular: true,
    features: [
      { title: '5 active projects', included: true },
      { title: 'Component + plugin access', included: true },
      { title: 'Team collaboration', included: true },
      { title: 'Priority email support', included: true },
      { title: 'No resale rights', included: false },
    ],
  },
  {
    name: 'Business',
    price: 79,
    description: 'For agencies and large teams',
    title: 'Unlimited projects',
    btnClass: 'btn-dark',
    isPopular: false,
    features: [
      { title: 'Unlimited projects', included: true },
      { title: 'SaaS & client projects allowed', included: true },
      { title: 'All premium components', included: true },
      { title: 'Priority support', included: true },
      { title: 'Team management tools', included: true },
    ],
  },
]

export type TestimonialType = {
  avatar: StaticImageData
  name: string
  title: string
  description: string
}

export const testimonials: TestimonialType[] = [
  {
    avatar: user1,
    name: 'Michael Roberts',
    title: 'Fantastic experience!',
    description: `"The admin dashboard is intuitive, fast, and packed with useful features. Highly recommend it!"`,
  },
  {
    avatar: user2,
    name: 'Sarah Mitchell',
    title: 'Excellent quality & support',
    description: `"The template’s quality is top-notch and the support team is quick to help. A truly seamless experience!"`,
  },
  {
    avatar: user3,
    name: 'David Anderson',
    title: 'Outstanding experience',
    description: `"Everything from setup to customization was smooth and easy. The support team went above and beyond!"`,
  },
  {
    avatar: user4,
    name: 'James Whitman',
    title: 'Highly impressed',
    description: 'The performance and features are unmatched in this price range. Highly impressed!',
  },
  {
    avatar: user5,
    name: 'Aisha Khan',
    title: 'Smooth experience from start to finish',
    description: 'The website, shipping, and support all worked flawlessly. Very satisfied!',
  },
]

export type footerLinksType = {
  title: string
  links: {
    name: string
    url: string
    badge?: {
      title: string
      variant: string
    }
  }[]
}

export const footerLinks: footerLinksType[] = [
  {
    title: 'Company',
    links: [
      { name: 'Our Story', url: '' },
      { name: 'Leadership Team', url: '' },
      {
        name: 'Careers',
        url: '',
        badge: { title: "We're Hiring", variant: 'warning' },
      },
      { name: 'Press & Media', url: '' },
      { name: 'Investor Relations', url: '' },
      { name: 'Sustainability', url: '' },
    ],
  },
  {
    title: 'Community',
    links: [
      { name: 'Community Forum', url: '' },
      { name: 'Events & Meetups', url: '' },
      { name: 'Ambassadors', url: '' },
      { name: 'Customer Stories', url: '' },
      { name: 'Open Source', url: '' },
      { name: 'Code of Conduct', url: '' },
    ],
  },
  {
    title: 'Admin',
    links: [
      { name: 'Dashboard', url: '' },
      { name: 'User Management', url: '' },
      { name: 'Roles & Permissions', url: '' },
      { name: 'System Logs', url: '' },
      { name: 'Settings', url: '' },
      { name: 'API Access', url: '' },
    ],
  },
]

export type socialLinksType = {
  title: string
  icon: string
  url: string
}

export const socialLinks: socialLinksType[] = [
  { title: 'Facebook', icon: 'lucide:facebook', url: '' },
  { title: 'Twitter-x', icon: 'tabler:brand-x', url: '' },
  { title: 'Instagram', icon: 'lucide:instagram', url: '' },
  { title: 'Dribbble', icon: 'lucide:dribbble', url: '' },
]
