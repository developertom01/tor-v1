'use server'

import { unstable_cache, revalidateTag } from 'next/cache'
import { supabaseAdmin } from '../supabase/admin'
import { getStoreId } from '../store-id'

function draftCacheTag(id: string) {
  return `form-draft:${id}`
}

export type FormDraftStatus = 'active' | 'closed'

export async function createFormDraft(formType: string, data: object): Promise<string> {
  const storeId = getStoreId()

  // Opportunistic cleanup: delete drafts not touched in the last hour
  await supabaseAdmin
    .from('form_drafts')
    .delete()
    .lt('updated_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())

  const { data: draft, error } = await supabaseAdmin
    .from('form_drafts')
    .insert({ store_id: storeId, form_type: formType, data })
    .select('id')
    .single()

  if (error) throw error
  return draft.id
}

export async function saveFormDraft(id: string, data: object): Promise<void> {
  const storeId = getStoreId()
  const { error } = await supabaseAdmin
    .from('form_drafts')
    .update({ data })
    .eq('id', id)
    .eq('store_id', storeId)
    .eq('status', 'active')

  if (error) throw error

  // Invalidate the cache for this draft so the next load fetches fresh data
  revalidateTag(draftCacheTag(id))
}

export async function loadFormDraft(id: string): Promise<{ data: object; status: FormDraftStatus } | null> {
  const storeId = getStoreId()

  const fetchDraft = unstable_cache(
    async () => {
      const { data: draft, error } = await supabaseAdmin
        .from('form_drafts')
        .select('data, status')
        .eq('id', id)
        .eq('store_id', storeId)
        .single()

      if (error || !draft) return null
      return { data: draft.data as object, status: draft.status as FormDraftStatus }
    },
    [id],
    { tags: [draftCacheTag(id)], revalidate: 3600 }
  )

  return fetchDraft()
}

export async function closeFormDraft(id: string): Promise<void> {
  const storeId = getStoreId()
  await supabaseAdmin
    .from('form_drafts')
    .update({ status: 'closed' })
    .eq('id', id)
    .eq('store_id', storeId)
}

export type FormDraftRow = {
  id: string
  form_type: string
  data: Record<string, unknown>
  created_at: string
  updated_at: string
}

export async function listActiveFormDrafts(
  formType: string,
  offset = 0,
  limit = 10
): Promise<{ drafts: FormDraftRow[]; total: number }> {
  const storeId = getStoreId()

  const [{ data: drafts, error }, { count }] = await Promise.all([
    supabaseAdmin
      .from('form_drafts')
      .select('id, form_type, data, created_at, updated_at')
      .eq('store_id', storeId)
      .eq('form_type', formType)
      .eq('status', 'active')
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1),
    supabaseAdmin
      .from('form_drafts')
      .select('*', { count: 'exact', head: true })
      .eq('store_id', storeId)
      .eq('form_type', formType)
      .eq('status', 'active'),
  ])

  if (error) throw error
  return { drafts: (drafts ?? []) as FormDraftRow[], total: count ?? 0 }
}
