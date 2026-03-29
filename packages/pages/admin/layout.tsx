import { redirect } from 'next/navigation'
import { isAdmin } from '@tor/lib/actions/auth'
import { getPendingOrderCount } from '@tor/lib/actions/orders'
import Link from 'next/link'
import { LayoutDashboard } from 'lucide-react'
import AdminNav from '@tor/ui/AdminNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await isAdmin()
  if (!admin) redirect('/auth')

  const pendingOrders = await getPendingOrderCount()

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
          <AdminNav pendingOrders={pendingOrders} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </div>
    </div>
  )
}
