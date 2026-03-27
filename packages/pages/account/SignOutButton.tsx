'use client'

import { LogOut } from 'lucide-react'
import { signOut } from '@tor/lib/actions/auth'

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 font-medium transition-colors"
    >
      <LogOut className="w-4 h-4" />
      Sign Out
    </button>
  )
}
