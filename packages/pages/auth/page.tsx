import { Metadata } from 'next'
import { getSession, getProfile } from '@tor/lib/actions/auth'
import AuthClient from './AuthClient'
import SignOutButton from './SignOutButton'
import Link from 'next/link'
import { User, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'My Account',
}

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const params = await searchParams
  const user = await getSession()
  const profile = await getProfile()

  if (!user) {
    return <AuthClient redirectTo={params.redirect} />
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center">
            <User className="w-7 h-7 text-brand-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{profile?.full_name || 'Welcome!'}</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        {profile?.role === 'admin' && (
          <Link
            href="/admin"
            className="flex items-center gap-3 bg-brand-50 hover:bg-brand-100 rounded-xl p-4 transition-colors mb-4"
          >
            <ShieldCheck className="w-5 h-5 text-brand-600" />
            <div>
              <p className="font-semibold text-gray-900">Admin Dashboard</p>
              <p className="text-sm text-gray-500">Manage products, orders, and inventory</p>
            </div>
          </Link>
        )}

        <SignOutButton />
      </div>
    </div>
  )
}
