'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { getOrders } from '@tor/lib/actions/orders'
import { formatPrice } from '@tor/lib/utils'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

type Order = Awaited<ReturnType<typeof getOrders>>['orders'][number]

export default function OrderList({
  initialOrders,
  initialTotal,
  filters,
}: {
  initialOrders: Order[]
  initialTotal: number
  filters: Record<string, string | undefined>
}) {
  const [extraOrders, setExtraOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(initialTotal)
  const [isPending, startTransition] = useTransition()
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const allOrders = [...initialOrders, ...extraOrders]
  const hasMore = allOrders.length < total

  // Reset when initialOrders change (filters applied server-side)
  const [lastKey, setLastKey] = useState(JSON.stringify(initialOrders.map(o => o.id)))
  const newKey = JSON.stringify(initialOrders.map(o => o.id))
  if (newKey !== lastKey) {
    setLastKey(newKey)
    setExtraOrders([])
    setTotal(initialTotal)
  }

  function loadMore() {
    setIsLoadingMore(true)
    startTransition(async () => {
      const result = await getOrders(filters, allOrders.length, 10)
      setExtraOrders(prev => [...prev, ...result.orders])
      setTotal(result.total)
      setIsLoadingMore(false)
    })
  }

  return (
    <>
      <p className="text-xs text-gray-400 mb-2">{total} order{total !== 1 ? 's' : ''}</p>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Order</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3 hidden sm:table-cell">Customer</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Amount</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Status</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3 hidden md:table-cell">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {allOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="text-sm font-medium text-brand-600 hover:text-brand-700">
                    {order.paystack_reference || order.id.slice(0, 8)}
                  </Link>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <p className="text-sm text-gray-900">{order.customer_name}</p>
                  <p className="text-xs text-gray-500">{order.customer_email}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-semibold">{formatPrice(order.total_amount)}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                    {order.paid_manually && order.status === 'paid' && (
                      <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full">
                        MANUAL
                      </span>
                    )}
                  </span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {hasMore && (
          <div className="px-4 py-3 border-t border-gray-100 text-center">
            <button
              onClick={loadMore}
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors disabled:opacity-50 inline-flex items-center gap-2"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                `Load More (${allOrders.length} of ${total})`
              )}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
