'use client'

import { useCart } from '@tor/lib/cart-context'
import { signOut } from '@tor/lib/actions/auth'

export default function SignOutButton() {
  const { clearCart } = useCart()

  return (
    <form
      action={async () => {
        clearCart()
        await signOut()
      }}
    >
      <button
        type="submit"
        className="w-full mt-4 border border-gray-200 text-gray-700 font-semibold py-3 rounded-full hover:bg-gray-50 transition-colors"
      >
        Sign Out
      </button>
    </form>
  )
}
