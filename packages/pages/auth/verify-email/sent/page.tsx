import { Mail } from 'lucide-react'
import Link from 'next/link'

export default function VerifyEmailSentPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <Mail className="w-8 h-8 text-brand-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">Check your email</h1>
      <p className="text-gray-500 mb-8">
        We&apos;ve sent a verification link to your email address. Click the link to verify your account and start shopping.
      </p>
      <p className="text-sm text-gray-400 mb-6">The link expires in 24 hours.</p>
      <Link
        href="/auth"
        className="inline-flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-700 text-sm"
      >
        Back to Sign In
      </Link>
    </div>
  )
}
