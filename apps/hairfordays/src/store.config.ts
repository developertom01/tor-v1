import type { StoreConfig } from '@tor/store'

const config: StoreConfig = {
  name: 'Hair For Days',
  tagline: 'Premium quality wigs and hair extensions in Ghana. Hair that lasts for days.',
  domain: 'hairfordays.com',
  theme: {
    brand: {
      50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4', 400: '#2dd4bf',
      500: '#14b8a6', 600: '#0d9488', 700: '#0f766e', 800: '#115e59', 900: '#134e4a',
    },
    gold: { 400: '#d4a843', 500: '#c4982f', 600: '#a67c2e' },
    heroGradient: 'linear-gradient(135deg, #134e4a 0%, #0f766e 40%, #14b8a6 100%)',
  },
  categories: [
    { name: 'Wigs', slug: 'wigs', description: 'Premium wigs', emoji: '✨' },
    { name: 'Extensions', slug: 'extensions', description: 'Hair extensions', emoji: '✂️' },
    { name: 'Accessories', slug: 'accessories', description: 'Hair accessories', emoji: '💎' },
    { name: 'Others', slug: 'others', description: 'Other products', emoji: '📦' },
  ],
  testimonials: [],
  contact: {
    phone: '+233 54 220 3839',
    email: 'hello@hairfordays.com',
    location: 'Accra, Ghana',
  },
  hero: {
    title: 'Your Hair,',
    highlight: 'Your Crown',
    subtitle: 'Premium quality wigs and hair extensions. Luxury hair that lasts for days.',
    cta: 'Shop Now',
    stat: '500+',
    statLabel: 'Happy Customers',
  },
}

export default config
