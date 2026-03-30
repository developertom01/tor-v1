'use client'

import { useState } from 'react'
import { updateStoreSettings } from '@tor/lib/actions/settings'
import { useToast } from '@tor/ui/Toast'
import { Loader2, AlertTriangle } from 'lucide-react'
import Dialog, { DialogBody, DialogFooter } from '@tor/ui/Dialog'

interface Props {
  bypassPayment: boolean
  onlinePaymentsEnabled: boolean
  onlinePaymentAllowed: boolean
}

export default function SettingsClient({ bypassPayment, onlinePaymentsEnabled, onlinePaymentAllowed }: Props) {
  const [bypass, setBypass] = useState(bypassPayment)
  const [onlineEnabled, setOnlineEnabled] = useState(onlinePaymentsEnabled)
  const [savingBypass, setSavingBypass] = useState(false)
  const [savingOnline, setSavingOnline] = useState(false)
  const [enableDialog, setEnableDialog] = useState<{ disableBypass: boolean } | null>(null)
  const { toast, confirm } = useToast()

  async function handleBypassToggle() {
    const newValue = !bypass

    if (newValue) {
      const ok = await confirm(
        'Are you sure? Customers will be able to place orders without paying. You will need to manually mark each order as paid.'
      )
      if (!ok) return
    } else if (!onlineEnabled) {
      const ok = await confirm(
        'Online payments are currently disabled. Turning off bypass too means customers cannot place orders at all. Are you sure?'
      )
      if (!ok) return
    }

    setSavingBypass(true)
    try {
      await updateStoreSettings({ bypass_payment: newValue })
      setBypass(newValue)
      toast(newValue ? 'Payment bypass enabled' : 'Payment bypass disabled', 'success')
    } catch {
      toast('Failed to update setting', 'error')
    }
    setSavingBypass(false)
  }

  async function handleOnlineToggle() {
    const newValue = !onlineEnabled

    if (!newValue) {
      const ok = await confirm(
        'This will disable all online payments (Paystack). Customers will only be able to place orders without paying. You will need to collect payment manually or use the "Request Payment" feature on each order. Are you sure?'
      )
      if (!ok) return
    }

    if (newValue && bypass) {
      // Re-enabling online payments while bypass is on — ask if they want to also disable bypass
      setEnableDialog({ disableBypass: true })
      return
    }

    await applyOnlineToggle(newValue, false)
  }

  async function applyOnlineToggle(enable: boolean, alsoDisableBypass: boolean) {
    setSavingOnline(true)
    try {
      if (!enable) {
        // Disabling online payments automatically enables bypass
        await updateStoreSettings({ online_payments_enabled: false, bypass_payment: true })
        setOnlineEnabled(false)
        setBypass(true)
      } else if (alsoDisableBypass) {
        await updateStoreSettings({ online_payments_enabled: true, bypass_payment: false })
        setOnlineEnabled(true)
        setBypass(false)
      } else {
        await updateStoreSettings({ online_payments_enabled: true })
        setOnlineEnabled(true)
      }
      toast(enable ? 'Online payments enabled' : 'Online payments disabled', 'success')
    } catch {
      toast('Failed to update setting', 'error')
    }
    setSavingOnline(false)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
      <div>
        <h2 className="font-semibold text-gray-900 mb-1">Payment</h2>
        <p className="text-sm text-gray-500">Control how customers pay for orders.</p>
      </div>

      {/* Online Payments Toggle */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Online Payments (Paystack)</p>
            <p className="text-sm text-gray-500">
              Allow customers to pay online at checkout via Paystack.
            </p>
          </div>
          <div className="relative group">
            <button
              onClick={handleOnlineToggle}
              disabled={savingOnline || !onlinePaymentAllowed}
              className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors ${
                onlineEnabled ? 'bg-brand-600' : 'bg-gray-200'
              } ${savingOnline || !onlinePaymentAllowed ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {savingOnline ? (
                <Loader2 className="w-4 h-4 animate-spin mx-auto text-white" />
              ) : (
                <span
                  className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    onlineEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              )}
            </button>
            {!onlinePaymentAllowed && (
              <div className="absolute right-0 bottom-9 z-10 hidden group-hover:block w-56 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg">
                Online Payments is temporarily not available.
                <div className="absolute right-3 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900" />
              </div>
            )}
          </div>
        </div>
        {!onlineEnabled && (
          <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700">
              Online payments are disabled. All orders will be placed without payment. Use &quot;Request Payment&quot; on individual orders or collect payment manually.
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-gray-100" />

      {/* Bypass Payment Toggle */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Bypass Payment at Checkout</p>
            <p className="text-sm text-gray-500">
              When enabled, customers can place orders without paying at checkout.
            </p>
          </div>
          <button
            onClick={handleBypassToggle}
            disabled={savingBypass}
            className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors ${
              bypass ? 'bg-brand-600' : 'bg-gray-200'
            } ${savingBypass ? 'opacity-50' : 'cursor-pointer'}`}
          >
            {savingBypass ? (
              <Loader2 className="w-4 h-4 animate-spin mx-auto text-white" />
            ) : (
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  bypass ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            )}
          </button>
        </div>
      </div>

      {/* Enable Online Payments dialog */}
      <Dialog open={!!enableDialog} onClose={() => setEnableDialog(null)} title="Enable Online Payments">
        <DialogBody>
          <p className="text-sm text-gray-600 mb-4">
            Customers will be able to pay online via Paystack at checkout.
          </p>
          <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={enableDialog?.disableBypass ?? true}
              onChange={(e) => setEnableDialog({ disableBypass: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">Disable bypass payment</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Customers must pay online to complete an order. Uncheck to keep both options available.
              </p>
            </div>
          </label>
        </DialogBody>
        <DialogFooter>
          <button
            onClick={() => setEnableDialog(null)}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              const disableBypass = enableDialog?.disableBypass ?? true
              setEnableDialog(null)
              await applyOnlineToggle(true, disableBypass)
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
          >
            Enable
          </button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}
