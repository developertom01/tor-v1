'use server'

import { createClient } from '../supabase/server'
import { revalidatePath } from 'next/cache'
import { logger } from '../logger'
import { getStoreId } from '../store-id'

export interface StoreSettings {
  bypass_payment: boolean
  online_payments_enabled: boolean
}

const DEFAULTS: StoreSettings = {
  bypass_payment: true,
  online_payments_enabled: false,
}

export async function getStoreSettings(): Promise<StoreSettings> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('store_settings')
    .select('settings')
    .eq('store_id', getStoreId())
    .single()

  if (error || !data) {
    logger.error({ error }, 'Failed to fetch store settings')
    return DEFAULTS
  }

  return { ...DEFAULTS, ...(data.settings as Partial<StoreSettings>) }
}

export async function updateStoreSettings(patch: Partial<StoreSettings>) {
  const supabase = await createClient()
  const storeId = getStoreId()

  const current = await getStoreSettings()
  const merged = { ...current, ...patch }

  const { error } = await supabase
    .from('store_settings')
    .update({ settings: merged })
    .eq('store_id', storeId)

  if (error) {
    logger.error({ error, patch }, 'Failed to update store settings')
    throw error
  }

  logger.info({ patch }, 'Store settings updated')
  revalidatePath('/admin/settings')
  revalidatePath('/checkout')
}
