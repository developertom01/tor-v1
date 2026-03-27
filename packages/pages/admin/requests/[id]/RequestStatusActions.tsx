'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, Loader2 } from 'lucide-react'
import { updateRequestStatus } from '@tor/lib/actions/products'
import { useToast } from '@tor/ui/Toast'

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  notified: { label: 'Notified — Awaiting Payment', color: 'bg-blue-100 text-blue-700' },
  paid: { label: 'Paid — Converted to Order', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
}

export default function RequestStatusActions({ requestId, currentStatus }: { requestId: string; currentStatus: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const sc = statusConfig[currentStatus] || statusConfig.pending

  async function handleUpdate(status: string) {
    setLoading(true)
    try {
      await updateRequestStatus(requestId, status)
      router.refresh()
    } catch {
      toast('Failed to update status', 'error')
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-3">
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${sc.color}`}>
        {sc.label}
      </span>

      {loading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}

      {!loading && currentStatus === 'pending' && (
        <>
          <button
            onClick={() => handleUpdate('notified')}
            className="flex items-center gap-1.5 text-sm font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            Mark Notified
          </button>
          <button
            onClick={() => handleUpdate('cancelled')}
            className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Cancel
          </button>
        </>
      )}

      {!loading && currentStatus === 'notified' && (
        <button
          onClick={() => handleUpdate('pending')}
          className="text-sm font-medium text-gray-600 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          Revert to Pending
        </button>
      )}

      {!loading && currentStatus === 'cancelled' && (
        <button
          onClick={() => handleUpdate('pending')}
          className="text-sm font-medium text-gray-600 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          Reopen
        </button>
      )}
    </div>
  )
}
