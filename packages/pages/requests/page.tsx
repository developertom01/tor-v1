import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Bell, Calendar, MessageSquare, Package, CheckCircle2, Pencil } from 'lucide-react'
import { getSession } from '@tor/lib/actions/auth'
import { getMyRequests } from '@tor/lib/actions/products'
import { formatPrice } from '@tor/lib/utils'

export const metadata: Metadata = {
  title: 'My Requests',
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  notified: { label: 'Available — Pay Now', color: 'bg-blue-100 text-blue-700' },
  paid: { label: 'Processed', color: 'bg-gray-100 text-gray-500' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
}

export default async function MyRequestsPage() {
  const session = await getSession()
  if (!session) redirect('/auth?redirect=/requests')

  const requests = await getMyRequests()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Requests</h1>

      {requests.length === 0 ? (
        <div className="text-center py-20">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-4">You haven&apos;t requested any products yet</p>
          <Link
            href="/products"
            className="inline-block bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-full transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const isPaid = req.status === 'paid'
            const sc = statusConfig[req.status] || statusConfig.pending
            const product = req.products as {
              name: string
              price: number
              product_media: { url: string; type: string; sort_order: number }[]
            } | null
            const media = product?.product_media?.sort((a, b) => a.sort_order - b.sort_order) || []
            const thumb = media.find(m => m.type === 'image') || media[0]

            return (
              <div
                key={req.id}
                className={`bg-white rounded-xl border p-5 transition-shadow ${
                  isPaid
                    ? 'border-gray-200 opacity-60'
                    : 'border-gray-100 hover:shadow-md'
                }`}
              >
                <div className="flex gap-4">
                  {/* Product thumbnail */}
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {thumb ? (
                      <Image src={thumb.url} alt={product?.name || ''} fill className="object-cover" sizes="64px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div>
                        <p className={`font-semibold ${isPaid ? 'text-gray-400' : 'text-gray-900'}`}>
                          {product?.name || 'Unknown product'}
                        </p>
                        <p className={`text-sm ${isPaid ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatPrice(req.price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isPaid && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${sc.color}`}>
                          {sc.label}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 mt-2">
                      <span>
                        {new Date(req.created_at).toLocaleDateString('en-GH', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      {req.desired_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Needs by {new Date(req.desired_date).toLocaleDateString('en-GH', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>

                    {req.note && (
                      <div className="mt-2 flex gap-1.5 text-xs text-gray-400">
                        <MessageSquare className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{req.note}</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {req.status === 'notified' && req.token && (
                        <Link
                          href={`/pay/request/${req.token}`}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-full transition-colors"
                        >
                          Complete Payment
                        </Link>
                      )}
                      {(req.status === 'pending' || req.status === 'notified') && (
                        <Link
                          href={`/requests/${req.id}/edit`}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </Link>
                      )}
                    </div>

                    {isPaid && (
                      <p className="mt-2 text-xs text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Converted to order — check My Orders for tracking
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
