import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Play, Package } from 'lucide-react'
import { getRequestByToken } from '@tor/lib/actions/products'
import { getStoreSettings } from '@tor/lib/actions/settings'
import { formatPrice } from '@tor/lib/utils'
import RequestPaymentClient from './RequestPaymentClient'

export const metadata: Metadata = {
  title: 'Complete Your Order',
}

export default async function RequestPaymentPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const request = await getRequestByToken(token)

  if (!request || request.status !== 'notified') {
    notFound()
  }

  const settings = await getStoreSettings()

  const product = request.products as {
    id: string
    name: string
    price: number
    compare_at_price: number | null
    category: string
    description: string
    product_media: { id: string; url: string; type: string; sort_order: number }[]
  } | null

  if (!product) notFound()

  const media = product.product_media?.sort((a, b) => a.sort_order - b.sort_order) || []
  const primaryImage = media.find(m => m.type === 'image') || media[0]

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Complete Your Order</h1>
        <p className="mt-2 text-gray-500">Your requested product is ready — fill in your details to pay.</p>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Product Summary */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden sticky top-24">
            {primaryImage ? (
              <div className="relative aspect-square bg-gray-100">
                {primaryImage.type === 'video' ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <Play className="w-10 h-10 text-gray-400" />
                  </div>
                ) : (
                  <Image src={primaryImage.url} alt={product.name} fill className="object-cover" sizes="300px" />
                )}
              </div>
            ) : (
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <Package className="w-10 h-10 text-gray-300" />
              </div>
            )}
            <div className="p-4">
              <p className="text-xs text-brand-600 font-medium uppercase tracking-wider mb-1">{product.category}</p>
              <h2 className="font-semibold text-gray-900">{product.name}</h2>
              <p className="text-2xl font-bold text-gray-900 mt-2">{formatPrice(request.price)}</p>
              {product.price !== request.price && (
                <p className="text-sm text-gray-400 line-through">{formatPrice(product.price)}</p>
              )}
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="md:col-span-3">
          <RequestPaymentClient
            token={token}
            product={{ name: product.name, price: request.price }}
            customer={{
              name: request.customer_name,
              email: request.customer_email,
              phone: request.customer_phone || '',
            }}
            bypassPayment={settings.bypass_payment}
          />
        </div>
      </div>
    </div>
  )
}
