'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Check, X, Loader2 } from 'lucide-react'
import { updateRequestPrice } from '@tor/lib/actions/products'
import { formatPrice } from '@tor/lib/utils'
import { useToast } from '@tor/ui/Toast'

export default function RequestPriceEditor({
  requestId,
  currentPrice,
  productPrice,
  disabled,
}: {
  requestId: string
  currentPrice: number
  productPrice: number
  disabled: boolean
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [editing, setEditing] = useState(false)
  const [price, setPrice] = useState(currentPrice.toString())
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    const parsed = parseFloat(price)
    if (isNaN(parsed) || parsed <= 0) return

    setSaving(true)
    try {
      await updateRequestPrice(requestId, parsed)
      setEditing(false)
      router.refresh()
    } catch {
      toast('Failed to update price', 'error')
    }
    setSaving(false)
  }

  if (disabled) {
    return (
      <div>
        <p className="text-xs text-gray-400 mb-1">Request Price</p>
        <p className="text-2xl font-bold text-gray-400">{formatPrice(currentPrice)}</p>
      </div>
    )
  }

  if (editing) {
    return (
      <div>
        <p className="text-xs text-gray-400 mb-1">Request Price</p>
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">GH₵</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-36 pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-lg font-bold focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              autoFocus
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          </button>
          <button
            onClick={() => { setEditing(false); setPrice(currentPrice.toString()) }}
            className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {currentPrice !== productPrice && (
          <p className="text-xs text-gray-400 mt-1">
            Original product price: {formatPrice(productPrice)}
          </p>
        )}
      </div>
    )
  }

  return (
    <div>
      <p className="text-xs text-gray-400 mb-1">Request Price</p>
      <div className="flex items-center gap-2">
        <p className="text-2xl font-bold text-gray-900">{formatPrice(currentPrice)}</p>
        <button
          onClick={() => setEditing(true)}
          className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
          title="Edit price"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      </div>
      {currentPrice !== productPrice && (
        <p className="text-xs text-gray-400 mt-0.5">
          Original: {formatPrice(productPrice)}
        </p>
      )}
    </div>
  )
}
