import type { StoreConfig } from '@tor/store'

const config: StoreConfig = {
  name: 'Amal-shades',
  tagline: 'Premium eyewear and custom prescription lenses in Ghana. Frame your world with confidence.',
  domain: 'amalshades.store',
  logo: '/logo.png',
  theme: {
    brand: {
      50: '#FFF0F0', 100: '#FFD6D8', 200: '#FFB0B4', 300: '#FF7F85', 400: '#F54A52',
      500: '#E62030', 600: '#CC1020', 700: '#A80C1A', 800: '#850912', 900: '#5C060D',
    },
    gold: { 400: '#d4a843', 500: '#c4982f', 600: '#a67c2e' },
    heroGradient: 'linear-gradient(135deg, #5C060D 0%, #A80C1A 40%, #E62030 100%)',
  },
  categories: [
    { name: 'Sunglasses', slug: 'sunglasses', description: 'UV-protective tinted frames and shades', emoji: '🕶️' },
    { name: 'Prescription Frames', slug: 'prescription-frames', description: 'Optical frames for vision correction', emoji: '👓' },
    { name: 'Reading Glasses', slug: 'reading-glasses', description: 'Ready-made magnifying readers', emoji: '📖' },
    { name: 'Contact Lenses', slug: 'contact-lenses', description: 'Daily, monthly, and coloured contacts', emoji: '👁️' },
    { name: 'Accessories', slug: 'accessories', description: 'Cases, cleaning kits, straps, lens cloths', emoji: '🧴' },
  ],
  testimonials: [
    {
      name: 'Akosua M.',
      text: 'Finally found prescription frames that actually look stylish. The quality is unmatched and the service was incredible.',
      rating: 5,
    },
    {
      name: 'Kwame A.',
      text: 'Got my sunglasses within two days. The UV protection is real and they turn heads everywhere I go in Accra.',
      rating: 5,
    },
    {
      name: 'Efua T.',
      text: 'The coloured contacts are so natural-looking. Amal-shades is the only place I trust for my eye care needs.',
      rating: 5,
    },
  ],
  contact: {
    phone: '+233 55 218 4169',
    email: 'sarpong@gmail.com',
    location: 'Accra, Ghana',
  },
  hero: {
    title: 'Frame Your',
    highlight: 'World.',
    subtitle: 'Premium eyewear and custom prescription lenses. See clearly, look sharp — crafted for discerning tastes in Ghana.',
    cta: 'Shop Frames',
    stat: '1,000+',
    statLabel: 'Frames Sold',
  },
}

export default config
