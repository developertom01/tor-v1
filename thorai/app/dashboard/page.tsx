import Link from 'next/link'
import { Inbox } from 'lucide-react'
import { getMyRegistrations } from '@/lib/actions/registrations'
import RegistrationCard from './_components/RegistrationCard'

type Registration = {
  id: string
  user_id: string
  owner_name: string
  business_name: string
  category: string
  location_country: string
  location_city: string | null
  whatsapp: string | null
  logo_url: string | null
  color_palette: string | null
  payment_methods: string[]
  status: 'pending' | 'in_progress' | 'active' | 'rejected'
  linear_ticket_id: string | null
  created_at: string
  updated_at: string
}

export default async function DashboardPage() {
  const registrations = await getMyRegistrations()

  if (!registrations || registrations.length === 0) {
    return (
      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: '40px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 56px)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}
        >
          <Inbox size={22} color="#555555" />
        </div>
        <h2
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: '#F2F2F2',
            margin: '0 0 8px 0',
          }}
        >
          No registrations yet
        </h2>
        <p
          style={{
            fontSize: '0.875rem',
            color: '#8A8A8A',
            margin: '0 0 24px 0',
          }}
        >
          Start your store registration to get going.
        </p>
        <Link
          href="/register"
          style={{
            display: 'inline-block',
            padding: '9px 18px',
            borderRadius: 6,
            backgroundColor: '#5E6AD2',
            color: '#FFFFFF',
            fontSize: '0.875rem',
            fontWeight: 500,
            textDecoration: 'none',
            transition: 'background-color 0.15s',
          }}
        >
          Start Registration
        </Link>
      </div>
    )
  }

  return (
    <div
      style={{
        maxWidth: 900,
        margin: '0 auto',
        padding: '40px 24px',
      }}
    >
      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            color: '#F2F2F2',
            margin: '0 0 6px 0',
          }}
        >
          My Stores
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#8A8A8A', margin: 0 }}>
          Track your store setup progress
        </p>
      </div>

      {/* Registration list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {registrations.map((reg) => (
          <RegistrationCard key={reg.id} reg={reg as Registration} />
        ))}
      </div>
    </div>
  )
}
