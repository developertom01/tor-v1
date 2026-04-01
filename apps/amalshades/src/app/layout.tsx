import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from '@tor/ui/Navbar'
import Footer from '@tor/ui/Footer'
import { CartProvider } from '@tor/lib/cart-context'
import { ToastProvider } from '@tor/ui/Toast'
import { StoreProvider } from '@tor/store/context'
import storeConfig from '@/store.config'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Amal-shades | Premium Eyewear & Prescription Lenses in Ghana',
    template: '%s | Amal-shades',
  },
  description:
    'Shop premium sunglasses, prescription frames, reading glasses, and contact lenses in Ghana. Expert eyewear for every face — fast delivery across Accra and nationwide.',
  keywords: [
    'eyewear Ghana',
    'sunglasses Accra',
    'prescription glasses Ghana',
    'buy glasses online Ghana',
    'contact lenses Ghana',
    'optical frames Accra',
    'reading glasses Ghana',
    'Amal-shades',
    'eye care Ghana',
    'UV sunglasses Accra',
  ],
  openGraph: {
    title: 'Amal-shades | Premium Eyewear & Prescription Lenses',
    description: 'Shop premium sunglasses, prescription frames, and contact lenses in Ghana. Frame your world.',
    type: 'website',
    locale: 'en_GH',
    siteName: 'Amal-shades',
    url: 'https://amalshades.store',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amal-shades | Premium Eyewear & Prescription Lenses',
    description: 'Shop premium sunglasses, prescription frames, and contact lenses in Ghana.',
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://amalshades.store'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Store',
              name: 'Amal-shades',
              description: 'Premium eyewear and custom prescription lenses in Ghana.',
              url: 'https://amalshades.store',
              telephone: '+233552184169',
              email: 'sarpong@gmail.com',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Accra',
                addressCountry: 'GH',
              },
              currenciesAccepted: 'GHS',
              priceRange: '$$',
              openingHours: 'Mo-Sa 09:00-18:00',
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased" suppressHydrationWarning>
        <StoreProvider config={storeConfig}>
          <CartProvider>
            <ToastProvider>
              <Suspense><Navbar /></Suspense>
              <main className="flex-1">{children}</main>
              <Footer />
            </ToastProvider>
          </CartProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
