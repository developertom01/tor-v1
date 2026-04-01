import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SignOutButton from './_components/SignOutButton'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  return (
    <div style={{ fontFamily: 'var(--font-inter)' }}>
      {/* Top bar */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: 56,
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}
      >
        {/* Wordmark */}
        <span
          style={{
            fontSize: '1.05rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#F2F2F2',
          }}
        >
          Thor<span style={{ color: '#5E6AD2' }}>AI</span>
        </span>

        {/* Right: email + sign out */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span
            style={{
              fontSize: '0.8rem',
              color: '#8A8A8A',
            }}
          >
            {user.email}
          </span>
          <SignOutButton />
        </div>
      </header>

      {/* Main content */}
      <main
        style={{
          paddingTop: 56,
          minHeight: '100vh',
          background: 'var(--color-bg)',
        }}
      >
        {children}
      </main>
    </div>
  )
}
