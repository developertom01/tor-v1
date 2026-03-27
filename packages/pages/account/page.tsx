import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { User, Mail, Package, LogOut } from 'lucide-react'
import { getSession, getProfile } from '@tor/lib/actions/auth'
import { getMyOrders } from '@tor/lib/actions/orders'
import SignOutButton from './SignOutButton'

export const metadata: Metadata = {
  title: 'My Account',
}

export default async function AccountPage() {
  const session = await getSession()
  if (!session) redirect('/auth?redirect=/account')

  const profile = await getProfile()
  const orders = await getMyOrders()

  const recentOrders = orders.slice(0, 3)

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center">
            <User className="w-7 h-7 text-brand-600" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">{profile?.full_name || session.email}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              {session.email}
            </p>
          </div>
        </div>
        <SignOutButton />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-gray-400" />
            Recent Orders
          </h2>
          {orders.length > 3 && (
            <Link href="/orders" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              View all
            </Link>
          )}
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-400 mb-3">No orders yet</p>
            <Link href="/products" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {order.order_items?.map((i: { product_name: string }) => i.product_name).join(', ')}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  GH₵{Number(order.total_amount).toFixed(2)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
