'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Clock, CreditCard, Cog, Truck, PackageCheck, XCircle,
  ArrowRight, AlertTriangle, Loader2, HandCoins, Send, Copy, Check,
  Upload, FileText, X,
} from 'lucide-react'
import { updateOrderStatus, markOrderPaidManually, cancelOrder, requestOrderPayment } from '@tor/lib/actions/orders'
import { useToast } from '@tor/ui/Toast'
import { createClient } from '@tor/lib/supabase/client'

const FLOW = [
  { status: 'pending', label: 'Pending', icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
  { status: 'paid', label: 'Paid', icon: CreditCard, color: 'text-green-600 bg-green-50' },
  { status: 'processing', label: 'Processing', icon: Cog, color: 'text-blue-600 bg-blue-50' },
  { status: 'shipped', label: 'Shipped', icon: Truck, color: 'text-purple-600 bg-purple-50' },
  { status: 'delivered', label: 'Delivered', icon: PackageCheck, color: 'text-green-700 bg-green-50' },
]

const NEXT_ACTIONS: Record<string, { label: string; description: string }> = {
  pending: { label: 'Mark as Paid', description: 'Confirm payment was received' },
  paid: { label: 'Start Processing', description: 'Begin preparing the order' },
  processing: { label: 'Mark as Shipped', description: 'Order is on the way' },
  shipped: { label: 'Mark as Delivered', description: 'Customer received the order' },
}

const PAID_STATUSES = ['paid', 'processing', 'shipped', 'delivered']

export default function OrderStatusUpdate({
  orderId,
  currentStatus,
  paidManually,
  paymentToken,
  onlinePaymentAllowed,
}: {
  orderId: string
  currentStatus: string
  paidManually?: boolean
  paymentToken?: string | null
  onlinePaymentAllowed?: boolean
}) {
  const [saving, setSaving] = useState(false)
  const [showCancel, setShowCancel] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelling, setCancelling] = useState(false)
  const [requestingPayment, setRequestingPayment] = useState(false)
  const [showProofUpload, setShowProofUpload] = useState(false)
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [proofPreviewUrl, setProofPreviewUrl] = useState<string>('')
  const [proofUploading, setProofUploading] = useState(false)
  const [proofUrl, setProofUrl] = useState<string>('')
  const [paymentLink, setPaymentLink] = useState(
    paymentToken ? `${typeof window !== 'undefined' ? window.location.origin : ''}/pay/order/${paymentToken}` : ''
  )
  const [copied, setCopied] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const isCancelled = currentStatus === 'cancelled'
  const isDelivered = currentStatus === 'delivered'
  const currentStep = FLOW.find((s) => s.status === currentStatus)
  const currentIndex = FLOW.findIndex((s) => s.status === currentStatus)
  const nextAction = NEXT_ACTIONS[currentStatus]
  const needsRefundWarning = PAID_STATUSES.includes(currentStatus)

  async function handleNextStep() {
    const nextStatus = FLOW[currentIndex + 1]?.status
    if (!nextStatus) return

    setSaving(true)
    try {
      if (currentStatus === 'pending') {
        if (!showProofUpload) {
          setShowProofUpload(true)
          setSaving(false)
          return
        }
        await markOrderPaidManually(orderId, proofUrl || undefined)
      } else {
        await updateOrderStatus(orderId, nextStatus)
      }
      router.refresh()
      toast(`Order moved to ${FLOW[currentIndex + 1].label}`, 'success')
    } catch {
      toast('Failed to update status', 'error')
    }
    setSaving(false)
  }

  async function handleProofFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      toast('File too large — max 10MB', 'error')
      return
    }

    setProofFile(file)
    setProofUrl('')

    // Preview URL for images
    if (file.type.startsWith('image/')) {
      setProofPreviewUrl(URL.createObjectURL(file))
    } else {
      setProofPreviewUrl('')
    }

    // Upload immediately on select
    setProofUploading(true)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop() ?? 'bin'
      const path = `orders/${orderId}/manual-payment-proof.${ext}`
      const { error } = await supabase.storage
        .from('products')
        .upload(path, file, { upsert: true, contentType: file.type })

      if (error) throw error

      const { data } = supabase.storage.from('products').getPublicUrl(path)
      setProofUrl(data.publicUrl)
      toast('Proof uploaded', 'success')
    } catch {
      toast('Upload failed — try again', 'error')
      setProofFile(null)
      setProofPreviewUrl('')
    }
    setProofUploading(false)
  }

  async function handleRequestPayment() {
    setRequestingPayment(true)
    try {
      const { paymentUrl } = await requestOrderPayment(orderId)
      setPaymentLink(paymentUrl)
      router.refresh()
      toast('Payment request sent to customer', 'success')
    } catch {
      toast('Failed to request payment', 'error')
    }
    setRequestingPayment(false)
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText(paymentLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleCancel() {
    if (!cancelReason.trim()) return

    setCancelling(true)
    try {
      await cancelOrder(orderId, cancelReason.trim())
      router.refresh()
      toast('Order cancelled', 'success')
      setShowCancel(false)
    } catch {
      toast('Failed to cancel order', 'error')
    }
    setCancelling(false)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="font-semibold text-gray-900 mb-4">Order Status</h2>

      {/* Current status badge */}
      {currentStep && !isCancelled && (
        <div className="mb-4">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${currentStep.color}`}>
            <currentStep.icon className="w-4 h-4" />
            {currentStep.label}
          </div>
          {paidManually && (
            <p className="text-xs text-yellow-600 mt-2 flex items-center gap-1">
              <HandCoins className="w-3.5 h-3.5" />
              Payment was marked manually by admin
            </p>
          )}
        </div>
      )}

      {isCancelled && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-red-600 bg-red-50 mb-4">
          <XCircle className="w-4 h-4" />
          Cancelled
        </div>
      )}

      {/* Progress steps */}
      {!isCancelled && (
        <div className="flex items-center gap-1 mb-5">
          {FLOW.map((step, i) => (
            <div
              key={step.status}
              className={`h-1.5 flex-1 rounded-full ${
                i <= currentIndex ? 'bg-brand-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      )}

      {/* Next action button */}
      {nextAction && !isCancelled && (
        <button
          onClick={handleNextStep}
          disabled={saving}
          className="w-full flex items-center justify-between gap-3 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-semibold py-3 px-4 rounded-xl transition-colors mb-3"
        >
          <div className="text-left">
            <span className="flex items-center gap-2">
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : currentStatus === 'pending' ? (
                <HandCoins className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              {nextAction.label}
            </span>
            <span className="text-xs text-white/70 font-normal">{nextAction.description}</span>
          </div>
          <ArrowRight className="w-4 h-4 flex-shrink-0" />
        </button>
      )}

      {/* Payment proof upload — shown when marking as paid */}
      {showProofUpload && currentStatus === 'pending' && (
        <div className="border border-brand-200 rounded-xl p-4 mb-3 bg-brand-50">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-800">Upload Payment Proof</p>
            <button
              onClick={() => { setShowProofUpload(false); setProofFile(null); setProofPreviewUrl(''); setProofUrl('') }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-brand-300 rounded-lg p-4 cursor-pointer hover:bg-brand-100 transition-colors">
            <input
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={handleProofFileChange}
              disabled={proofUploading}
            />
            {proofUploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
            ) : proofPreviewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={proofPreviewUrl} alt="proof preview" className="w-full max-h-32 object-contain rounded" />
            ) : proofFile ? (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <FileText className="w-5 h-5 text-brand-600" />
                <span className="truncate max-w-[160px]">{proofFile.name}</span>
              </div>
            ) : (
              <>
                <Upload className="w-6 h-6 text-brand-400" />
                <span className="text-xs text-gray-500 text-center">Click to upload screenshot or PDF<br />(max 10MB)</span>
              </>
            )}
          </label>

          {proofUrl && (
            <p className="text-xs text-green-700 font-medium mt-2 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              Proof uploaded — click &quot;Mark as Paid&quot; above to confirm
            </p>
          )}
        </div>
      )}

      {/* Request Payment — only for pending orders */}
      {currentStatus === 'pending' && (
        paymentLink ? (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-3 space-y-2">
            <p className="text-sm font-medium text-blue-800">Payment link sent to customer</p>
            <div className="flex gap-2">
              <input
                readOnly
                value={paymentLink}
                className="flex-1 text-xs bg-white border border-blue-200 rounded-lg px-3 py-2 font-mono text-gray-600 truncate"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 text-xs font-medium bg-white border border-blue-200 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <button
              onClick={handleRequestPayment}
              disabled={requestingPayment}
              className="w-full flex items-center justify-center gap-2 text-xs font-medium text-blue-700 hover:text-blue-800 bg-white border border-blue-200 hover:bg-blue-100 py-2 rounded-lg transition-colors"
            >
              {requestingPayment ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Resend Email
            </button>
          </div>
        ) : (
          <div className="relative group mb-3">
            <button
              onClick={handleRequestPayment}
              disabled={requestingPayment || onlinePaymentAllowed === false}
              className="w-full flex items-center justify-between gap-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              <div className="text-left">
                <span className="flex items-center gap-2">
                  {requestingPayment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Request Payment
                </span>
                <span className="text-xs text-white/70 font-normal">Send payment link via email</span>
              </div>
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
            </button>
            {onlinePaymentAllowed === false && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-10 hidden group-hover:block w-56 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg text-center">
                Online Payments is temporarily not available.
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900" />
              </div>
            )}
          </div>
        )
      )}

      {isDelivered && (
        <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-xl p-4 mb-3">
          <PackageCheck className="w-5 h-5" />
          <span className="text-sm font-medium">Order completed successfully</span>
        </div>
      )}

      {/* Cancel section */}
      {!isCancelled && !isDelivered && (
        <>
          {!showCancel ? (
            <button
              onClick={() => setShowCancel(true)}
              className="w-full flex items-center justify-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 py-2.5 rounded-xl transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Cancel Order
            </button>
          ) : (
            <div className="border border-red-200 rounded-xl p-4 mt-2 animate-dropdown" style={{ transformOrigin: 'top' }}>
              {needsRefundWarning && (
                <div className="flex items-start gap-2.5 bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-yellow-800">Refund required</p>
                    <p className="text-yellow-700 text-xs mt-0.5">
                      This order has been paid. You will need to issue a refund manually.
                    </p>
                  </div>
                </div>
              )}

              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Reason for cancellation
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Customer requested cancellation, item out of stock..."
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-300 focus:border-transparent outline-none resize-none mb-3"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => { setShowCancel(false); setCancelReason('') }}
                  className="flex-1 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 py-2.5 rounded-lg transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={handleCancel}
                  disabled={cancelling || !cancelReason.trim()}
                  className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-300 py-2.5 rounded-lg transition-colors"
                >
                  {cancelling ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  Cancel Order
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
