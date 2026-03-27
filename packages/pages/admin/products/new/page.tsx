import { Metadata } from 'next'
import ProductForm from '../ProductForm'

export const metadata: Metadata = {
  title: 'Add New Product',
}

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h1>
      <ProductForm />
    </div>
  )
}
