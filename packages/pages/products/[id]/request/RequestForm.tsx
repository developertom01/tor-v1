'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Loader2, Sparkles } from 'lucide-react'
import { requestProduct } from '@tor/lib/actions/products'

interface RequestFields {
  name: string
  email: string
  phone: string
  desired_date: string
  note: string
}

const inputClass = 'w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none'

export default function RequestForm({
  productId,
  productSlug,
  isCustom,
  user,
}: {
  productId: string
  productSlug: string
  isCustom: boolean
  user: { name: string; email: string }
}) {
  const router = useRouter()
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<RequestFields>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  })

  async function onSubmit(data: RequestFields) {
    setError('')
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([k, v]) => formData.set(k, v))
      formData.set('product_id', productId)
      const result = await requestProduct(formData)

      if (result.existingRequestId) {
        router.push(`/requests/${result.existingRequestId}/edit`)
        return
      }

      router.push('/requests')
    } catch {
      setError('Failed to submit request. Please try again.')
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-2">
        {isCustom ? <Sparkles className="w-5 h-5 text-brand-600" /> : <Bell className="w-5 h-5 text-brand-600" />}
        <h2 className="text-lg font-semibold text-gray-900">
          {isCustom ? 'Request Custom Order' : 'Request This Product'}
        </h2>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        {isCustom
          ? 'Tell us your preferred specifications (color, length, style) and desired delivery date. We\'ll get back to you.'
          : 'This item is currently out of stock. Leave your details and we\'ll notify you when it\'s available.'}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Name</label>
            <input
              {...register('name', { required: true })}
              placeholder="Your name"
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
            <input
              {...register('email', { required: true })}
              type="email"
              placeholder="Email address"
              className={inputClass}
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Phone (optional)</label>
            <input
              {...register('phone')}
              type="tel"
              placeholder="Phone number"
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Desired date (optional)</label>
            <input
              {...register('desired_date')}
              type="date"
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            {isCustom ? 'Specifications' : 'Note (optional)'}
          </label>
          <textarea
            {...register('note', { required: isCustom })}
            rows={3}
            placeholder={isCustom
              ? 'Describe what you want (e.g. color, length, style, quantity)'
              : 'Any notes? (e.g. preferred color, length, quantity needed)'}
            className={`${inputClass} resize-none`}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-full transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              {isCustom ? <Sparkles className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
              {isCustom ? 'Submit Custom Order Request' : 'Submit Request'}
            </>
          )}
        </button>
      </form>
    </div>
  )
}
