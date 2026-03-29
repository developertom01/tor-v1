'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { createFormDraft } from '@tor/lib/actions/drafts'

export default function StartOrderButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function start() {
    setLoading(true)
    try {
      const sessionId = await createFormDraft('create_order', {})
      router.push(`/admin/orders/new?session=${sessionId}`)
    } catch {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={start}
      disabled={loading}
      className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-semibold px-4 py-2 rounded-full text-sm transition-colors"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '+'}
      Create Order
    </button>
  )
}
