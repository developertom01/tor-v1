'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, ShoppingCart, MessageSquareText, Users, Settings } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/requests', label: 'Requests', icon: MessageSquareText },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile */}
      <nav className="flex items-center gap-1 sm:hidden">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 text-center text-xs font-medium py-2 rounded-lg transition-colors flex flex-col items-center gap-0.5 ${
                active ? 'text-brand-600 bg-brand-50' : 'text-gray-600 hover:text-brand-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Desktop */}
      <nav className="hidden sm:flex items-center gap-3 -mb-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium flex items-center gap-1.5 px-2 py-1.5 border-b-2 transition-colors ${
                active
                  ? 'text-brand-600 border-brand-600'
                  : 'text-gray-600 border-transparent hover:text-brand-600 hover:bg-gray-50 rounded-lg'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
