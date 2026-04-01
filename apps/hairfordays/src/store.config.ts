import type { StoreConfig } from '@tor/store'

const config: StoreConfig = {
  name: 'Hair For Days',
  tagline: 'Premium quality wigs and hair extensions in Ghana. Hair that lasts for days.',
  domain: 'hairfordays.store',
  logo: '/logo.png',
  theme: {
    brand: {
      50: '#f9f9f8', 100: '#f0eeeb', 200: '#dbd8d2', 300: '#b8b3ab', 400: '#8a8279',
      500: '#4a443c', 600: '#2c2820', 700: '#1e1a14', 800: '#141109', 900: '#0c0a06',
    },
    gold: { 400: '#d4a843', 500: '#c4982f', 600: '#a67c2e' },
    heroGradient: 'linear-gradient(135deg, #0c0a06 0%, #1e1a14 40%, #2c2820 100%)',
  },
  categories: [
    { name: 'Wigs', slug: 'wigs', description: 'Premium wigs', emoji: '✨' },
    { name: 'Hair Bundles', slug: 'hair-bundles', description: 'Hair bundles', emoji: '💇' },
    { name: 'Ponytails Extensions', slug: 'ponytails-extensions', description: 'Ponytails extensions', emoji: '✂️' },
  ],
  testimonials: [
    { name: 'Adwoa B.', text: "I've tried so many wig shops in Accra but Hair For Days is on a different level. The quality is unmatched and my wig stayed flawless for months!", rating: 5 },
    { name: 'Nana A.', text: "Ordered a lace front wig and it arrived the next day. The hairline is so natural — I've been getting compliments everywhere I go.", rating: 5 },
    { name: 'Maame O.', text: "They helped me pick the right shade and the wig looks absolutely stunning on me. Best hair purchase I've ever made in Ghana.", rating: 5 },
  ],
  contact: {
    phone: '+233 54 504 2647',
    email: 'hello@hairfordays.store',
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
