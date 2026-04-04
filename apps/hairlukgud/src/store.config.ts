import type { StoreConfig } from '@tor/store'

const config: StoreConfig = {
  name: 'Hair Luk Gud GH',
  tagline: 'Premium quality wigs and hair extensions in Ghana. Look your best, feel confident.',
  domain: 'hairlookgoodgh.com',
  logo: '/logo.JPG',
  theme: {
    brand: {
      50: '#fdf2f8', 100: '#fce7f3', 200: '#fbcfe8', 300: '#f9a8d4', 400: '#f472b6',
      500: '#ec4899', 600: '#db2777', 700: '#be185d', 800: '#9d174d', 900: '#831843',
    },
    gold: { 400: '#d4a843', 500: '#c4982f', 600: '#a67c2e' },
    heroGradient: 'linear-gradient(135deg, #831843 0%, #be185d 40%, #ec4899 100%)',
    colors: {
      background: '#ffffff',
      backgroundAlt: '#fdf2f8',    // brand-50
      foreground: '#831843',       // brand-900
      foregroundMuted: '#be185d',  // brand-700
      border: '#fbcfe8',           // brand-200
      primary: '#831843',          // brand-900 — hero, footer, dark sections; nav uses background
      primaryForeground: '#fce7f3', // brand-100
      primaryMuted: '#f9a8d4',     // brand-300
      primaryBorder: '#9d174d',    // brand-800
      accent: '#c4982f',           // gold-500
      accentForeground: '#ffffff',
    },
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
    email: 'hello@hairlookgoodgh.com',
    location: 'Accra, Ghana',
  },
  hero: {
    title: 'Your Hair,',
    highlight: 'Your Crown',
    subtitle: 'Premium quality wigs and hair extensions. Affordable luxury that makes you look and feel amazing.',
    cta: 'Shop Now',
    stat: '500+',
    statLabel: 'Happy Customers',
  },
}

export default config
