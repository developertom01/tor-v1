import { Metadata } from 'next'
import Link from 'next/link'
import { getOrders, getPendingOrderCount } from '@tor/lib/actions/orders'
import { listActiveFormDrafts } from '@tor/lib/actions/drafts'
import OrderFilters from './OrderFilters'
import OrderList from './OrderList'
import DraftList from './DraftList'
import StartOrderButton from './StartOrderButton'

export const metadata: Metadata = {
  title: 'Manage Orders',
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    tab?: string
    status?: string
    search?: string
    dateFrom?: string
    dateTo?: string
    priceMin?: string
    priceMax?: string
  }>
}) {
  const params = await searchParams
  const tab = params.tab === 'drafts' ? 'drafts' : 'orders'

  let orders: Awaited<ReturnType<typeof getOrders>> = { orders: [], total: 0 }
  let pendingCount = 0
  let drafts: Awaited<ReturnType<typeof listActiveFormDrafts>> = { drafts: [], total: 0 }

  try {
    if (tab === 'orders') {
      ;[orders, pendingCount] = await Promise.all([
        getOrders(params),
        getPendingOrderCount(),
      ])
    } else {
      ;[drafts, pendingCount] = await Promise.all([
        listActiveFormDrafts('create_order', 0, 10),
        getPendingOrderCount(),
      ])
    }
  } catch { /* DB not ready */ }

  const statuses = ['all', 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']
  const hasFilters = !!(params.search || params.dateFrom || params.dateTo || params.priceMin || params.priceMax)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <StartOrderButton />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-5">
        <Link
          href="/admin/orders"
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            tab === 'orders'
              ? 'bg-brand-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Orders
          {pendingCount > 0 && tab !== 'orders' && (
            <span className="ml-2 inline-flex items-center justify-center min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
              {pendingCount}
            </span>
          )}
        </Link>
        <Link
          href="/admin/orders?tab=drafts"
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
            tab === 'drafts'
              ? 'bg-brand-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Drafts
          {drafts.total > 0 && tab === 'orders' && (
            <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] bg-amber-500 text-white text-[10px] font-bold rounded-full px-1">
              {drafts.total}
            </span>
          )}
        </Link>
      </div>

      {tab === 'orders' && (
        <>
          {/* Status Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            {statuses.map((s) => {
              const query = new URLSearchParams()
              if (s !== 'all') query.set('status', s)
              if (params.search) query.set('search', params.search)
              if (params.dateFrom) query.set('dateFrom', params.dateFrom)
              if (params.dateTo) query.set('dateTo', params.dateTo)
              if (params.priceMin) query.set('priceMin', params.priceMin)
              if (params.priceMax) query.set('priceMax', params.priceMax)
              const href = query.toString() ? `/admin/orders?${query}` : '/admin/orders'

              return (
                <Link
                  key={s}
                  href={href}
                  className={`relative px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                    (s === 'all' && !params.status) || params.status === s
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {s}
                  {s === 'pending' && pendingCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
                      {pendingCount}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>

          <OrderFilters
            search={params.search}
            dateFrom={params.dateFrom}
            dateTo={params.dateTo}
            priceMin={params.priceMin}
            priceMax={params.priceMax}
            status={params.status}
          />

          {orders.orders.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
              <p className="text-gray-400">{hasFilters ? 'No orders match your filters' : 'No orders found'}</p>
              {hasFilters && (
                <Link
                  href={params.status ? `/admin/orders?status=${params.status}` : '/admin/orders'}
                  className="text-sm text-brand-600 hover:text-brand-700 font-medium mt-2 inline-block"
                >
                  Clear filters
                </Link>
              )}
            </div>
          ) : (
            <OrderList
              initialOrders={orders.orders}
              initialTotal={orders.total}
              filters={params}
            />
          )}
        </>
      )}

      {tab === 'drafts' && (
        <DraftList initialDrafts={drafts.drafts} initialTotal={drafts.total} />
      )}
    </div>
  )
}
