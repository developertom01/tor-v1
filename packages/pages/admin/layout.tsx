import { redirect } from 'next/navigation'
import { isAdmin } from '@tor/lib/actions/auth'
import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingCart, MessageSquareText, Users, Settings } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await isAdmin()
  if (!admin) redirect('/auth')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between mb-2 sm:mb-0">
            <Link href="/admin" className="font-bold text-gray-900 flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-brand-600" />
              Admin
            </Link>
          </div>

          <nav className="flex items-center gap-1 sm:hidden">
            <Link href="/admin/products" className="flex-1 text-center text-xs text-gray-600 hover:text-brand-600 font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Package className="w-4 h-4 mx-auto mb-0.5" />
              Products
            </Link>
            <Link href="/admin/orders" className="flex-1 text-center text-xs text-gray-600 hover:text-brand-600 font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <ShoppingCart className="w-4 h-4 mx-auto mb-0.5" />
              Orders
            </Link>
            <Link href="/admin/requests" className="flex-1 text-center text-xs text-gray-600 hover:text-brand-600 font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <MessageSquareText className="w-4 h-4 mx-auto mb-0.5" />
              Requests
            </Link>
            <Link href="/admin/customers" className="flex-1 text-center text-xs text-gray-600 hover:text-brand-600 font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Users className="w-4 h-4 mx-auto mb-0.5" />
              Customers
            </Link>
            <Link href="/admin/settings" className="flex-1 text-center text-xs text-gray-600 hover:text-brand-600 font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Settings className="w-4 h-4 mx-auto mb-0.5" />
              Settings
            </Link>
          </nav>

          <nav className="hidden sm:flex items-center gap-3 -mb-3">
            <Link href="/admin/products" className="text-sm text-gray-600 hover:text-brand-600 font-medium flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
              <Package className="w-4 h-4" /> Products
            </Link>
            <Link href="/admin/orders" className="text-sm text-gray-600 hover:text-brand-600 font-medium flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
              <ShoppingCart className="w-4 h-4" /> Orders
            </Link>
            <Link href="/admin/requests" className="text-sm text-gray-600 hover:text-brand-600 font-medium flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
              <MessageSquareText className="w-4 h-4" /> Requests
            </Link>
            <Link href="/admin/customers" className="text-sm text-gray-600 hover:text-brand-600 font-medium flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
              <Users className="w-4 h-4" /> Customers
            </Link>
            <Link href="/admin/settings" className="text-sm text-gray-600 hover:text-brand-600 font-medium flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
              <Settings className="w-4 h-4" /> Settings
            </Link>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </div>
    </div>
  )
}
