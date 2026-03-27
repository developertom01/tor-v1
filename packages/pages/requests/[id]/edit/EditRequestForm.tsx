'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Loader2, AlertTriangle, Trash2 } from 'lucide-react'
import { updateMyRequest, deleteMyRequest } from '@tor/lib/actions/products'
import { useToast } from '@tor/ui/Toast'

interface EditRequestFields {
  name: string
  email: string
  phone: string
  desired_date: string
  note: string
}

const inputClass = 'w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none'

export default function EditRequestForm({
  requestId,
  currentStatus,
  defaultValues,
}: {
  requestId: string
  currentStatus: string
  defaultValues: {
    name: string
    email: string
    phone: string
    note: string
    desired_date: string
  }
}) {
  const router = useRouter()
  const { confirm: confirmDialog } = useToast()
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [showRevertWarning, setShowRevertWarning] = useState(false)

  const isNotified = currentStatus === 'notified'

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<EditRequestFields>({
    defaultValues,
  })

  async function onSubmit(data: EditRequestFields) {
    // If notified, show warning first
    if (isNotified && !showRevertWarning) {
      setShowRevertWarning(true)
      return
    }

    setError('')
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([k, v]) => formData.set(k, v))
      await updateMyRequest(requestId, formData)
      router.push('/requests')
    } catch {
      setError('Failed to update request. Please try again.')
    }
  }

  async function handleDelete() {
    const ok = await confirmDialog('Are you sure you want to delete this request? This cannot be undone.')
    if (!ok) return

    setDeleting(true)
    try {
      await deleteMyRequest(requestId)
      router.push('/requests')
    } catch {
      setError('Failed to delete request.')
      setDeleting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Pencil className="w-5 h-5 text-brand-600" />
          <h2 className="text-lg font-semibold text-gray-900">Edit Request</h2>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          Delete
        </button>
      </div>

      {isNotified && showRevertWarning && (
        <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-800">This will revert your request to pending</p>
            <p className="text-sm text-yellow-700 mt-1">
              Your current payment link will be invalidated. The admin will need to notify you again with a new payment link once your changes are reviewed.
            </p>
            <p className="text-sm text-yellow-700 mt-2 font-medium">Click &quot;Save Changes&quot; again to confirm.</p>
          </div>
        </div>
      )}

      {!isNotified && (
        <p className="text-sm text-gray-500 mb-6">Update your request details below.</p>
      )}

      {isNotified && !showRevertWarning && (
        <p className="text-sm text-yellow-600 mb-6">
          This request has been marked as available. Editing will move it back to pending.
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Name</label>
            <input
              {...register('name', { required: true })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
            <input
              {...register('email', { required: true })}
              type="email"
              className={inputClass}
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Phone (optional)</label>
            <input
              {...register('phone')}
              type="tel"
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Desired date (optional)</label>
            <input
              {...register('desired_date')}
              type="date"
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Note (optional)</label>
          <textarea
            {...register('note')}
            rows={3}
            placeholder="Any notes? (e.g. preferred color, length, quantity needed)"
            className={`${inputClass} resize-none`}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full font-bold py-4 rounded-full transition-colors flex items-center justify-center gap-2 ${
            isNotified && showRevertWarning
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
              : 'bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : isNotified && showRevertWarning ? (
            'Confirm & Revert to Pending'
          ) : (
            'Save Changes'
          )}
        </button>
      </form>
    </div>
  )
}
