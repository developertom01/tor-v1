'use client'

import { useState } from 'react'
import { FileText, Download, X, Loader2 } from 'lucide-react'
import { createPortal } from 'react-dom'

function isImage(url: string) {
  return /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(url)
}

function Overlay({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
  const [loaded, setLoaded] = useState(false)
  const image = isImage(url)

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90" onClick={onClose} />

      {/* Floating controls — top-right over backdrop */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <a
          href={url}
          download
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1.5 text-xs font-medium text-white bg-white/15 hover:bg-white/25 px-3 py-2 rounded-lg transition-colors backdrop-blur-sm"
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </a>
        <button
          onClick={onClose}
          className="text-white bg-white/15 hover:bg-white/25 p-2 rounded-lg transition-colors backdrop-blur-sm"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content card */}
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl">
        <div className="relative flex items-center justify-center bg-gray-950 overflow-auto"
          style={{ minHeight: '300px', maxHeight: '90vh' }}
        >
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            </div>
          )}
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt={title}
              className="max-w-full object-contain p-4"
              style={{ opacity: loaded ? 1 : 0, maxHeight: '90vh' }}
              onLoad={() => setLoaded(true)}
            />
          ) : (
            <iframe
              src={url}
              title={title}
              className="w-full bg-white"
              style={{ opacity: loaded ? 1 : 0, height: '90vh' }}
              onLoad={() => setLoaded(true)}
            />
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function DocumentViewer({
  paymentProofUrl,
  receiptUrl,
}: {
  paymentProofUrl?: string | null
  receiptUrl?: string | null
}) {
  const [viewing, setViewing] = useState<{ url: string; title: string } | null>(null)

  if (!paymentProofUrl && !receiptUrl) return null

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100 p-6 mt-6">
        <h2 className="font-semibold text-gray-900 mb-4">Payment Documents</h2>
        <div className="flex flex-wrap gap-3">
          {paymentProofUrl && (
            <button
              onClick={() => setViewing({ url: paymentProofUrl, title: 'Payment Proof' })}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-4 h-4 text-brand-600" />
              View Payment Proof
            </button>
          )}
          {receiptUrl && (
            <button
              onClick={() => setViewing({ url: receiptUrl, title: 'Receipt' })}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors"
            >
              <FileText className="w-4 h-4" />
              View Receipt
            </button>
          )}
        </div>
      </div>

      {viewing && (
        <Overlay
          url={viewing.url}
          title={viewing.title}
          onClose={() => setViewing(null)}
        />
      )}
    </>
  )
}
