import { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getProducts } from '@tor/lib/actions/products'
import ProductTable from './ProductTable'

export const metadata: Metadata = {
  title: 'Manage Products',
}

export default async function AdminProductsPage() {
  let products = []
  try {
    const result = await getProducts({ limit: 100 })
    products = result.products
  } catch { /* DB not ready */ }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-brand-600 text-white font-semibold px-5 py-2.5 rounded-full hover:bg-brand-700 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400 mb-4">No products yet</p>
          <Link href="/admin/products/new" className="text-brand-600 font-semibold hover:text-brand-700">
            Add your first product
          </Link>
        </div>
      ) : (
        <ProductTable products={products} />
      )}
    </div>
  )
}
