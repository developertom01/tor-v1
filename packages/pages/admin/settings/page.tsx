import { Metadata } from 'next'
import { getStoreSettings } from '@tor/lib/actions/settings'
import { getAdmins } from '@tor/lib/actions/auth'
import { getFeatureFlags } from '@tor/lib/feature-flags'
import SettingsClient from './SettingsClient'
import AdminManager from './AdminManager'

export const metadata: Metadata = {
  title: 'Store Settings',
}

export default async function AdminSettingsPage() {
  const [settings, admins, flags] = await Promise.all([
    getStoreSettings(),
    getAdmins(),
    getFeatureFlags(),
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Store Settings</h1>
      <div className="max-w-2xl space-y-6">
        <SettingsClient
          bypassPayment={settings.bypass_payment}
          onlinePaymentsEnabled={settings.online_payments_enabled}
          onlinePaymentAllowed={flags.online_payment}
        />
        <AdminManager admins={admins} />
      </div>
    </div>
  )
}
