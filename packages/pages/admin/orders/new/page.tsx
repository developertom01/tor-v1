import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { isAdmin } from '@tor/lib/actions/auth'
import { loadFormDraft } from '@tor/lib/actions/drafts'
import { type OrderDraftData } from '@tor/lib/actions/orders'
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

  if (!session) redirect('/admin/orders')

  const draft = await loadFormDraft(session)

  if (!draft || draft.status !== 'active') redirect('/admin/orders')

  const draftData = draft.data as OrderDraftData

  // URL step takes priority, then draft's saved currentStep, then 1
  const urlStep = Number(stepParam)
  const draftStep = Number(draftData.currentStep)
  const initialStep: Step =
    urlStep >= 1 && urlStep <= 4 ? (urlStep as Step) :
    draftStep >= 1 && draftStep <= 4 ? (draftStep as Step) :
    1

  // Sync step into URL if missing (e.g. returning via draft list)
  if (!stepParam && initialStep > 1) {
    redirect(`/admin/orders/new?session=${session}&step=${initialStep}`)
  }

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
