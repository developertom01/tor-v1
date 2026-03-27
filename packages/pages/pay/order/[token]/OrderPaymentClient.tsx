'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CreditCard } from 'lucide-react'
import { usePaystack } from '@tor/lib/usePaystack'
import { completeOrderPayment } from '@tor/lib/actions/orders'
import { formatPrice } from '@tor/lib/utils'

export default function OrderPaymentClient({
  token,
  email,
  amount,
  reference,
}: {
  token: string
  email: string
  amount: number
  reference: string
}) {
  const router = useRouter()
  const { pay } = usePaystack()
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')

  async function handlePay() {
    setPaying(true)
    setError('')

    try {
      await pay({
        email,
        amount,
        reference,
        onSuccess: async () => {
          await completeOrderPayment(token)
          router.push(`/checkout/success?reference=${reference}`)
        },
        onClose: () => {
          setPaying(false)
        },
      })
    } catch {
      setError('Something went wrong. Please try again.')
      setPaying(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <button
        onClick={handlePay}
        disabled={paying}
        className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-full transition-colors flex items-center justify-center gap-2"
      >
        {paying ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
        ) : (
          <><CreditCard className="w-5 h-5" /> Pay {formatPrice(amount)}</>
        )}
      </button>
    </div>
  )
}
