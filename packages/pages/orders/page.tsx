import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, ChevronRight } from 'lucide-react'
import { getSession } from '@tor/lib/actions/auth'
import { getMyOrders } from '@tor/lib/actions/orders'
import { formatPrice } from '@tor/lib/utils'

export const metadata: Metadata = {
  title: 'My Orders',
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending Payment', color: 'bg-yellow-100 text-yellow-700' },
  paid: { label: 'Paid', color: 'bg-blue-100 text-blue-700' },
  processing: { label: 'Processing', color: 'bg-indigo-100 text-indigo-700' },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-700' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
}

export default async function OrdersPage() {
  const session = await getSession()
  if (!session) redirect('/auth?redirect=/orders')

  const orders = await getMyOrders()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-4">You haven&apos;t placed any orders yet</p>
          <Link
            href="/products"
            className="inline-block bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-full transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const sc = statusConfig[order.status] || statusConfig.pending
            const itemCount = order.order_items?.length || 0
            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${sc.color}`}>
                        {sc.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(order.created_at).toLocaleDateString('en-GH', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-900 truncate">
                      {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {order.order_items?.map((i: { product_name: string }) => i.product_name).join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-lg font-bold text-gray-900">{formatPrice(order.total_amount)}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
