import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductById } from '@tor/lib/actions/products'
import ProductForm from '../ProductForm'
import MediaManager from './MediaManager'

export const metadata: Metadata = {
  title: 'Edit Product',
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProductById(id)
  if (!product) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit: {product.name}</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ProductForm product={product} />
        </div>
        <div>
          <MediaManager product={product} />
        </div>
      </div>
    </div>
  )
}
