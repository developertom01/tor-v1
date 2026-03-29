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

export default function AdminNav({ pendingOrders }: { pendingOrders: number }) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile */}
      <nav className="flex items-center gap-1 sm:hidden">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          const showBadge = href === '/admin/orders' && pendingOrders > 0
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 text-center text-xs font-medium py-2 rounded-lg transition-colors flex flex-col items-center gap-0.5 relative ${
                active ? 'text-brand-600 bg-brand-50' : 'text-gray-600 hover:text-brand-600 hover:bg-gray-50'
              }`}
            >
              <span className="relative">
                <Icon className="w-4 h-4" />
                {showBadge && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-bold min-w-[14px] h-3.5 px-0.5 rounded-full flex items-center justify-center">
                    {pendingOrders > 99 ? '99+' : pendingOrders}
                  </span>
                )}
              </span>
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Desktop */}
      <nav className="hidden sm:flex items-center gap-3 -mb-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          const showBadge = href === '/admin/orders' && pendingOrders > 0
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
              {showBadge && (
                <span className="bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-4 px-1 rounded-full flex items-center justify-center">
                  {pendingOrders > 99 ? '99+' : pendingOrders}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
