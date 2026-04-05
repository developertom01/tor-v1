import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { ImageKitProvider } from '@imagekit/next'
import './globals.css'
import Navbar from '@/app/_components/Navbar'
import Footer from '@/app/_components/Footer'
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
    default: "Asee's Threads | Athleisure & Casual Fashion in Ghana",
    template: "%s | Asee's Threads",
  },
  description:
    "Shop stylish athleisure and casual fashion from Kumasi, Ghana. Wide-leg joggers, fitted basics, seamless bodysuits and spandex co-ord sets for the fashion-forward. Clean, minimal, confident.",
  keywords: [
    'athleisure Ghana',
    'joggers Kumasi',
    'seamless bodysuits Ghana',
    'spandex sets Ghana',
    'casual fashion Ghana',
    "Asee's Threads",
    'wide-leg joggers Ghana',
    'fashion Kumasi',
    'fitted basics Ghana',
    'co-ord sets Ghana',
  ],
  openGraph: {
    title: "Asee's Threads | Athleisure & Casual Fashion",
    description: 'Clean, minimal, confident athleisure and casual fashion from Kumasi, Ghana.',
    type: 'website',
    locale: 'en_GH',
    siteName: "Asee's Threads",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Asee's Threads | Athleisure & Casual Fashion",
    description: 'Stylish athleisure and casual fashion from Kumasi, Ghana.',
  },
  robots: {
    index: true,
    follow: true,
  },
  ...(storeConfig.seo?.googleSiteVerification && {
    verification: { google: storeConfig.seo.googleSiteVerification },
  }),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased" suppressHydrationWarning>
        <ImageKitProvider urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL ?? ''}>
          <StoreProvider config={storeConfig}>
            <CartProvider>
              <ToastProvider>
                <Suspense><Navbar /></Suspense>
                <main className="flex-1">{children}</main>
                <Footer />
              </ToastProvider>
            </CartProvider>
          </StoreProvider>
        </ImageKitProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ClothingStore',
              name: "Asee's Threads",
              description:
                'Stylish athleisure and casual fashion brand from Kumasi, Ghana — wide-leg joggers, fitted basics, seamless bodysuits and spandex sets.',
              url: process.env.NEXT_PUBLIC_SITE_URL,
              telephone: '+233591885951',
              email: 'mohayideenaseefa83@gmail.com',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Kumasi',
                addressCountry: 'GH',
              },
              priceRange: '$$',
            }),
          }}
        />
      </body>
    </html>
  )
}
