'use client'

import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'
import { useStore } from '@tor/store/context'

export default function Footer() {
  const store = useStore()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold text-white">{store.name}</h3>
            <p className="mt-3 text-sm text-gray-400">{store.tagline}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-sm hover:text-brand-400 transition-colors">All Products</Link></li>
              {store.categories.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/products?category=${cat.slug}`} className="text-sm hover:text-brand-400 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Help</h4>
            <ul className="space-y-2">
              <li><Link href="/auth" className="text-sm hover:text-brand-400 transition-colors">My Account</Link></li>
              <li><Link href="/cart" className="text-sm hover:text-brand-400 transition-colors">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-brand-400" />
                <a href={`tel:${store.contact.phone.replace(/\s/g, '')}`} className="hover:text-brand-400 transition-colors">{store.contact.phone}</a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-brand-400" />
                <span>{store.contact.email}</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-brand-400" />
                <span>{store.contact.location}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} {store.name}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
