'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { formatPrice } from '@tor/lib/utils'

type Customer = {
  user_id: string | null
  customer_email: string
  customer_name: string
  customer_phone: string
  order_count: number
  total_spent: number
  last_order_at: string
  slug: string
}

const PAGE_SIZE = 10

export default function CustomerList({
  customers,
}: {
  customers: Customer[]
}) {
  const [visible, setVisible] = useState(PAGE_SIZE)
  const shown = customers.slice(0, visible)
  const hasMore = visible < customers.length

  return (
    <>
      <p className="text-xs text-gray-400 mb-2">{customers.length} customer{customers.length !== 1 ? 's' : ''}</p>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Customer</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3 hidden sm:table-cell">Phone</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Orders</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3 hidden sm:table-cell">Total Spent</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3 hidden md:table-cell">Last Order</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {shown.map((c) => (
              <tr key={c.customer_email} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/customers/${c.slug}`} className="block">
                    <p className="text-sm font-medium text-brand-600 hover:text-brand-700">{c.customer_name}</p>
                    <p className="text-xs text-gray-500">{c.customer_email}</p>
                  </Link>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="text-sm text-gray-600">{c.customer_phone}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-semibold text-gray-900">{c.order_count}</span>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="text-sm font-semibold text-gray-900">{formatPrice(c.total_spent)}</span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-sm text-gray-500">
                    {new Date(c.last_order_at).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {hasMore && (
          <div className="px-4 py-3 border-t border-gray-100 text-center">
            <button
              onClick={() => setVisible(v => v + PAGE_SIZE)}
              className="px-4 py-2 text-sm font-medium text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              Load More ({shown.length} of {customers.length})
            </button>
          </div>
        )}
      </div>
    </>
  )
}
