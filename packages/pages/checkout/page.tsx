import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession, getProfile } from '@tor/lib/actions/auth'
import { getStoreSettings } from '@tor/lib/actions/settings'
import CheckoutClient from './CheckoutClient'

export const metadata: Metadata = {
  title: 'Checkout',
}

export default async function CheckoutPage() {
  const user = await getSession()

  if (!user) {
    redirect('/auth?redirect=/checkout')
  }

  const [profile, settings] = await Promise.all([getProfile(), getStoreSettings()])

  return (
    <CheckoutClient
      user={{
        email: user.email || '',
        name: profile?.full_name || user.user_metadata?.full_name || '',
        phone: user.phone || '',
      }}
      bypassPayment={settings.bypass_payment}
      onlinePaymentsEnabled={settings.online_payments_enabled}
    />
  )
}
