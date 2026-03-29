'use client'

import { useState } from 'react'
import { ChevronDown, Check, X, Package } from 'lucide-react'
import { formatPrice } from '@tor/lib/utils'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  price: number
  product_variants: Array<{ id: string; name: string; price: number; stock_quantity: number }>
  product_media: Array<{ url: string; is_primary: boolean }>
}

interface ProductPickerProps {
  products: Product[]
  value: string
  onChange: (productId: string, firstVariantId: string) => void
  onClear: () => void
}

export default function ProductPicker({ products, value, onChange, onClear }: ProductPickerProps) {
  const [open, setOpen] = useState(false)

  const selected = products.find((p) => p.id === value)
  const primary = selected?.product_media?.find((m) => m.is_primary) ?? selected?.product_media?.[0]

  if (selected) {
    return (
      <div className="border border-brand-200 rounded-xl overflow-hidden">
        {primary ? (
          <div className="relative h-36 w-full bg-gray-100">
            <Image src={primary.url} alt={selected.name} fill className="object-cover" />
            <button
              type="button"
              onClick={onClear}
              className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-1 shadow-sm transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        ) : (
          <div className="relative h-20 w-full bg-gray-100 flex items-center justify-center">
            <Package className="w-8 h-8 text-gray-300" />
            <button
              type="button"
              onClick={onClear}
              className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-1 shadow-sm transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        )}
        <div className="px-4 py-3 bg-brand-50">
          <p className="font-semibold text-gray-900 text-sm">{selected.name}</p>
          <p className="text-xs text-brand-600 font-medium mt-0.5">{formatPrice(selected.price)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:border-brand-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none text-sm text-left transition-colors bg-white"
      >
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
          <Package className="w-4 h-4 text-gray-400" />
        </div>
        <span className="text-gray-400 flex-1">Select a product...</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <>
          {/* Backdrop — closes dropdown on outside click, no useEffect needed */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden max-h-72 overflow-y-auto">
            {products.map((p) => {
              const thumb = p.product_media?.find((m) => m.is_primary) ?? p.product_media?.[0]
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    onChange(p.id, p.product_variants?.[0]?.id ?? '')
                    setOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors border-b border-gray-100 last:border-b-0 text-left"
                >
                  {thumb ? (
                    <Image
                      src={thumb.url}
                      alt={p.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <Package className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">{formatPrice(p.price)}</p>
                  </div>
                  {value === p.id && <Check className="w-4 h-4 text-brand-600 flex-shrink-0" />}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
