import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Package } from 'lucide-react'
import { handleCheckoutSuccess } from '@tor/lib/actions/orders'

export const metadata: Metadata = {
  title: 'Order Confirmed',
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>
}) {
  const params = await searchParams
  const reference = params.reference

  let order = null
  let verifyError = false
  if (reference) {
    try {
      order = await handleCheckoutSuccess(reference)
    } catch {
      verifyError = true
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Confirmed!</h1>
      <p className="text-gray-500 text-lg mb-2">
        Thank you for your order!
      </p>
      {order && (
        <div className="bg-gray-50 rounded-2xl p-6 mt-8 text-left">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-brand-600" />
            <h2 className="font-semibold text-gray-900">Order Details</h2>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-500">Reference:</span> <span className="font-mono">{reference}</span></p>
            <p><span className="text-gray-500">Name:</span> {order.customer_name}</p>
            <p><span className="text-gray-500">Email:</span> {order.customer_email}</p>
            <p><span className="text-gray-500">Status:</span> <span className="capitalize font-semibold text-green-600">{order.status}</span></p>
          </div>
        </div>
      )}
      {verifyError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-6 text-sm text-yellow-800">
          We couldn&apos;t verify your payment right now. Don&apos;t worry — if you paid, your order will be confirmed shortly. Contact us at <a href="tel:+233542203839" className="font-semibold underline">+233 54 220 3839</a> if you need help.
        </div>
      )}
      <Link
        href="/products"
        className="mt-8 inline-flex items-center gap-2 bg-brand-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-brand-700 transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  )
}
