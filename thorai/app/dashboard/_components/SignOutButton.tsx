'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <button
      onClick={handleSignOut}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#8A8A8A',
        fontSize: '0.8rem',
        padding: '4px 8px',
        borderRadius: 4,
        transition: 'color 0.15s',
        fontFamily: 'var(--font-inter)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.color = '#F2F2F2'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.color = '#8A8A8A'
      }}
    >
      Sign out
    </button>
  )
}
