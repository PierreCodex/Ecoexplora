export const ECOEXPLORA = {
  brand: 'EcoExplora Tumbes',
  tagline: 'Tours de naturaleza en Tumbes con un bot que reserva por ti',
  whatsappNumber: '51964261277',
  email: 'hola@ecoexploratumbes.com',
  address: 'Tumbes, Perú',
  phoneDisplay: '+51 981 912 809',
}

export function buildWaLink(message?: string): string {
  const base = `https://wa.me/${ECOEXPLORA.whatsappNumber}`
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}