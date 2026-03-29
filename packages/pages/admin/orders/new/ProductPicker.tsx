'use client'

import { useState } from 'react'
import { ChevronDown, Check, X, Package } from 'lucide-react'
import { formatPrice } from '@tor/lib/utils'
import Image from 'next/image'

interface Variant {
  id: string
  name: string
  price: number
  stock_quantity: number
}

interface Product {
  id: string
  name: string
  price: number
  product_variants: Variant[]
  product_media: Array<{ url: string; is_primary: boolean }>
}

interface ProductPickerProps {
  products: Product[]
  value: string
  variantValue: string
  onChange: (productId: string, variantId: string) => void
  onClear: () => void
}

export default function ProductPicker({ products, value, variantValue, onChange, onClear }: ProductPickerProps) {
  const [open, setOpen] = useState(false)

  const selected = products.find((p) => p.id === value)
  const thumb = selected?.product_media?.find((m) => m.is_primary) ?? selected?.product_media?.[0]
  const hasVariants = (selected?.product_variants?.length ?? 0) > 0

  if (selected) {
    return (
      <div className="space-y-3">
        {/* Selected product — compact horizontal card */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
          {thumb ? (
            <Image
              src={thumb.url}
              alt={selected.name}
              width={52}
              height={52}
              className="w-13 h-13 object-cover rounded-lg flex-shrink-0"
              style={{ width: 52, height: 52 }}
            />
          ) : (
            <div className="w-13 h-13 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ width: 52, height: 52 }}>
              <Package className="w-5 h-5 text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{selected.name}</p>
            <p className="text-xs text-brand-600 font-medium mt-0.5">{formatPrice(selected.price)}</p>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors flex-shrink-0"
          >
            <X className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>

        {/* Variants — pill selector */}
        {hasVariants && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Variant</p>
            <div className="flex flex-wrap gap-2">
              {selected.product_variants.map((v) => {
                const isSelected = variantValue === v.id
                const outOfStock = v.stock_quantity === 0
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => onChange(selected.id, v.id)}
                    disabled={outOfStock}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      isSelected
                        ? 'bg-brand-600 text-white border-brand-600'
                        : outOfStock
                        ? 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed line-through'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-brand-300 hover:text-brand-700'
                    }`}
                  >
                    {v.name}
                    {!outOfStock && (
                      <span className={`ml-1.5 ${isSelected ? 'text-brand-200' : 'text-gray-400'}`}>
                        {formatPrice(v.price)}
                      </span>
                    )}
                    {outOfStock && <span className="ml-1 text-gray-300">· out of stock</span>}
                  </button>
                )
              })}
            </div>
          </div>
        )}
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
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden max-h-72 overflow-y-auto">
            {products.map((p) => {
              const t = p.product_media?.find((m) => m.is_primary) ?? p.product_media?.[0]
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
                  {t ? (
                    <Image src={t.url} alt={p.name} width={40} height={40} className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <Package className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatPrice(p.price)}
                      {p.product_variants?.length > 0 && (
                        <span className="ml-2 text-gray-400">{p.product_variants.length} variants</span>
                      )}
                    </p>
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
