import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getProductRequests } from '@tor/lib/actions/products'
import { Bell, Mail, Phone, Calendar, MessageSquare, CheckCircle2, Package } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Product Requests - Admin',
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  notified: { label: 'Notified', color: 'bg-blue-100 text-blue-700' },
  paid: { label: 'Processed', color: 'bg-gray-200 text-gray-500' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
}

export default async function AdminRequestsPage() {
  let requests: Awaited<ReturnType<typeof getProductRequests>> = []
  try {
    requests = await getProductRequests()
  } catch { /* table may not exist yet */ }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Requests</h1>
          <p className="text-sm text-gray-500 mt-1">Customers requesting out-of-stock products</p>
        </div>
        <span className="text-sm text-gray-400">{requests.length} request{requests.length !== 1 ? 's' : ''}</span>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">No product requests yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => {
            const sc = statusConfig[req.status] || statusConfig.pending
            const isPaid = req.status === 'paid'
            const product = req.products as { name: string; product_media: { url: string; type: string; sort_order: number }[] } | null
            const productName = product?.name || 'Unknown product'
            const media = product?.product_media?.sort((a, b) => a.sort_order - b.sort_order) || []
            const thumb = media.find(m => m.type === 'image') || media[0]

            return (
              <Link
                key={req.id}
                href={`/admin/requests/${req.id}`}
                className={`block bg-white rounded-xl border p-5 transition-shadow ${
                  isPaid ? 'border-gray-200 opacity-60' : 'border-gray-100 hover:shadow-md'
                }`}
              >
                <div className="flex gap-4">
                  {/* Product thumbnail */}
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {thumb ? (
                      <Image src={thumb.url} alt={productName} fill className="object-cover" sizes="56px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-300" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className={`font-semibold ${isPaid ? 'text-gray-400' : 'text-gray-900'}`}>{productName}</p>
                    <p className={`text-sm ${isPaid ? 'text-gray-400' : 'text-gray-500'}`}>
                      Requested by <span className={`font-medium ${isPaid ? 'text-gray-400' : 'text-gray-700'}`}>{req.customer_name}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isPaid && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${sc.color}`}>
                      {sc.label}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(req.created_at).toLocaleDateString('en-GH', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className={`flex flex-wrap gap-x-5 gap-y-1 text-sm ${isPaid ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    {req.customer_email}
                  </span>
                  {req.customer_phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      {req.customer_phone}
                    </span>
                  )}
                  {req.desired_date && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Needs by {new Date(req.desired_date).toLocaleDateString('en-GH', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  )}
                </div>

                {req.note && !isPaid && (
                  <div className="mt-3 flex gap-2 text-sm bg-gray-50 rounded-lg p-3">
                    <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-600 line-clamp-1">{req.note}</p>
                  </div>
                )}

                {isPaid && (
                  <p className="mt-2 text-xs text-green-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Converted to order
                  </p>
                )}
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
