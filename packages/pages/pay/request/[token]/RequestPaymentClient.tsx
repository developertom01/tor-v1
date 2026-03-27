'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Loader2, MapPin, Info } from 'lucide-react'
import Select from '@tor/ui/Select'
import { prepareRequestPayment, completeRequestPayment } from '@tor/lib/actions/products'
import { formatPrice } from '@tor/lib/utils'
import { usePaystack } from '@tor/lib/usePaystack'

interface PaymentFields {
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

export default function RequestPaymentClient({
  token,
  product,
  customer,
  bypassPayment,
}: {
  token: string
  product: { name: string; price: number }
  customer: { name: string; email: string; phone: string }
  bypassPayment?: boolean
}) {
  const router = useRouter()
  const { pay } = usePaystack()
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [mode, setMode] = useState<'pay' | 'bypass'>('pay')

  const { register, handleSubmit, control, formState: { isSubmitting } } = useForm<PaymentFields>({
    defaultValues: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    },
  })

  const total = product.price * quantity

  async function onSubmit(data: PaymentFields) {
    setError('')
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([k, v]) => formData.set(k, v))
      formData.set('quantity', quantity.toString())

      const { reference, amount, email } = await prepareRequestPayment(token, quantity)

      if (mode === 'bypass') {
        await completeRequestPayment(token, formData, reference)
        router.push(`/checkout/success?reference=${reference}`)
        return
      }

      await pay({
        email,
        amount,
        reference,
        onSuccess: () => {
          completeRequestPayment(token, formData, reference).then(() => {
            router.push(`/checkout/success?reference=${reference}`)
          })
        },
        onClose: () => {},
      })
    } catch (err) {
      console.error('Payment error:', err)
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Contact Information</h2>
      <input {...register('name', { required: true })} placeholder="Full Name" className={inputClass} />
      <input {...register('email', { required: true })} type="email" placeholder="Email Address" className={inputClass} />
      <input {...register('phone', { required: true })} type="tel" placeholder="Phone Number" className={inputClass} />

      <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Shipping Address</h2>
      <input {...register('address', { required: true })} placeholder="Street Address / Landmark" className={inputClass} />
      <div className="grid grid-cols-2 gap-4">
        <input {...register('city', { required: true })} placeholder="City" className={inputClass} />
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

      {/* Quantity */}
      <div className="border-t border-gray-100 pt-4 mt-4">
        <label className="text-sm font-medium text-gray-700 mb-2 block">Quantity</label>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-200 rounded-full">
            <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900">-</button>
            <span className="w-10 text-center font-semibold">{quantity}</span>
            <button type="button" onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900">+</button>
          </div>
          <span className="text-sm text-gray-500">
            {quantity} × {formatPrice(product.price)} = <span className="font-semibold text-gray-900">{formatPrice(total)}</span>
          </span>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        onClick={() => setMode('pay')}
        className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-full transition-colors flex items-center justify-center gap-2 mt-4"
      >
        {isSubmitting && mode === 'pay' ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
        ) : (
          `Pay ${formatPrice(total)}`
        )}
      </button>

      {bypassPayment && (
        <div className="relative mt-2">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white text-gray-400">or</span>
          </div>
        </div>
      )}

      {bypassPayment && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">
              You can also place this order without paying now. Payment will be arranged directly between you and the store.
            </p>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            onClick={() => setMode('bypass')}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-full transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting && mode === 'bypass' ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Placing Order...</>
            ) : (
              'Place Order Without Payment'
            )}
          </button>
        </div>
      )}
    </form>
  )
}
