import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { isAdmin } from '@tor/lib/actions/auth'
import { loadFormDraft } from '@tor/lib/actions/drafts'
import CreateOrderClient from './CreateOrderClient'

export const metadata: Metadata = {
  title: 'Create Order',
}

export default async function CreateOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ session?: string }>
}) {
  const admin = await isAdmin()
  if (!admin) redirect('/admin')

  const { session } = await searchParams

  // Session is required — no direct navigation to this page
  if (!session) redirect('/admin/orders')

  const draft = await loadFormDraft(session)

  // Session missing, closed, or expired → send back to start
  if (!draft || draft.status !== 'active') redirect('/admin/orders')

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Order</h1>
      <CreateOrderClient
        sessionId={session}
        initialData={draft.data as Record<string, unknown>}
      />
    </div>
  )
}
