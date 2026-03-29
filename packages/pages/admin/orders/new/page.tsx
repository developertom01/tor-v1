import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { isAdmin } from '@tor/lib/actions/auth'
import { getProducts } from '@tor/lib/actions/products'
import CreateOrderClient from './CreateOrderClient'

export const metadata: Metadata = {
  title: 'Create Order',
}

export default async function CreateOrderPage() {
  const admin = await isAdmin()
  if (!admin) redirect('/admin')

  let products: Awaited<ReturnType<typeof getProducts>>['products'] = []
  try {
    const result = await getProducts({ limit: 200 })
    products = result.products
  } catch { /* DB not ready */ }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Order</h1>
      <CreateOrderClient products={products ?? []} />
    </div>
  )
}
