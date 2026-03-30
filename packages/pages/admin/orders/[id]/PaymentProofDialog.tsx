'use client'

import { useState } from 'react'
import { Loader2, Upload, FileText, HandCoins } from 'lucide-react'
import { createClient } from '@tor/lib/supabase/client'
import { useToast } from '@tor/ui/Toast'
import Dialog, { DialogBody, DialogFooter } from '@tor/ui/Dialog'

export default function PaymentProofDialog({
  open,
  onClose,
  onConfirm,
  orderId,
  saving,
}: {
  open: boolean
  onClose: () => void
  onConfirm: (proofUrl: string) => Promise<void>
  orderId: string
  saving: boolean
}) {
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [proofPreviewUrl, setProofPreviewUrl] = useState('')
  const [proofUploading, setProofUploading] = useState(false)
  const [proofUrl, setProofUrl] = useState('')
  const { toast } = useToast()

  function handleClose() {
    setProofFile(null)
    setProofPreviewUrl('')
    setProofUrl('')
    onClose()
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      toast('File too large — max 10MB', 'error')
      return
    }

    setProofFile(file)
    setProofUrl('')

    if (file.type.startsWith('image/')) {
      setProofPreviewUrl(URL.createObjectURL(file))
    } else {
      setProofPreviewUrl('')
    }

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
    } catch {
      toast('Upload failed — try again', 'error')
      setProofFile(null)
      setProofPreviewUrl('')
    }
    setProofUploading(false)
  }

  return (
    <Dialog open={open} onClose={handleClose} title="Upload Payment Proof">
      <DialogBody>
        <p className="text-sm text-gray-500 mb-4">
          Attach a screenshot or PDF of the payment confirmation before marking this order as paid.
        </p>
        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-brand-300 rounded-xl p-6 cursor-pointer hover:bg-brand-50 transition-colors">
          <input
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={handleFileChange}
            disabled={proofUploading}
          />
          {proofUploading ? (
            <Loader2 className="w-7 h-7 animate-spin text-brand-600" />
          ) : proofPreviewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={proofPreviewUrl} alt="proof preview" className="w-full max-h-40 object-contain rounded-lg" />
          ) : proofFile ? (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <FileText className="w-5 h-5 text-brand-600" />
              <span className="truncate max-w-[200px]">{proofFile.name}</span>
            </div>
          ) : (
            <>
              <Upload className="w-7 h-7 text-brand-400" />
              <span className="text-sm text-gray-500 text-center">
                Click to upload screenshot or PDF<br />
                <span className="text-xs text-gray-400">max 10MB</span>
              </span>
            </>
          )}
        </label>
        {proofUrl && (
          <p className="text-xs text-green-700 font-medium mt-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block flex-shrink-0" />
            Proof uploaded successfully
          </p>
        )}
      </DialogBody>
      <DialogFooter>
        <button
          onClick={handleClose}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => onConfirm(proofUrl)}
          disabled={saving || !proofUrl}
          className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <HandCoins className="w-4 h-4" />}
          Confirm Payment
        </button>
      </DialogFooter>
    </Dialog>
  )
}
