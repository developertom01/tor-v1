import { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Package, CreditCard, Truck, CheckCircle, XCircle, Clock, ImageIcon, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { getSession } from '@tor/lib/actions/auth'
import { getMyOrder } from '@tor/lib/actions/orders'
import { formatPrice } from '@tor/lib/utils'

export const metadata: Metadata = {
  title: 'Order Details',
}

const STEPS = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'paid', label: 'Payment Confirmed', icon: CreditCard },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
]

const STATUS_ORDER = ['pending', 'paid', 'processing', 'shipped', 'delivered']

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()
  if (!session) redirect('/auth?redirect=/orders')

  const { id } = await params
  const order = await getMyOrder(id)
  if (!order) notFound()

  const isCancelled = order.status === 'cancelled'
  const currentStepIndex = STATUS_ORDER.indexOf(order.status)

  const statusTimestamps: Record<string, string> = {}
  for (const entry of order.order_status_history || []) {
    statusTimestamps[entry.status] = entry.created_at
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Link
        href="/orders"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          <p className="text-sm text-gray-400 mt-1">
            Placed on{' '}
            {new Date(order.created_at).toLocaleDateString('en-GH', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        {order.paystack_reference && (
          <p className="text-xs text-gray-400 font-mono">{order.paystack_reference}</p>
        )}
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Items</h2>
        <div className="divide-y divide-gray-100">
          {order.order_items?.map((item: { id: string; product_name: string; product_description: string | null; product_image: string | null; variant_name?: string; quantity: number; unit_price: number; product_id: string }) => (
            <div key={item.id} className="flex items-center gap-4 py-4">
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
                <Link
                  href={`/products/${item.product_id}`}
                  className="font-medium text-gray-900 hover:text-brand-600 transition-colors"
                >
                  {item.product_name}
                  {item.variant_name && <span className="text-sm text-gray-500 font-normal ml-1">— {item.variant_name}</span>}
                </Link>
                <p className="text-sm text-gray-400 mt-0.5">Qty: {item.quantity} × {formatPrice(item.unit_price)}</p>
                {item.product_description && (
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">{item.product_description}</p>
                )}
              </div>
              <span className="font-semibold text-gray-900 flex-shrink-0">
                {formatPrice(item.quantity * item.unit_price)}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 mt-2 pt-4 flex items-center justify-between">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="text-xl font-bold text-gray-900">{formatPrice(order.total_amount)}</span>
        </div>
      </div>

      {/* Payment Required Banner */}
      {order.status === 'pending' && order.payment_token && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h2 className="font-semibold text-amber-900 mb-1">Payment Required</h2>
              <p className="text-sm text-amber-700 mb-4">
                This order is awaiting payment. Complete your payment to get it processed.
              </p>
              <Link
                href={`/pay/order/${order.payment_token}`}
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-full transition-colors"
              >
                <CreditCard className="w-5 h-5" />
                Make Payment — {formatPrice(order.total_amount)}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Timeline */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-6">Order Tracking</h2>

        {isCancelled ? (
          <div>
            <div className="flex items-center gap-3 text-red-600 mb-1">
              <XCircle className="w-6 h-6" />
              <span className="font-semibold">This order has been cancelled</span>
            </div>
            {statusTimestamps['cancelled'] && (
              <p className="text-xs text-gray-400 ml-9 mb-4">
                {new Date(statusTimestamps['cancelled']).toLocaleDateString('en-GH', {
                  day: 'numeric', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </p>
            )}
            {order.cancelled_reason && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-yellow-800 mb-1">Reason</p>
                <p className="text-sm text-yellow-700">{order.cancelled_reason}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            {STEPS.map((step, i) => {
              const isComplete = i <= currentStepIndex
              const isCurrent = i === currentStepIndex
              const Icon = step.icon

              return (
                <div key={step.key} className="flex gap-4 relative">
                  {i < STEPS.length - 1 && (
                    <div
                      className={`absolute left-[17px] top-[34px] w-0.5 h-[calc(100%-2px)] ${
                        i < currentStepIndex ? 'bg-brand-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                  <div
                    className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isComplete
                        ? 'bg-brand-600 text-white'
                        : 'bg-gray-100 text-gray-400'
                    } ${isCurrent ? 'ring-4 ring-brand-100' : ''}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className={`pb-8 ${i === STEPS.length - 1 ? 'pb-0' : ''}`}>
                    <p className={`font-medium ${isComplete ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                    {statusTimestamps[step.key] ? (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(statusTimestamps[step.key]).toLocaleDateString('en-GH', {
                          day: 'numeric', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    ) : isCurrent ? (
                      <p className="text-xs text-brand-600 font-medium mt-0.5">Current status</p>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Shipping Info */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Shipping Details</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400 mb-0.5">Name</p>
            <p className="font-medium text-gray-900">{order.customer_name}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-0.5">Phone</p>
            <p className="font-medium text-gray-900">{order.customer_phone}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-0.5">Email</p>
            <p className="font-medium text-gray-900">{order.customer_email}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-0.5">Region</p>
            <p className="font-medium text-gray-900">{order.region}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-gray-400 mb-0.5">Address</p>
            <p className="font-medium text-gray-900">{order.shipping_address}, {order.city}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
