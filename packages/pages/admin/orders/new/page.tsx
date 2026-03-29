import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { isAdmin } from '@tor/lib/actions/auth'
import { loadFormDraft } from '@tor/lib/actions/drafts'
import CreateOrderClient from './CreateOrderClient'
import type { Step } from './CreateOrderClient'

export const metadata: Metadata = {
  title: 'Create Order',
}

export default async function CreateOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ session?: string; step?: string }>
}) {
  const admin = await isAdmin()
  if (!admin) redirect('/admin')

  const { session, step: stepParam } = await searchParams

  // Session is required — no direct navigation to this page
  if (!session) redirect('/admin/orders')

  const draft = await loadFormDraft(session)

  // Session missing, closed, or expired → send back to start
  if (!draft || draft.status !== 'active') redirect('/admin/orders')

  const draftData = draft.data as Record<string, unknown>

  // URL step takes priority, then draft's last saved step, then start at 1
  const urlStep = Number(stepParam)
  const draftStep = Number(draftData.step)
  const initialStep: Step =
    urlStep >= 1 && urlStep <= 4 ? (urlStep as Step) :
    draftStep >= 1 && draftStep <= 4 ? (draftStep as Step) :
    1

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Order</h1>
      <CreateOrderClient
        sessionId={session}
        initialStep={initialStep}
        initialData={draftData}
      />
    </div>
  )
}
