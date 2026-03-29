import { supabaseAdmin } from '@tor/lib/supabase/admin'
import { resendVerificationEmail } from '@tor/lib/actions/auth'
import { CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  if (!token) {
    return <Result success={false} message="Invalid verification link." />
  }

  const storeId = process.env.NEXT_PUBLIC_STORE_ID!

  const { data: record } = await supabaseAdmin
    .from('email_verification_tokens')
    .select('user_id, expires_at')
    .eq('token', token)
    .eq('store_id', storeId)
    .single()

  if (!record) {
    return <Result success={false} message="This verification link is invalid or has already been used." />
  }

  if (new Date(record.expires_at) < new Date()) {
    // Look up the email so we can offer a resend
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('email')
      .eq('id', record.user_id)
      .eq('store_id', storeId)
      .single()

    return <ExpiredResult email={profile?.email ?? ''} />
  }

  await supabaseAdmin
    .from('profiles')
    .update({ email_verified: true })
    .eq('id', record.user_id)
    .eq('store_id', storeId)

  await supabaseAdmin
    .from('email_verification_tokens')
    .delete()
    .eq('token', token)

  return <Result success={true} message="Your email has been verified. You can now sign in." />
}

function Result({ success, message }: { success: boolean; message: string }) {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${success ? 'bg-green-50' : 'bg-red-50'}`}>
        {success
          ? <CheckCircle className="w-8 h-8 text-green-600" />
          : <XCircle className="w-8 h-8 text-red-500" />
        }
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">
        {success ? 'Email Verified' : 'Verification Failed'}
      </h1>
      <p className="text-gray-500 mb-8">{message}</p>
      <Link
        href="/auth"
        className="inline-block bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
      >
        {success ? 'Sign In' : 'Back to Sign In'}
      </Link>
    </div>
  )
}

async function resendAction(formData: FormData) {
  'use server'
  const email = formData.get('email') as string
  if (email) await resendVerificationEmail(email)
}

function ExpiredResult({ email }: { email: string }) {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-6">
        <span className="text-2xl">⚠</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">Link Expired</h1>
      <p className="text-gray-500 mb-6">
        This verification link has expired. Request a new one and we'll send it to your inbox right away.
      </p>
      <form action={resendAction}>
        <input type="hidden" name="email" value={email} />
        <button
          type="submit"
          className="bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
        >
          Send new verification link
        </button>
      </form>
      <p className="mt-4">
        <Link href="/auth/login" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
          Back to Sign In
        </Link>
      </p>
    </div>
  )
}
