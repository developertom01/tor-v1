'use client'

import { Trash2 } from 'lucide-react'
import { deleteProduct } from '@tor/lib/actions/products'
import { useRouter } from 'next/navigation'
import { useToast } from '@tor/ui/Toast'

export default function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
  const router = useRouter()
  const { toast, confirm } = useToast()

  async function handleDelete() {
    const ok = await confirm(`Delete "${productName}"? This cannot be undone.`)
    if (!ok) return
    try {
      await deleteProduct(productId)
      toast('Product deleted', 'success')
      router.refresh()
    } catch {
      toast('Failed to delete product', 'error')
    }
  }

  return (
    <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 p-1 transition-colors">
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
