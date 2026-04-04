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

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const linkBase = 'font-medium transition-colors text-sm tracking-wide'
  const linkActive = 'text-gold-400'
  const linkIdle = 'text-brand-200 hover:text-gold-400'

  const iconBase = 'hidden lg:flex flex-col items-center transition-colors px-2 py-1'
  const iconActive = 'text-gold-400'
  const iconIdle = 'text-brand-300 hover:text-gold-400'

  return (
    <>
      <header className="sticky top-0 z-50 bg-brand-900/95 backdrop-blur-md border-b border-brand-800">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center">
              {store.logo ? (
                <Image
                  src={store.logo}
                  alt={store.name}
                  width={64}
                  height={64}
                  className="h-14 w-auto object-contain"
                />
              ) : (
                <span className="text-xl font-bold text-brand-100">{store.name}</span>
              )}
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              <Link href="/products" className={`${linkBase} ${isNavActive('/products') ? linkActive : linkIdle}`}>
                Shop
              </Link>
              {store.categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  className={`${linkBase} ${isNavActive(`/products?category=${cat.slug}`) ? linkActive : linkIdle}`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Link href="/requests" className={`${iconBase} ${pathname.startsWith('/requests') ? iconActive : iconIdle}`}>
                <MessageSquareText className="w-5 h-5" />
                <span className="text-[10px] font-medium mt-0.5">Requests</span>
              </Link>
              <Link href="/orders" className={`${iconBase} ${pathname.startsWith('/orders') ? iconActive : iconIdle}`}>
                <ClipboardList className="w-5 h-5" />
                <span className="text-[10px] font-medium mt-0.5">Orders</span>
              </Link>
              <Link href="/auth" className={`${iconBase} ${pathname.startsWith('/auth') ? iconActive : iconIdle}`}>
                <User className="w-5 h-5" />
                <span className="text-[10px] font-medium mt-0.5">Account</span>
              </Link>
              {admin && (
                <Link href="/admin" className={`${iconBase} ${pathname.startsWith('/admin') ? iconActive : iconIdle}`}>
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="text-[10px] font-medium mt-0.5">Admin</span>
                </Link>
              )}
              <Link href="/cart" className={`hidden lg:flex relative flex-col items-center px-2 py-1 transition-colors ${pathname.startsWith('/cart') ? iconActive : iconIdle}`}>
                <ShoppingBag className="w-5 h-5" />
                <span className="text-[10px] font-medium mt-0.5">Cart</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1 right-0 bg-gold-500 text-brand-900 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile: cart + hamburger */}
              <Link href="/cart" className="relative lg:hidden text-brand-200 hover:text-gold-400 transition-colors p-1">
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold-500 text-brand-900 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-brand-200 hover:text-gold-400 transition-colors p-1">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Side Panel */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />

          <div className="absolute top-0 right-0 h-full w-72 bg-brand-900 shadow-2xl animate-slide-in flex flex-col border-l border-brand-800">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-brand-800">
              {store.logo && (
                <Image src={store.logo} alt={store.name} width={40} height={40} className="h-10 w-auto" />
              )}
              <button onClick={() => setMobileOpen(false)} className="text-brand-400 hover:text-brand-100 ml-auto">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto py-4">
              <div className="px-5 mb-3">
                <p className="text-[11px] font-semibold text-brand-500 uppercase tracking-wider mb-2">Shop</p>
                <div className="space-y-1">
                  <Link href="/products" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-brand-200 hover:text-gold-400 hover:bg-brand-800 font-medium py-2.5 px-3 rounded-lg transition-colors">
                    Shop All
                  </Link>
                  {store.categories.map((cat) => (
                    <Link key={cat.slug} href={`/products?category=${cat.slug}`} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-brand-200 hover:text-gold-400 hover:bg-brand-800 font-medium py-2.5 px-3 rounded-lg transition-colors">
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border-t border-brand-800 mx-5 my-2" />

              <div className="px-5">
                <p className="text-[11px] font-semibold text-brand-500 uppercase tracking-wider mb-2">My Account</p>
                <div className="space-y-1">
                  {[
                    { href: '/requests', icon: MessageSquareText, label: 'My Requests' },
                    { href: '/orders', icon: ClipboardList, label: 'My Orders' },
                    { href: '/auth', icon: User, label: 'Account' },
                  ].map(({ href, icon: Icon, label }) => (
                    <Link key={href} href={href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 font-medium py-2.5 px-3 rounded-lg transition-colors ${pathname.startsWith(href) ? 'text-gold-400 bg-brand-800' : 'text-brand-200 hover:text-gold-400 hover:bg-brand-800'}`}>
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  ))}
                  <Link href="/cart" onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 font-medium py-2.5 px-3 rounded-lg transition-colors ${pathname.startsWith('/cart') ? 'text-gold-400 bg-brand-800' : 'text-brand-200 hover:text-gold-400 hover:bg-brand-800'}`}>
                    <ShoppingBag className="w-4 h-4" />
                    Cart
                    {totalItems > 0 && (
                      <span className="ml-auto bg-gold-500 text-brand-900 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                  {admin && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 font-medium py-2.5 px-3 rounded-lg transition-colors ${pathname.startsWith('/admin') ? 'text-gold-400 bg-brand-800' : 'text-brand-200 hover:text-gold-400 hover:bg-brand-800'}`}>
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
