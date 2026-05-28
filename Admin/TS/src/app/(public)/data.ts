import user1 from '@/assets/images/users/user-1.jpg'
import user2 from '@/assets/images/users/user-2.jpg'
import user3 from '@/assets/images/users/user-3.jpg'
import { StaticImageData } from 'next/image'

export const navItems = [
  { label: 'Inicio', href: '#home' },
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Tours', href: '#tours' },
  { label: 'Reseñas', href: '#resenas' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contacto', href: '#contacto' },
]

export type BotStep = {
  icon: string
  title: string
  description: string
}

export const botSteps: BotStep[] = [
  {
    icon: 'tabler:brand-whatsapp',
    title: 'Abre WhatsApp',
    description: 'Escanea el QR o toca el botón de chat. Empiezas la conversación al instante, sin descargas ni registros.',
  },
  {
    icon: 'tabler:messages',
    title: 'Pregunta por un tour',
    description: 'Escribe lo que buscas: manglares, playas, fauna o aventura. El bot entiende lenguaje natural en español e inglés.',
  },
  {
    icon: 'tabler:list-check',
    title: 'Recibe opciones',
    description: 'El bot te muestra tours disponibles, fechas, precios y qué incluye. Resuelve dudas al momento, 24/7.',
  },
  {
    icon: 'tabler:credit-card',
    title: 'Reserva y paga',
    description: 'Confirmas pax y fecha, recibes el link de pago seguro y tu voucher digital. Listo para vivir Tumbes.',
  },
]

export type StatItem = {
  value: number
  suffix: string
  label: string
}

export const heroStats: StatItem[] = [
  { value: 8, suffix: '+', label: 'Años operando en Tumbes' },
  { value: 12, suffix: 'k', label: 'Pasajeros atendidos' },
  { value: 24, suffix: '/7', label: 'Atención del bot' },
]

export const aboutStats: StatItem[] = [
  { value: 4.9, suffix: '/5', label: 'Calificación promedio' },
  { value: 35, suffix: '+', label: 'Países atendidos' },
]

export type TourCard = {
  name: string
  shortName: string
  duration: string
  price: number
  currency: string
  description: string
  features: string[]
  btnClass: string
  isPopular?: boolean
}

export const featuredTours: TourCard[] = [
  {
    name: 'Full Manglares de Tumbes',
    shortName: 'Manglares',
    duration: 'Día completo',
    price: 120,
    currency: 'S/',
    description: 'Recorrido completo por los manglares con guía especializado, avistamiento de fauna y kayak.',
    btnClass: 'btn-outline-success',
    isPopular: false,
    features: [
      'Guía especializado',
      'Kayak incluido',
      'Almuerzo típico',
      'Avistamiento de fauna',
    ],
  },
  {
    name: 'Avistamiento de Ballenas',
    shortName: 'Ballenas',
    duration: '4 horas',
    price: 180,
    currency: 'S/',
    description: 'Salida en lancha para avistar ballenas jorobadas en su hábitat natural. Temporada julio-octubre.',
    btnClass: 'btn-light',
    isPopular: true,
    features: [
      'Lancha privada',
      'Guía bilingüe',
      'Fotografía asistida',
      'Chalecos y equipo',
      'Temporada julio-oct',
    ],
  },
  {
    name: 'Surf en Zorritos',
    shortName: 'Surf',
    duration: '3 horas',
    price: 90,
    currency: 'S/',
    description: 'Clases de surf para todos los niveles en las playas de Zorritos. Equipo incluido.',
    btnClass: 'btn-outline-success',
    isPopular: false,
    features: [
      'Instructor certificado',
      'Tabla y equipo',
      'Todos los niveles',
      'Fotos de la sesión',
    ],
  },
]

export type Testimonial = {
  avatar: StaticImageData
  name: string
  country: string
  title: string
  description: string
}

export const testimonials: Testimonial[] = [
  {
    avatar: user1,
    name: 'María González',
    country: 'México',
    title: 'Reservé en 3 minutos',
    description: 'El bot me respondió a las 11 de la noche y armó el itinerario completo para mi familia. Increíble la experiencia en los manglares.',
  },
  {
    avatar: user2,
    name: 'James Carter',
    country: 'Estados Unidos',
    title: 'Sustainable and well organized',
    description: 'The bot answered in English without a hitch. The mangrove tour exceeded my expectations — guides knew every bird species.',
  },
  {
    avatar: user3,
    name: 'Lucía Pérez',
    country: 'Argentina',
    title: 'Recomendado 100%',
    description: 'No tenía claro qué tour elegir y el bot me ayudó a comparar opciones. Pagué con tarjeta y recibí mi voucher al instante.',
  },
]

export type ChatMessage = {
  from: 'user' | 'bot'
  text?: string
  buttons?: { title: string; icon?: string }[]
  list?: { title: string; description: string }[]
  listTitle?: string
  time: string
}

export type ChatScene = {
  messages: ChatMessage[]
  showTyping?: boolean
}

export const chatScenes: ChatScene[] = [
  // Escena 1: Bienvenida
  {
    messages: [
      { from: 'bot', text: '¡Hola! 👋\nSoy el asistente de *EcoExplora Tumbes*.', time: '10:42' },
      { from: 'bot', text: '¿Querés ver qué tours tenemos disponibles? 🌿', time: '10:42', buttons: [{ title: 'Ver tours' }] },
    ],
    showTyping: false,
  },
  // Escena 2: Catálogo de tours
  {
    messages: [
      { from: 'user', text: 'Ver tours', time: '10:43' },
      { from: 'bot', text: '📍 Estos son nuestros tours:', time: '10:43', list: [
        { title: '🥾 Manglares', description: 'S/ 120 · Día completo' },
        { title: '🐢 Ballenas', description: 'S/ 180 · 4 horas' },
        { title: '🌊 Surf', description: 'S/ 90 · 3 horas' },
      ]},
    ],
    showTyping: false,
  },
  // Escena 3: Detalle del tour
  {
    messages: [
      { from: 'user', text: '🥾 Manglares', time: '10:44' },
      { from: 'bot', text: '🌿 *Full Manglares*\n📅 Día completo\n💰 S/ 120 por persona', time: '10:44', buttons: [
        { title: 'Reservar' },
      ]},
    ],
    showTyping: false,
  },
  // Escena 4: Selección de pasajeros
  {
    messages: [
      { from: 'user', text: 'Reservar', time: '10:45' },
      { from: 'bot', text: '¿Para cuántas personas? 👥', time: '10:45', list: [
        { title: '1 persona', description: 'S/ 120' },
        { title: '2 personas', description: 'S/ 240' },
        { title: '3 personas', description: 'S/ 360' },
      ]},
    ],
    showTyping: false,
  },
  // Escena 5: Selección de fecha
  {
    messages: [
      { from: 'user', text: '2 personas', time: '10:46' },
      { from: 'bot', text: '¿Qué día te gustaría ir? 📅', time: '10:46', list: [
        { title: 'Sáb 31 may', description: '✅ Disponible' },
        { title: 'Dom 1 jun', description: '✅ Disponible' },
        { title: 'Lun 2 jun', description: '⚠️ 3 cupos' },
      ]},
    ],
    showTyping: false,
  },
  // Escena 6: Confirmación
  {
    messages: [
      { from: 'user', text: 'Sáb 31 may', time: '10:47' },
      { from: 'bot', text: '📅 *Sábado 31 de mayo*\n\n¿Confirmamos esta fecha?', time: '10:47', buttons: [
        { title: '✓ Confirmar' },
      ]},
    ],
    showTyping: false,
  },
  // Escena 7: Éxito
  {
    messages: [
      { from: 'user', text: 'Confirmar', time: '10:48' },
      { from: 'bot', text: '¡Reserva confirmada! ✅\n\nTe enviaremos los detalles del tour y el voucher por email. 🎉', time: '10:48' },
    ],
    showTyping: false,
  },
]

export type FaqItem = {
  question: string
  answer: string
}

export const faqItems: FaqItem[] = [
  {
    question: '¿El bot cobra por responder?',
    answer: 'No. Chatear con el bot es completamente gratis. Solo pagas cuando decides reservar un tour.',
  },
  {
    question: '¿Cómo se paga la reserva?',
    answer: 'El bot te envía un link de pago seguro con tarjeta, Yape o transferencia. Una vez confirmado, recibes tu voucher digital al instante.',
  },
  {
    question: '¿Atiende 24/7?',
    answer: 'Sí. El bot responde a cualquier hora, todos los días. Si necesitas atención humana, un guía toma el control del chat en horario de oficina.',
  },
  {
    question: '¿Habla inglés u otros idiomas?',
    answer: 'Sí. El bot conversa en español e inglés, ideal para turistas internacionales que visitan Tumbes.',
  },
  {
    question: '¿Necesito reservar con anticipación?',
    answer: 'Recomendamos al menos 24 horas para asegurar cupo, especialmente en temporada alta. Para reservas same-day el bot confirma disponibilidad en tiempo real.',
  },
  {
    question: '¿Qué pasa si necesito cancelar?',
    answer: 'Puedes cancelar hasta 24 horas antes del tour sin penalidad. El bot procesa el reembolso o reprograma la fecha por ti.',
  },
]

export type SocialLink = {
  title: string
  icon: string
  url: string
}

export const socialLinks: SocialLink[] = [
  { title: 'Facebook', icon: 'lucide:facebook', url: '#' },
  { title: 'Instagram', icon: 'lucide:instagram', url: '#' },
  { title: 'TikTok', icon: 'tabler:brand-tiktok', url: '#' },
  { title: 'WhatsApp', icon: 'tabler:brand-whatsapp', url: '#' },
]