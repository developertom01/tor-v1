'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ClipboardEdit, ArrowRight } from 'lucide-react'
import { listActiveFormDrafts, type FormDraftRow } from '@tor/lib/actions/drafts'

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function stepLabel(data: Record<string, unknown>) {
  const step = data.step as number | undefined
  if (!step || step <= 1) return 'Step 1 — Customer'
  if (step === 2) return 'Step 2 — Products'
  if (step === 3) return 'Step 3 — Shipping'
  return 'Step 4 — Review'
}

function customerPreview(data: Record<string, unknown>) {
  const formValues = data.formValues as Record<string, string> | undefined
  const selectedCustomer = data.selectedCustomer as { fullName?: string; email?: string } | undefined
  const isNew = data.isNewCustomer as boolean | undefined

  if (isNew && formValues?.customerName) return formValues.customerName
  if (!isNew && selectedCustomer?.fullName) return selectedCustomer.fullName
  return null
}

export default function DraftList({
  initialDrafts,
  initialTotal,
}: {
  initialDrafts: FormDraftRow[]
  initialTotal: number
}) {
  const router = useRouter()
  const [extraDrafts, setExtraDrafts] = useState<FormDraftRow[]>([])
  const [total, setTotal] = useState(initialTotal)
  const [isPending, startTransition] = useTransition()
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [resuming, setResuming] = useState<string | null>(null)

  const allDrafts = [...initialDrafts, ...extraDrafts]
  const hasMore = allDrafts.length < total

  function loadMore() {
    setIsLoadingMore(true)
    startTransition(async () => {
      const result = await listActiveFormDrafts('create_order', allDrafts.length, 10)
      setExtraDrafts((prev) => [...prev, ...result.drafts])
      setTotal(result.total)
      setIsLoadingMore(false)
    })
  }

  function resume(id: string) {
    setResuming(id)
    router.push(`/admin/orders/new?session=${id}`)
  }

  if (allDrafts.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-dashed border-gray-200 p-12 text-center">
        <ClipboardEdit className="w-8 h-8 text-gray-300 mx-auto mb-3" />
        <p className="text-sm font-medium text-gray-500">No drafts in progress</p>
        <p className="text-xs text-gray-400 mt-1">Drafts appear here when an order creation is started but not submitted.</p>
      </div>
    )
  }

  return (
    <>
      <p className="text-xs text-gray-400 mb-2">{total} draft{total !== 1 ? 's' : ''} in progress</p>
      <div className="space-y-3">
        {allDrafts.map((draft) => {
          const customer = customerPreview(draft.data)
          const step = stepLabel(draft.data)
          const isResuming = resuming === draft.id

          return (
            <div
              key={draft.id}
              className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <ClipboardEdit className="w-5 h-5 text-amber-500" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {customer ?? 'Order in progress'}
                  </p>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex-shrink-0">
                    DRAFT
                  </span>
                </div>
                <p className="text-xs text-gray-500">{step}</p>
                <p className="text-xs text-gray-400 mt-0.5">Last saved {timeAgo(draft.updated_at)}</p>
              </div>

              <button
                onClick={() => resume(draft.id)}
                disabled={isResuming}
                className="flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 disabled:opacity-50 px-4 py-2 rounded-xl transition-colors flex-shrink-0"
              >
                {isResuming ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Finish
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )
        })}
      </div>

      {hasMore && (
        <div className="mt-3 text-center">
          <button
            onClick={loadMore}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              `Load more (${allDrafts.length} of ${total})`
            )}
          </button>
        </div>
      )}
    </>
  )
}
