import type { StoreConfig } from '@tor/store'

const config: StoreConfig = {
  name: "Asee's Threads",
  tagline: 'Stylish athleisure and casual fashion from Kumasi, Ghana. Wide-leg joggers, fitted basics, seamless bodysuits and spandex sets.',
  domain: 'aseesthreads.store',
  logo: '/logo.svg',
  seo: {
    googleSiteVerification: 'cse2R0SgLhS-roSYeP2JU-ahxol-5k-NCtnKqnRkLTU',
  },
  theme: {
    brand: {
      50: '#fdf9f5', 100: '#f5ece0', 200: '#e8d4b8', 300: '#d4b48a', 400: '#bc9060',
      500: '#a67245', 600: '#8a5c35', 700: '#6e4828', 800: '#56381e', 900: '#3d2815',
    },
    gold: { 400: '#d4a843', 500: '#c4982f', 600: '#a67c2e' },
    heroGradient: 'linear-gradient(135deg, #3d2815 0%, #6e4828 50%, #a67245 100%)',
    colors: {
      background: '#ffffff',
      backgroundAlt: '#fdf9f5',    // brand-50 — cards, subtle sections
      foreground: '#3d2815',       // brand-900
      foregroundMuted: '#8a5c35',  // brand-600
      border: '#e8d4b8',           // brand-200
      primary: '#3d2815',          // brand-900 — nav, hero, footer, dark sections
      primaryForeground: '#e8d4b8', // brand-200
      primaryMuted: '#a67245',     // brand-500
      primaryBorder: '#56381e',    // brand-800
      accent: '#c4982f',           // gold-500
      accentForeground: '#fdf9f5',
    },
  },
  categories: [
    { name: 'Joggers', slug: 'joggers', description: 'Unisex wide-leg joggers for every mood', emoji: '👖' },
    { name: 'Basic Tops', slug: 'basic-tops', description: 'Fitted crop tops and everyday basics', emoji: '👕' },
    { name: 'Seamless Bodysuits', slug: 'seamless-bodysuits', description: 'Form-fitting seamless bodysuits', emoji: '🖤' },
    { name: 'Spandex 2 Piece', slug: 'spandex-2-piece', description: 'Matching spandex co-ord sets', emoji: '✨' },
  ],
  testimonials: [
    { name: 'Efua M.', text: "The wide-leg joggers are everything. So comfortable and the fit is perfect. I wear them everywhere in Kumasi.", rating: 5 },
    { name: 'Abena T.', text: "Got the spandex 2-piece set and I absolutely love it. The quality is top-tier and it fits like a glove.", rating: 5 },
    { name: 'Yaa K.', text: "Fast delivery and the bodysuit is so flattering. Asee's Threads is my go-to for fashion in Ghana now.", rating: 5 },
  ],
  contact: {
    phone: '+233 59 188 5951',
    email: 'mohayideenaseefa83@gmail.com',
    location: 'Accra, Ghana',
  },
  hero: {
    title: 'Wear Your',
    highlight: 'Story',
    subtitle: "Clean, minimal, confident. Athleisure and casual fashion crafted for the fashion-forward in Ghana.",
    cta: 'Shop the Collection',
    stat: '200+',
    statLabel: 'Happy Customers',
  },
}

export default config
