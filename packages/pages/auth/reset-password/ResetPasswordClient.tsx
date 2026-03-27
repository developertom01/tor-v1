'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { updatePassword } from '@tor/lib/actions/auth'
import { Sparkles, Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react'

interface ResetFields {
  password: string
  confirm_password: string
}

const inputClass = 'w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none'

export default function ResetPasswordClient() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { isSubmitting }, watch } = useForm<ResetFields>()
  const password = watch('password')

  async function onSubmit(data: ResetFields) {
    setError('')
    const result = await updatePassword(data.password)
    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/'), 2000)
    }
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Updated</h1>
        <p className="text-gray-500">Your password has been reset successfully. Redirecting...</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="text-center mb-8">
        <Sparkles className="w-12 h-12 text-brand-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900">Set New Password</h1>
        <p className="mt-2 text-gray-500">Enter your new password below</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="relative">
          <input
            {...register('password', { required: true, minLength: 6 })}
            type={showPassword ? 'text' : 'password'}
            placeholder="New Password"
            className={`${inputClass} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        <input
          {...register('confirm_password', {
            required: true,
            validate: (value) => value === password || 'Passwords do not match',
          })}
          type={showPassword ? 'text' : 'password'}
          placeholder="Confirm New Password"
          className={inputClass}
        />
        <p className="text-xs text-gray-400">Minimum 6 characters</p>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-semibold py-3.5 rounded-full transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Updating...</> : 'Update Password'}
        </button>
      </form>
    </div>
  )
}
