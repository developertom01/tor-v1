'use client'

import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useCart } from '@tor/lib/cart-context'
import { createOrder } from '@tor/lib/actions/orders'
import { formatPrice } from '@tor/lib/utils'
import { usePaystack } from '@tor/lib/usePaystack'
import Link from 'next/link'
import { ArrowLeft, Loader2, MapPin, Info } from 'lucide-react'
import Select from '@tor/ui/Select'
import { useState } from 'react'

interface CheckoutUser {
  email: string
  name: string
  phone: string
}

interface CheckoutFields {
  name: string
  email: string
  phone: string
  address: string
  city: string
  region: string
}

const inputClass = 'w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none'

const REGIONS = [
  'Greater Accra', 'Ashanti', 'Western', 'Central', 'Eastern',
  'Volta', 'Northern', 'Upper East', 'Upper West', 'Bono',
  'Bono East', 'Ahafo', 'Savannah', 'North East', 'Oti', 'Western North',
]

export default function CheckoutClient({ user, bypassPayment, onlinePaymentsEnabled = true }: { user: CheckoutUser; bypassPayment?: boolean; onlinePaymentsEnabled?: boolean }) {
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const { pay } = usePaystack()
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'pay' | 'bypass'>('pay')

  const { register, handleSubmit, control, formState: { isSubmitting, errors } } = useForm<CheckoutFields>({
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  })

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">No items to checkout</h1>
        <Link href="/products" className="text-brand-600 font-semibold hover:text-brand-700">
          Continue Shopping
        </Link>
      </div>
    )
  }

  async function onSubmit(data: CheckoutFields) {
    setError('')
    try {
      const form = new FormData()
      Object.entries(data).forEach(([k, v]) => form.set(k, v))

      const { reference } = await createOrder(form, items, totalPrice)

      if (mode === 'bypass') {
        clearCart()
        router.push(`/checkout/success?reference=${reference}`)
        return
      }

      await pay({
        email: data.email,
        amount: totalPrice,
        reference,
        onSuccess: () => {
          clearCart()
          router.push(`/checkout/success?reference=${reference}`)
        },
        onClose: () => {},
      })
    } catch {
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Link href="/cart" className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid md:grid-cols-5 gap-8">
        <form onSubmit={handleSubmit(onSubmit)} className="md:col-span-3 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Contact Information</h2>
          <div>
            <input {...register('name', { required: 'Name is required' })} placeholder="Full Name" className={inputClass} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <input {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } })} type="email" placeholder="Email Address" className={inputClass} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <input {...register('phone', { required: 'Phone number is required', pattern: { value: /^0[2-9]\d{8}$/, message: 'Enter a valid Ghana phone number (e.g. 0542203839)' } })} type="tel" placeholder="Phone Number (e.g. 0542203839)" className={inputClass} />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Shipping Address</h2>
          <input {...register('address', { required: 'Address is required' })} placeholder="Street Address / Landmark" className={inputClass} />
          <div className="grid grid-cols-2 gap-4">
            <input {...register('city', { required: 'City is required' })} placeholder="City" className={inputClass} />
            <Controller
              name="region"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select Region"
                  options={REGIONS.map((r) => ({ value: r, label: r, icon: <MapPin className="w-4 h-4" /> }))}
                />
              )}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {onlinePaymentsEnabled && (
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={() => setMode('pay')}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-full transition-colors flex items-center justify-center gap-2 mt-4"
            >
              {isSubmitting && mode === 'pay' ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
              ) : (
                `Pay ${formatPrice(totalPrice)}`
              )}
            </button>
          )}

          {onlinePaymentsEnabled && bypassPayment && (
            <div className="relative mt-2">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-400">or</span>
              </div>
            </div>
          )}

          {(bypassPayment || !onlinePaymentsEnabled) && (
            <div className={`${!onlinePaymentsEnabled ? 'mt-4' : ''} bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3`}>
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700">
                  {!onlinePaymentsEnabled
                    ? 'Online payment is currently unavailable. Place your order and the store will arrange payment with you.'
                    : 'You can also place this order without paying now. Payment will be arranged directly between you and the store.'}
                </p>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                onClick={() => setMode('bypass')}
                className={`w-full ${!onlinePaymentsEnabled ? 'bg-brand-600 hover:bg-brand-700' : 'bg-amber-600 hover:bg-amber-700'} disabled:bg-gray-300 text-white font-bold py-3 rounded-full transition-colors flex items-center justify-center gap-2`}
              >
                {isSubmitting && mode === 'bypass' ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Placing Order...</>
                ) : (
                  !onlinePaymentsEnabled ? `Place Order — ${formatPrice(totalPrice)}` : 'Place Order Without Payment'
                )}
              </button>
            </div>
          )}
        </form>

        {/* Order Summary */}
        <div className="md:col-span-2">
          <div className="bg-gray-50 rounded-2xl p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={`${item.product.id}:${item.variant?.id || ''}`} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.product.name}{item.variant ? ` - ${item.variant.name}` : ''} x{item.quantity}
                  </span>
                  <span className="font-medium">{formatPrice((item.variant?.price ?? item.product.price) * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-lg">{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
