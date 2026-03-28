'use server'

import { createClient } from '../supabase/server'
import { revalidatePath } from 'next/cache'
import { logger } from '../logger'
import { getStoreId } from '../store-id'

export interface StoreSettings {
  bypass_payment: boolean
  online_payments_enabled: boolean
}

export async function getStoreSettings(): Promise<StoreSettings> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('store_settings')
    .select('bypass_payment, online_payments_enabled')
    .eq('store_id', getStoreId())
    .single()

  if (error) {
    logger.error({ error }, 'Failed to fetch store settings')
    return { bypass_payment: false, online_payments_enabled: true }
  }

  return {
    bypass_payment: data.bypass_payment,
    online_payments_enabled: data.online_payments_enabled,
  }
}

export async function updateStoreSettings(settings: Partial<StoreSettings>) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('store_settings')
    .update({ ...settings, updated_at: new Date().toISOString() })
    .eq('store_id', getStoreId())

  if (error) {
    logger.error({ error, settings }, 'Failed to update store settings')
    throw error
  }

  logger.info({ settings }, 'Store settings updated')
  revalidatePath('/admin/settings')
  revalidatePath('/checkout')
}
