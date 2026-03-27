import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { ImageIcon } from 'lucide-react'
import { getOrderByPaymentToken } from '@tor/lib/actions/orders'
import { formatPrice } from '@tor/lib/utils'
import OrderPaymentClient from './OrderPaymentClient'

export const metadata: Metadata = {
  title: 'Complete Payment',
}

export default async function OrderPaymentPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const order = await getOrderByPaymentToken(token)

  if (!order || order.status !== 'pending') {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Complete Your Payment</h1>
        <p className="mt-2 text-gray-500">
          Hi {order.customer_name}, pay for your order to get it processed.
        </p>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
        <div className="divide-y divide-gray-100">
          {order.order_items?.map((item: { id: string; product_name: string; product_image?: string; product_description?: string; variant_name?: string; quantity: number; unit_price: number }) => (
            <div key={item.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {item.product_image ? (
                  <Image src={item.product_image} alt={item.product_name} fill className="object-cover" sizes="64px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-gray-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">
                  {item.product_name}
                  {item.variant_name && <span className="text-sm text-gray-500 font-normal ml-1">— {item.variant_name}</span>}
                </p>
                <p className="text-sm text-gray-400 mt-0.5">Qty: {item.quantity} × {formatPrice(item.unit_price)}</p>
              </div>
              <span className="font-semibold text-gray-900 flex-shrink-0">
                {formatPrice(item.quantity * item.unit_price)}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 mt-4 pt-4 flex items-center justify-between">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="text-xl font-bold text-gray-900">{formatPrice(order.total_amount)}</span>
        </div>
      </div>

      {/* Shipping Details */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-3">Shipping To</h2>
        <div className="text-sm text-gray-600 space-y-1">
          <p className="font-medium text-gray-900">{order.customer_name}</p>
          <p>{order.shipping_address}, {order.city}</p>
          <p>{order.region}</p>
          <p>{order.customer_phone}</p>
        </div>
      </div>

      <OrderPaymentClient
        token={token}
        email={order.customer_email}
        amount={order.total_amount}
        reference={order.paystack_reference}
      />
    </div>
  )
}
