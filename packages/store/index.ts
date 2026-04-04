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

/**
 * Semantic color tokens — generic roles, not tied to any component.
 * Components decide which token to apply where.
 * In Tailwind: bg-background, text-foreground, bg-primary, text-primary-foreground, etc.
 */
export interface StoreColors {
  // Light layer — default page and surface backgrounds
  background: string       // Main page background
  backgroundAlt: string    // Alternate/muted bg — cards, subtle sections
  foreground: string       // Primary text on light bg
  foregroundMuted: string  // Secondary / caption text on light bg
  border: string           // Default border on light bg

  // Primary brand layer — the main brand color used for emphasis
  // (dark navbars, hero sections, footers, dark bands — whatever the store uses it for)
  primary: string
  primaryForeground: string // Primary text on primary bg
  primaryMuted: string      // Secondary text on primary bg
  primaryBorder: string     // Borders / dividers on primary bg

  // Accent — CTAs, badges, active indicators, highlights
  accent: string
  accentForeground: string
}

export interface StoreTheme {
  brand: {
    50: string; 100: string; 200: string; 300: string; 400: string
    500: string; 600: string; 700: string; 800: string; 900: string
  }
  gold: { 400: string; 500: string; 600: string }
  heroGradient: string
  colors: StoreColors
}

export interface StoreConfig {
  name: string
  tagline: string
  domain: string
  logo?: string
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
