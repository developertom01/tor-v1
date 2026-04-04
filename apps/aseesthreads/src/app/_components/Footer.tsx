'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin } from 'lucide-react'
import { useStore } from '@tor/store/context'

export default function Footer() {
  const store = useStore()

  return (
    <footer className="bg-primary text-primary-muted border-t border-primary-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1 flex flex-col gap-4">
            {store.logo && (
              <Image src={store.logo} alt={store.name} width={72} height={72} className="h-16 w-auto" />
            )}
            <p className="text-sm text-primary-muted leading-relaxed">{store.tagline}</p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-semibold text-primary-foreground uppercase tracking-[0.15em] mb-4">Shop</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/products" className="text-sm text-primary-muted hover:text-gold-400 transition-colors">
                  All Products
                </Link>
              </li>
              {store.categories.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/products?category=${cat.slug}`} className="text-sm text-primary-muted hover:text-gold-400 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-xs font-semibold text-primary-foreground uppercase tracking-[0.15em] mb-4">Help</h4>
            <ul className="space-y-2.5">
              <li><Link href="/auth" className="text-sm text-primary-muted hover:text-gold-400 transition-colors">My Account</Link></li>
              <li><Link href="/orders" className="text-sm text-primary-muted hover:text-gold-400 transition-colors">My Orders</Link></li>
              <li><Link href="/cart" className="text-sm text-primary-muted hover:text-gold-400 transition-colors">Shopping Cart</Link></li>
              <li><Link href="/requests" className="text-sm text-primary-muted hover:text-gold-400 transition-colors">Custom Requests</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-primary-foreground uppercase tracking-[0.15em] mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm text-primary-muted">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <a href={`tel:${store.contact.phone.replace(/\s/g, '')}`} className="hover:text-gold-400 transition-colors">
                  {store.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-primary-muted">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <span>{store.contact.email}</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-primary-muted">
                <MapPin className="w-4 h-4 text-accent shrink-0" />
                <span>{store.contact.location}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-primary-muted">
          <span>&copy; {new Date().getFullYear()} {store.name}. All rights reserved.</span>
          <span className="gold-text font-medium tracking-wide">Kumasi, Ghana</span>
        </div>
      </div>
    </footer>
  )
}
