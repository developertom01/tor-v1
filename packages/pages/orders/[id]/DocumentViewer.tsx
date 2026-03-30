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
    <div className="fixed inset-0 z-[9999] flex flex-col">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative z-10 flex flex-col h-full">
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900 text-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={url}
              download
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </a>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative flex items-center justify-center bg-gray-950 p-4">
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
              className="max-w-full max-h-full object-contain rounded-lg"
              style={{ opacity: loaded ? 1 : 0 }}
              onLoad={() => setLoaded(true)}
            />
          ) : (
            <iframe
              src={url}
              title={title}
              className="w-full h-full rounded-lg bg-white"
              style={{ opacity: loaded ? 1 : 0 }}
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
