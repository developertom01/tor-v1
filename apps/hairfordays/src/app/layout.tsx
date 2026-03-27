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
    default: 'Hair For Days | Premium Wigs & Hair Extensions in Ghana',
    template: '%s | Hair For Days',
  },
  description:
    'Shop premium quality wigs, hair extensions, and accessories in Ghana. Luxury hair that lasts for days. Fast delivery in Accra and nationwide.',
  keywords: [
    'wigs Ghana',
    'hair extensions Accra',
    'buy wigs online Ghana',
    'human hair wigs',
    'lace front wigs Ghana',
    'affordable wigs Accra',
    'hair accessories Ghana',
    'Hair For Days',
  ],
  openGraph: {
    title: 'Hair For Days | Premium Wigs & Hair Extensions',
    description: 'Shop premium quality wigs and hair extensions in Ghana. Luxury hair that lasts.',
    type: 'website',
    locale: 'en_GH',
    siteName: 'Hair For Days',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hair For Days | Premium Wigs & Hair Extensions',
    description: 'Shop premium quality wigs and hair extensions in Ghana.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased" suppressHydrationWarning>
        <StoreProvider config={storeConfig}>
          <CartProvider>
            <ToastProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </ToastProvider>
          </CartProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
