import { Metadata } from 'next'
import CartClient from './CartClient'

export const metadata: Metadata = {
  title: 'Shopping Cart',
}

export default function CartPage() {
  return <CartClient />
}
