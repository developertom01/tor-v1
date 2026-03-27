import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { ImageIcon } from 'lucide-react'
import { getOrder } from '@tor/lib/actions/orders'
import { formatPrice } from '@tor/lib/utils'
import OrderStatusUpdate from './OrderStatusUpdate'

export const metadata: Metadata = {
  title: 'Order Details',
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await getOrder(id)
  if (!order) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Order: <span className="font-mono text-lg">{order.paystack_reference || order.id.slice(0, 8)}</span>
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Order Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.order_items?.map((item: { id: string; product_name: string; product_image?: string; variant_name?: string; quantity: number; unit_price: number }) => (
                <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.product_image ? (
                      <Image src={item.product_image} alt={item.product_name} fill className="object-cover" sizes="40px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">
                      {item.product_name}
                      {item.variant_name && <span className="text-sm text-gray-500 font-normal ml-1">— {item.variant_name}</span>}
                    </p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity} x {formatPrice(item.unit_price)}</p>
                  </div>
                  <span className="font-semibold">{formatPrice(item.quantity * item.unit_price)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-lg">{formatPrice(order.total_amount)}</span>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Customer Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Name</p>
                <p className="font-medium">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-medium">{order.customer_email}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium">{order.customer_phone}</p>
              </div>
              <div>
                <p className="text-gray-500">Region</p>
                <p className="font-medium">{order.region}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500">Address</p>
                <p className="font-medium">{order.shipping_address}, {order.city}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Sidebar */}
        <div>
          <OrderStatusUpdate orderId={order.id} currentStatus={order.status} paidManually={order.paid_manually} paymentToken={order.payment_token} />

          {order.status === 'cancelled' && order.cancelled_reason && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mt-4">
              <h2 className="font-semibold text-red-800 mb-2">Cancellation Details</h2>
              <p className="text-sm text-red-700">{order.cancelled_reason}</p>
              {order.cancelled_at && (
                <p className="text-xs text-red-400 mt-2">
                  Cancelled on {new Date(order.cancelled_at).toLocaleString('en-GH')}
                </p>
              )}
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-100 p-6 mt-4">
            <h2 className="font-semibold text-gray-900 mb-3">Timeline</h2>
            <div className="text-sm space-y-2">
              <p className="text-gray-500">
                Created: {new Date(order.created_at).toLocaleString('en-GH')}
              </p>
              <p className="text-gray-500">
                Updated: {new Date(order.updated_at).toLocaleString('en-GH')}
              </p>
              {order.paystack_reference && (
                <p className="text-gray-500">
                  Ref: <span className="font-mono">{order.paystack_reference}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
