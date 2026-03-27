export interface StoreCategory {
  name: string
  slug: string
  description: string
  emoji: string
}

export interface StoreTestimonial {
  name: string
  text: string
  rating: number
}

export interface StoreContact {
  phone: string
  email: string
  location: string
}

export interface StoreTheme {
  brand: {
    50: string; 100: string; 200: string; 300: string; 400: string
    500: string; 600: string; 700: string; 800: string; 900: string
  }
  gold: { 400: string; 500: string; 600: string }
  heroGradient: string
}

export interface StoreConfig {
  name: string
  tagline: string
  domain: string
  theme: StoreTheme
  categories: StoreCategory[]
  testimonials: StoreTestimonial[]
  contact: StoreContact
  hero: {
    title: string
    highlight: string
    subtitle: string
    cta: string
    stat: string
    statLabel: string
  }
}

export type { StoreConfig as default }
