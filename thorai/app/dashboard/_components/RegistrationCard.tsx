'use client'

import Link from 'next/link'
import { MessageCircle, ExternalLink } from 'lucide-react'

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

const STATUS_CONFIG = {
  pending: { label: 'Submitted', color: '#F59E0B' },
  in_progress: { label: 'In Progress', color: '#3B82F6' },
  active: { label: 'Live', color: '#10B981' },
  rejected: { label: 'Rejected', color: '#EF4444' },
}

const STEPS: Array<{ key: 'pending' | 'in_progress' | 'active'; label: string }> = [
  { key: 'pending', label: 'Submitted' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'active', label: 'Live' },
]

function getStepState(
  stepKey: 'pending' | 'in_progress' | 'active',
  status: Registration['status']
): 'completed' | 'current' | 'future' | 'rejected' {
  const order: Record<string, number> = {
    pending: 0,
    in_progress: 1,
    active: 2,
    rejected: 1, // sits at in_progress position visually
  }
  const currentOrder = order[status]
  const stepOrder = order[stepKey]

  if (status === 'rejected' && stepKey === 'in_progress') return 'rejected'
  if (stepOrder < currentOrder) return 'completed'
  if (stepOrder === currentOrder) return 'current'
  return 'future'
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function RegistrationCard({ reg }: { reg: Registration }) {
  const statusConfig = STATUS_CONFIG[reg.status]

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 12,
        padding: 24,
        transition: 'border-color 150ms',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'
      }}
    >
      {/* Top row: status badge + date */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        {/* Status badge */}
        <span
          style={{
            display: 'inline-block',
            borderRadius: 999,
            padding: '2px 10px',
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            backgroundColor: `${statusConfig.color}1f`,
            color: statusConfig.color,
          }}
        >
          {statusConfig.label}
        </span>

        {/* Date */}
        <span style={{ fontSize: '0.75rem', color: '#555555' }}>
          {formatDate(reg.created_at)}
        </span>
      </div>

      {/* Business name */}
      <div style={{ marginBottom: 4 }}>
        <h2
          style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#F2F2F2',
            margin: 0,
          }}
        >
          {reg.business_name}
        </h2>
      </div>

      {/* Meta row */}
      <p
        style={{
          fontSize: '0.8125rem',
          color: '#8A8A8A',
          margin: '0 0 20px 0',
        }}
      >
        {reg.owner_name}
        {reg.category ? ` · ${reg.category}` : ''}
        {reg.location_country
          ? ` · ${reg.location_city ? `${reg.location_city}, ` : ''}${reg.location_country}`
          : ''}
      </p>

      {/* Progress bar */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 0,
          }}
        >
          {STEPS.map((step, i) => {
            const state = getStepState(step.key, reg.status)
            const isLast = i === STEPS.length - 1

            const circleColor =
              state === 'completed'
                ? '#10B981'
                : state === 'current'
                  ? '#5E6AD2'
                  : state === 'rejected'
                    ? '#EF4444'
                    : 'rgba(255,255,255,0.1)'

            const labelColor =
              state === 'completed' || state === 'current' || state === 'rejected'
                ? '#F2F2F2'
                : '#555555'

            return (
              <div key={step.key} style={{ display: 'flex', alignItems: 'center', flex: isLast ? 'none' : 1 }}>
                {/* Step item */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  {/* Circle */}
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {state === 'current' && (
                      <span
                        style={{
                          position: 'absolute',
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          border: `2px solid ${circleColor}`,
                          opacity: 0.4,
                          animation: 'pulse-ring 1.5s ease-out infinite',
                        }}
                      />
                    )}
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor:
                          state === 'completed' || state === 'current' || state === 'rejected'
                            ? circleColor
                            : 'transparent',
                        border:
                          state === 'future'
                            ? '1.5px solid rgba(255,255,255,0.15)'
                            : `2px solid ${circleColor}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {state === 'rejected' && (
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 1.5L6.5 6.5M6.5 1.5L1.5 6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      )}
                      {state === 'completed' && (
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                  {/* Label */}
                  <span style={{ fontSize: '0.6875rem', color: labelColor, whiteSpace: 'nowrap' }}>
                    {step.label}
                  </span>
                </div>

                {/* Connector line */}
                {!isLast && (
                  <div
                    style={{
                      flex: 1,
                      height: 1,
                      marginBottom: 18,
                      backgroundColor:
                        getStepState(STEPS[i + 1].key, reg.status) === 'future' &&
                        reg.status !== 'rejected'
                          ? 'rgba(255,255,255,0.08)'
                          : reg.status === 'rejected' && i === 0
                            ? '#10B981'
                            : reg.status === 'rejected' && i === 1
                              ? 'rgba(255,255,255,0.08)'
                              : '#10B981',
                      margin: '0 8px',
                      marginBottom: 18,
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom row: ticket pill + actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        {/* Linear ticket pill */}
        <div>
          {reg.linear_ticket_id ? (
            <a
              href="#"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '3px 10px',
                borderRadius: 6,
                background: 'rgba(94,106,210,0.1)',
                border: '1px solid rgba(94,106,210,0.2)',
                color: '#9BA3EB',
                fontSize: '0.75rem',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.background = 'rgba(94,106,210,0.18)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.background = 'rgba(94,106,210,0.1)'
              }}
            >
              #{reg.linear_ticket_id}
              <ExternalLink size={10} />
            </a>
          ) : (
            <span />
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {reg.whatsapp && (
            <a
              href={`https://wa.me/${reg.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 6,
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.2)',
                color: '#10B981',
                fontSize: '0.75rem',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.background = 'rgba(16,185,129,0.14)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.background = 'rgba(16,185,129,0.08)'
              }}
            >
              <MessageCircle size={12} />
              WhatsApp
            </a>
          )}
          <Link
            href={`/dashboard/${reg.id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 12px',
              borderRadius: 6,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#8A8A8A',
              fontSize: '0.75rem',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'color 0.15s, background 0.15s',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.color = '#F2F2F2'
              ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.09)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.color = '#8A8A8A'
              ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'
            }}
          >
            Details &rsaquo;
          </Link>
        </div>
      </div>
    </div>
  )
}
