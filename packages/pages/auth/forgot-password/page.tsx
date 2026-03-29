import { Metadata } from 'next'
import { getSession } from '@tor/lib/actions/auth'
import { redirect } from 'next/navigation'
import AuthClient from '../AuthClient'

export const metadata: Metadata = {
  title: 'Reset Password',
}

export default async function ForgotPasswordPage() {
  const user = await getSession()
  if (user) redirect('/')

  return <AuthClient defaultMode="forgot" />
}
