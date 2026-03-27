'use client'

import { useState } from 'react'
import { addAdmin, removeAdmin } from '@tor/lib/actions/auth'
import { useToast } from '@tor/ui/Toast'
import { Loader2, Trash2, UserPlus, Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Admin {
  id: string
  full_name: string | null
  email: string
}

export default function AdminManager({ admins: initialAdmins }: { admins: Admin[] }) {
  const [email, setEmail] = useState('')
  const [adding, setAdding] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const { toast, confirm } = useToast()
  const router = useRouter()

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setAdding(true)
    const result = await addAdmin(email)
    setAdding(false)

    if (result.error) {
      toast(result.error, 'error')
    } else {
      toast('Admin added successfully', 'success')
      setEmail('')
      router.refresh()
    }
  }

  async function handleRemove(admin: Admin) {
    const ok = await confirm(`Remove ${admin.full_name || admin.email} as admin?`)
    if (!ok) return

    setRemovingId(admin.id)
    const result = await removeAdmin(admin.id)
    setRemovingId(null)

    if (result.error) {
      toast(result.error, 'error')
    } else {
      toast('Admin removed', 'success')
      router.refresh()
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-1">
        <Shield className="w-5 h-5 text-brand-600" />
        <h2 className="font-semibold text-gray-900">Admin Users</h2>
      </div>
      <p className="text-sm text-gray-500 mb-4">Manage who has access to the admin dashboard.</p>

      <div className="space-y-2 mb-4">
        {initialAdmins.map(admin => (
          <div key={admin.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">{admin.full_name || 'No name'}</p>
              <p className="text-xs text-gray-500">{admin.email}</p>
            </div>
            <button
              onClick={() => handleRemove(admin)}
              disabled={removingId === admin.id}
              className="text-gray-300 hover:text-red-500 transition-colors p-1 disabled:opacity-50"
            >
              {removingId === admin.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter user email to make admin..."
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
        />
        <button
          type="submit"
          disabled={adding || !email.trim()}
          className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          {adding ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <UserPlus className="w-4 h-4" />
          )}
          Add
        </button>
      </form>
      <p className="text-xs text-gray-400 mt-2">The user must have an account before they can be made admin.</p>
    </div>
  )
}
