import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Mail, Phone, Calendar, MessageSquare, Package, Play } from 'lucide-react'
import { getProductRequest } from '@tor/lib/actions/products'
import { formatPrice } from '@tor/lib/utils'
import RequestStatusActions from './RequestStatusActions'
import RequestPriceEditor from './RequestPriceEditor'

export const metadata: Metadata = {
  title: 'Request Detail - Admin',
}

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const request = await getProductRequest(id)
  if (!request) notFound()

  const product = request.products as {
    id: string
    name: string
    slug: string
    description: string
    price: number
    compare_at_price: number | null
    category: string
    in_stock: boolean
    stock_quantity: number
    product_media: { id: string; url: string; type: string; sort_order: number }[]
  } | null

  const media = product?.product_media?.sort((a, b) => a.sort_order - b.sort_order) || []
  const primaryImage = media.find(m => m.type === 'image') || media[0]

  return (
    <div>
      <Link
        href="/admin/requests"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Requests
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Customer Info & Note */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Product Request</h1>
            <p className="text-sm text-gray-400 mb-6">
              Submitted on{' '}
              {new Date(request.created_at).toLocaleDateString('en-GH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>

            <h2 className="font-semibold text-gray-900 mb-3">Customer Details</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 mb-0.5">Name</p>
                <p className="font-medium text-gray-900">{request.customer_name}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-0.5">Email</p>
                <a href={`mailto:${request.customer_email}`} className="font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {request.customer_email}
                </a>
              </div>
              {request.customer_phone && (
                <div>
                  <p className="text-gray-400 mb-0.5">Phone</p>
                  <a href={`tel:${request.customer_phone}`} className="font-medium text-gray-900 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    {request.customer_phone}
                  </a>
                </div>
              )}
              {request.desired_date && (
                <div>
                  <p className="text-gray-400 mb-0.5">Desired Delivery Date</p>
                  <p className="font-medium text-gray-900 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(request.desired_date).toLocaleDateString('en-GH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>

            {request.note && (
              <div className="mt-6">
                <h2 className="font-semibold text-gray-900 mb-2">Customer Note</h2>
                <div className="flex gap-2 bg-gray-50 rounded-lg p-4">
                  <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-600 text-sm">{request.note}</p>
                </div>
              </div>
            )}

            {/* Payment Link */}
            {request.status === 'notified' && request.token && (
              <div className="mt-6 border-t border-gray-100 pt-6">
                <h2 className="font-semibold text-gray-900 mb-2">Payment Link</h2>
                <p className="text-xs text-gray-400 mb-2">Share this link with the customer so they can pay:</p>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={`${process.env.NEXT_PUBLIC_SITE_URL}/pay/request/${request.token}`}
                    className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 select-all"
                  />
                </div>
              </div>
            )}

            {/* Status Actions */}
            <div className="mt-6 border-t border-gray-100 pt-6">
              <h2 className="font-semibold text-gray-900 mb-3">Status</h2>
              <RequestStatusActions requestId={request.id} currentStatus={request.status} />
            </div>
          </div>
        </div>

        {/* Product Card */}
        <div>
          {product ? (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {/* Product Image */}
              {primaryImage ? (
                <div className="relative aspect-square bg-gray-100">
                  {primaryImage.type === 'video' ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <Play className="w-10 h-10 text-gray-400" />
                    </div>
                  ) : (
                    <Image
                      src={primaryImage.url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="400px"
                    />
                  )}
                  {!product.in_stock && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      Out of Stock
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <Package className="w-10 h-10 text-gray-300" />
                </div>
              )}

              {/* Product Info */}
              <div className="p-4">
                <p className="text-xs text-brand-600 font-medium uppercase tracking-wider mb-1">
                  {product.category}
                </p>
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>

                <div className="mt-3">
                  <RequestPriceEditor
                    requestId={request.id}
                    currentPrice={request.price}
                    productPrice={product.price}
                    disabled={request.status === 'paid'}
                  />
                </div>

                <div className="mt-2 text-xs text-gray-500">
                  Stock: {product.stock_quantity} {product.in_stock ? '(In Stock)' : '(Out of Stock)'}
                </div>

                {/* Media thumbnails */}
                {media.length > 1 && (
                  <div className="flex gap-1.5 mt-3">
                    {media.slice(0, 5).map((m) => (
                      <div key={m.id} className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                        {m.type === 'video' ? (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <Play className="w-3 h-3 text-gray-500" />
                          </div>
                        ) : (
                          <Image src={m.url} alt="" fill className="object-cover" sizes="48px" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <Link
                  href={`/products/${product.slug}`}
                  className="mt-4 block text-center text-sm font-semibold text-brand-600 hover:text-brand-700 border border-brand-200 rounded-lg py-2 transition-colors"
                >
                  View Product
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
              <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Product not found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
