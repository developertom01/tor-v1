import { Metadata } from 'next'
import { getSession } from '@tor/lib/actions/auth'
import { redirect } from 'next/navigation'
import AuthClient from '../AuthClient'

export const metadata: Metadata = {
  title: 'Create Account',
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const params = await searchParams
  const user = await getSession()
  if (user) redirect(params.redirect || '/')

  return <AuthClient defaultMode="signup" redirectTo={params.redirect} />
}
