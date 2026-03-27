'use client'

import { useState, useCallback, useTransition } from 'react'
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react'
import { getCustomerOrders } from '@tor/lib/actions/orders'
import { formatPrice } from '@tor/lib/utils'
import { useDebounce } from '@tor/lib/useDebounce'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

type Order = Awaited<ReturnType<typeof getCustomerOrders>>['orders'][number]

const PAGE_SIZE = 10

export default function CustomerOrders({
  email,
  initialOrders,
  initialTotal,
}: {
  email: string
  initialOrders: Order[]
  initialTotal: number
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Read filter values from URL (source of truth)
  const search = searchParams.get('search') || ''
  const dateFrom = searchParams.get('dateFrom') || ''
  const dateTo = searchParams.get('dateTo') || ''
  const priceMin = searchParams.get('priceMin') || ''
  const priceMax = searchParams.get('priceMax') || ''

  // Local input state (mirrors URL, only diverges while typing)
  const [query, setQuery] = useState(search)
  const [from, setFrom] = useState(dateFrom)
  const [to, setTo] = useState(dateTo)
  const [minPrice, setMinPrice] = useState(priceMin)
  const [maxPrice, setMaxPrice] = useState(priceMax)
  const [showFilters, setShowFilters] = useState(!!(dateFrom || dateTo || priceMin || priceMax))

  // Load More state
  const [extraOrders, setExtraOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(initialTotal)
  const [isPending, startTransition] = useTransition()
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // Reset extra orders when URL filters change
  const filterKey = `${search}|${dateFrom}|${dateTo}|${priceMin}|${priceMax}`
  const [lastFilterKey, setLastFilterKey] = useState(filterKey)
  if (filterKey !== lastFilterKey) {
    setLastFilterKey(filterKey)
    setExtraOrders([])
    setTotal(initialTotal)
    setQuery(search)
    setFrom(dateFrom)
    setTo(dateTo)
    setMinPrice(priceMin)
    setMaxPrice(priceMax)
  }

  const allOrders = [...initialOrders, ...extraOrders]
  const hasMore = allOrders.length < total
  const hasActiveFilters = !!(search || dateFrom || dateTo || priceMin || priceMax)

  const pushFilters = useCallback((vals: Record<string, string>) => {
    const params = new URLSearchParams()
    for (const [key, val] of Object.entries(vals)) {
      if (val) params.set(key, val)
    }
    router.push(`${pathname}${params.toString() ? `?${params}` : ''}`)
  }, [router, pathname])

  function allValues(overrides?: Record<string, string>) {
    return { search: query, dateFrom: from, dateTo: to, priceMin: minPrice, priceMax: maxPrice, ...overrides }
  }

  function clearFilters() {
    setQuery('')
    setFrom('')
    setTo('')
    setMinPrice('')
    setMaxPrice('')
    router.push(pathname)
  }

  function loadMore() {
    setIsLoadingMore(true)
    const currentFilters = { search, dateFrom, dateTo, priceMin, priceMax }
    startTransition(async () => {
      const result = await getCustomerOrders(email, currentFilters, allOrders.length, PAGE_SIZE)
      setExtraOrders(prev => [...prev, ...result.orders])
      setTotal(result.total)
      setIsLoadingMore(false)
    })
  }

  // Debounce search (400ms)
  useDebounce(() => {
    if (query !== search) pushFilters(allValues({ search: query }))
  }, 400, [query])

  // Debounce date/price filters (300ms)
  useDebounce(() => {
    if (from !== dateFrom || to !== dateTo || minPrice !== priceMin || maxPrice !== priceMax) {
      pushFilters(allValues({ dateFrom: from, dateTo: to, priceMin: minPrice, priceMax: maxPrice }))
    }
  }, 300, [from, to, minPrice, maxPrice])

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900 mb-3">Orders</h2>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by product, reference..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-300 focus:border-transparent outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-2.5 py-2 border rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
              showFilters || hasActiveFilters
                ? 'border-brand-300 text-brand-600 bg-brand-50'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {showFilters && (
          <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl p-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Date from</label>
                <input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-300 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Date to</label>
                <input
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-300 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Min price</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-300 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Max price</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Any"
                  min="0"
                  className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-300 focus:border-transparent outline-none"
                />
              </div>
            </div>
            {hasActiveFilters && (
              <div className="mt-2.5 pt-2.5 border-t border-gray-200">
                <button onClick={clearFilters} className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
                  <X className="w-3.5 h-3.5" /> Clear all
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Orders table */}
      {allOrders.length === 0 ? (
        <div className="p-6 text-center text-gray-400">
          {hasActiveFilters ? 'No orders match your filters' : 'No orders found'}
        </div>
      ) : (
        <>
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Order</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Amount</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3 hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="text-sm font-medium text-brand-600 hover:text-brand-700">
                      {order.paystack_reference || order.id.slice(0, 8)}
                    </Link>
                    <p className="text-xs text-gray-400 sm:hidden mt-0.5">
                      {new Date(order.created_at).toLocaleDateString('en-GH', { day: 'numeric', month: 'short' })}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold">{formatPrice(order.total_amount)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
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
        </>
      )}
    </div>
  )
}
