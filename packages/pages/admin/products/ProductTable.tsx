'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Loader2, MoreVertical, CheckSquare, X } from 'lucide-react'
import { deleteProduct, deleteProducts } from '@tor/lib/actions/products'
import { formatPrice } from '@tor/lib/utils'
import { useRouter } from 'next/navigation'
import { useToast } from '@tor/ui/Toast'

interface Product {
  id: string
  name: string
  price: number
  category: string
  stock_quantity: number
  in_stock: boolean
  featured: boolean
  product_media?: { url: string; is_primary: boolean }[]
}

export default function ProductTable({ products }: { products: Product[] }) {
  const [selectMode, setSelectMode] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const { toast, confirm } = useToast()

  const allSelected = products.length > 0 && selected.size === products.length

  function enterSelectMode() {
    setSelectMode(true)
    setMenuOpen(false)
  }

  function exitSelectMode() {
    setSelectMode(false)
    setSelected(new Set())
  }

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set())
    } else {
      setSelected(new Set(products.map(p => p.id)))
    }
  }

  function toggleOne(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function handleBatchDelete() {
    const count = selected.size
    const ok = await confirm(`Delete ${count} product${count > 1 ? 's' : ''}? This cannot be undone.`)
    if (!ok) return

    setDeleting(true)
    try {
      await deleteProducts(Array.from(selected))
      toast(`${count} product${count > 1 ? 's' : ''} deleted`, 'success')
      exitSelectMode()
      router.refresh()
    } catch {
      toast('Failed to delete products', 'error')
    }
    setDeleting(false)
  }

  async function handleSingleDelete(id: string, name: string) {
    const ok = await confirm(`Delete "${name}"? This cannot be undone.`)
    if (!ok) return

    try {
      await deleteProduct(id)
      toast('Product deleted', 'success')
      setSelected(prev => { const next = new Set(prev); next.delete(id); return next })
      router.refresh()
    } catch {
      toast('Failed to delete product', 'error')
    }
  }

  return (
    <>
      {selectMode && (
        <div className="flex items-center gap-3 mb-3 bg-brand-50 border border-brand-200 rounded-lg px-4 py-2.5">
          <button onClick={exitSelectMode} className="text-gray-500 hover:text-gray-700 p-0.5">
            <X className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-brand-700">
            {selected.size} selected
          </span>
          <button
            onClick={toggleAll}
            className="text-sm text-brand-600 hover:text-brand-700 font-medium"
          >
            {allSelected ? 'Deselect all' : 'Select all'}
          </button>
          {selected.size > 0 && (
            <button
              onClick={handleBatchDelete}
              disabled={deleting}
              className="ml-auto flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Delete
            </button>
          )}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {selectMode && (
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="w-4 h-4 text-brand-600 rounded border-gray-300 focus:ring-brand-500"
                  />
                </th>
              )}
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Product</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3 hidden sm:table-cell">Category</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Price</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3 hidden md:table-cell">Stock</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase px-4 py-3 w-12">
                {!selectMode && (
                  <div className="relative inline-block">
                    <button
                      onClick={() => setMenuOpen(!menuOpen)}
                      onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
                      className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {menuOpen && (
                      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 w-40">
                        <button
                          onMouseDown={enterSelectMode}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <CheckSquare className="w-4 h-4" />
                          Select
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((product) => {
              const image = product.product_media?.find(m => m.is_primary)?.url || product.product_media?.[0]?.url
              const href = `/admin/products/${product.id}`
              const isSelected = selected.has(product.id)
              return (
                <tr key={product.id} className={`group hover:bg-gray-50 ${isSelected ? 'bg-brand-50/50' : ''}`}>
                  {selectMode && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleOne(product.id)}
                        className="w-4 h-4 text-brand-600 rounded border-gray-300 focus:ring-brand-500"
                      />
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <Link href={href} className="flex items-center gap-3 cursor-pointer">
                      <div className="relative w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {image ? (
                          <Image src={image} alt="" fill className="object-cover" sizes="40px" />
                        ) : (
                          <div className="w-full h-full bg-gray-200" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 group-hover:text-brand-600 text-sm line-clamp-1">{product.name}</p>
                        {product.featured && <span className="text-xs text-gold-500 font-semibold">Featured</span>}
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <Link href={href} className="block text-sm text-gray-500 capitalize cursor-pointer">{product.category}</Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={href} className="block text-sm font-semibold cursor-pointer">{formatPrice(product.price)}</Link>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <Link href={href} className={`block text-sm font-medium cursor-pointer ${product.in_stock ? 'text-green-600' : 'text-red-500'}`}>
                      {product.stock_quantity}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!selectMode && (
                      <button
                        onClick={() => handleSingleDelete(product.id, product.name)}
                        className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
