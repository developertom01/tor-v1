'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Menu, X, User, ClipboardList, MessageSquareText, LayoutDashboard } from 'lucide-react'
import { useCart } from '@tor/lib/cart-context'
import { useState, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { isAdmin } from '@tor/lib/actions/auth'
import { createClient } from '@tor/lib/supabase/client'
import { useStore } from '@tor/store/context'

export default function Navbar() {
  const { totalItems } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [admin, setAdmin] = useState(false)
  const store = useStore()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function isNavActive(href: string) {
    const [hrefPath, hrefQuery] = href.split('?')
    if (pathname !== hrefPath) return false
    if (!hrefQuery) return !searchParams.get('category')
    const params = new URLSearchParams(hrefQuery)
    return searchParams.get('category') === params.get('category')
  }

  useEffect(() => {
    isAdmin().then(setAdmin).catch(() => {})

    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      isAdmin().then(setAdmin).catch(() => setAdmin(false))
    })
    return () => subscription.unsubscribe()
  }, [])

  // Prevent body scroll when mobile panel is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-28">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              {store.logo ? (
                <Image
                  src={store.logo}
                  alt={store.name}
                  width={240}
                  height={88}
                  className="h-24 w-auto object-contain drop-shadow-md"
                  style={{ maxWidth: 260 }}
                />
              ) : (
                <span className="text-2xl font-bold bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent">
                  {store.name}
                </span>
              )}
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-10">
              <Link href="/products" className={`text-base font-semibold transition-colors ${isNavActive('/products') ? 'text-brand-600' : 'text-gray-600 hover:text-brand-600'}`}>
                Shop
              </Link>
              {store.categories.map((cat) => (
                <Link key={cat.slug} href={`/products?category=${cat.slug}`} className={`text-base font-semibold transition-colors ${isNavActive(`/products?category=${cat.slug}`) ? 'text-brand-600' : 'text-gray-600 hover:text-brand-600'}`}>
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* Right side — desktop: icons with labels, mobile: hamburger only */}
            <div className="flex items-center gap-1 sm:gap-3">
              <Link href="/requests" className={`hidden md:flex flex-col items-center transition-colors px-2 py-1 ${pathname.startsWith('/requests') ? 'text-brand-600' : 'text-gray-500 hover:text-brand-600'}`}>
                <MessageSquareText className="w-5 h-5" />
                <span className="text-[10px] font-medium mt-0.5">Requests</span>
              </Link>
              <Link href="/orders" className={`hidden md:flex flex-col items-center transition-colors px-2 py-1 ${pathname.startsWith('/orders') ? 'text-brand-600' : 'text-gray-500 hover:text-brand-600'}`}>
                <ClipboardList className="w-5 h-5" />
                <span className="text-[10px] font-medium mt-0.5">Orders</span>
              </Link>
              <Link href="/auth" className={`hidden md:flex flex-col items-center transition-colors px-2 py-1 ${pathname.startsWith('/auth') ? 'text-brand-600' : 'text-gray-500 hover:text-brand-600'}`}>
                <User className="w-5 h-5" />
                <span className="text-[10px] font-medium mt-0.5">Account</span>
              </Link>
              {admin && (
                <Link href="/admin" className={`hidden md:flex flex-col items-center transition-colors px-2 py-1 ${pathname.startsWith('/admin') ? 'text-brand-600' : 'text-gray-500 hover:text-brand-600'}`}>
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="text-[10px] font-medium mt-0.5">Admin</span>
                </Link>
              )}
              <Link href="/cart" className="hidden md:flex relative flex-col items-center text-gray-500 hover:text-brand-600 transition-colors px-2 py-1">
                <ShoppingBag className="w-5 h-5" />
                <span className="text-[10px] font-medium mt-0.5">Cart</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1 right-0 bg-brand-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile: cart badge + hamburger */}
              <Link href="/cart" className="relative md:hidden text-gray-600 hover:text-brand-600 transition-colors p-1">
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden text-gray-600 p-1"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Side Panel */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />

          {/* Panel */}
          <div className="absolute top-0 right-0 h-full w-72 bg-white shadow-xl animate-slide-in flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <span className="font-semibold text-gray-900">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto py-4">
              <div className="px-5 mb-3">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Shop</p>
                <div className="space-y-1">
                  <Link href="/products" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-gray-700 hover:text-brand-600 hover:bg-brand-50 font-medium py-2.5 px-3 rounded-lg transition-colors">
                    Shop All
                  </Link>
                  {store.categories.map((cat) => (
                    <Link key={cat.slug} href={`/products?category=${cat.slug}`} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-gray-700 hover:text-brand-600 hover:bg-brand-50 font-medium py-2.5 px-3 rounded-lg transition-colors">
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 mx-5 my-2" />

              <div className="px-5">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">My Account</p>
                <div className="space-y-1">
                  <Link href="/requests" onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 font-medium py-2.5 px-3 rounded-lg transition-colors ${pathname.startsWith('/requests') ? 'text-brand-600 bg-brand-50' : 'text-gray-700 hover:text-brand-600 hover:bg-brand-50'}`}>
                    <MessageSquareText className="w-4 h-4" />
                    My Requests
                  </Link>
                  <Link href="/orders" onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 font-medium py-2.5 px-3 rounded-lg transition-colors ${pathname.startsWith('/orders') ? 'text-brand-600 bg-brand-50' : 'text-gray-700 hover:text-brand-600 hover:bg-brand-50'}`}>
                    <ClipboardList className="w-4 h-4" />
                    My Orders
                  </Link>
                  <Link href="/cart" onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 font-medium py-2.5 px-3 rounded-lg transition-colors ${pathname.startsWith('/cart') ? 'text-brand-600 bg-brand-50' : 'text-gray-700 hover:text-brand-600 hover:bg-brand-50'}`}>
                    <ShoppingBag className="w-4 h-4" />
                    Cart
                    {totalItems > 0 && (
                      <span className="ml-auto bg-brand-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                  <Link href="/auth" onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 font-medium py-2.5 px-3 rounded-lg transition-colors ${pathname.startsWith('/auth') ? 'text-brand-600 bg-brand-50' : 'text-gray-700 hover:text-brand-600 hover:bg-brand-50'}`}>
                    <User className="w-4 h-4" />
                    Account
                  </Link>
                  {admin && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 font-medium py-2.5 px-3 rounded-lg transition-colors ${pathname.startsWith('/admin') ? 'text-brand-600 bg-brand-50' : 'text-gray-700 hover:text-brand-600 hover:bg-brand-50'}`}>
                      <LayoutDashboard className="w-4 h-4" />
                      Admin Dashboard
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
