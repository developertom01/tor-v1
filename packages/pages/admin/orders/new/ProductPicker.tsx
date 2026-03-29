'use client'

import { useState, useRef } from 'react'
import { Search, X, Package, Loader2, Check } from 'lucide-react'
import { formatPrice } from '@tor/lib/utils'
import { searchProductsForOrder } from '@tor/lib/actions/orders'
import Image from 'next/image'

type Product = Awaited<ReturnType<typeof searchProductsForOrder>>[number]

interface ProductPickerProps {
  value: string
  variantValue: string
  onChange: (productId: string, variantId: string, product: Product) => void
  onClear: () => void
  selectedProduct: Product | null
}

export default function ProductPicker({ value, variantValue, onChange, onClear, selectedProduct }: ProductPickerProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleSearch(value: string) {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await searchProductsForOrder(value)
        setResults(data)
        setOpen(true)
      } catch {
        setResults([])
      }
      setLoading(false)
    }, 300)
  }

  function handleFocus() {
    if (results.length > 0) setOpen(true)
    else if (!query) {
      // Load initial set on first focus
      handleSearch('')
    }
  }

  function handleSelect(product: Product) {
    const firstVariant = product.product_variants?.[0]
    onChange(product.id, firstVariant?.id ?? '', product)
    setOpen(false)
    setQuery('')
    setResults([])
  }

  const thumb = selectedProduct?.product_media?.find((m) => m.is_primary) ?? selectedProduct?.product_media?.[0]
  const hasVariants = (selectedProduct?.product_variants?.length ?? 0) > 0

  if (selectedProduct) {
    return (
      <div className="space-y-3">
        {/* Selected — compact card */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
          {thumb ? (
            <Image
              src={thumb.url}
              alt={selectedProduct.name}
              width={52}
              height={52}
              className="object-cover rounded-lg flex-shrink-0"
              style={{ width: 52, height: 52 }}
            />
          ) : (
            <div className="w-13 h-13 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ width: 52, height: 52 }}>
              <Package className="w-5 h-5 text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{selectedProduct.name}</p>
            <p className="text-xs text-brand-600 font-medium mt-0.5">{formatPrice(selectedProduct.price)}</p>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors flex-shrink-0"
          >
            <X className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>

        {/* Variant pills */}
        {hasVariants && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Variant</p>
            <div className="flex flex-wrap gap-2">
              {selectedProduct.product_variants.map((v) => {
                const isSelected = variantValue === v.id
                const outOfStock = v.stock_quantity === 0
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => onChange(selectedProduct.id, v.id, selectedProduct)}
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
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={handleFocus}
          placeholder="Search products..."
          className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none text-sm"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
        )}
      </div>

      {open && results.length > 0 && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden max-h-72 overflow-y-auto">
            {results.map((p) => {
              const t = p.product_media?.find((m) => m.is_primary) ?? p.product_media?.[0]
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelect(p)}
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

      {open && !loading && results.length === 0 && query.length > 0 && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl p-4 text-center">
            <p className="text-sm text-gray-500">No products found</p>
          </div>
        </>
      )}
    </div>
  )
}
