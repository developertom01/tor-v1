#!/usr/bin/env node
/**
 * Seed store row + settings for a store. Safe to run in dev AND prod.
 *
 * Usage: node scripts/seed-settings.mjs <store-slug>
 *
 * Requires env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY
 *
 * - Upserts the store row (ignore if already exists)
 * - Upserts the store_settings row with defaults from supabase/seeds/default-settings.json
 *   (ignore if already exists — does not overwrite settings an admin has changed)
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const storeId = process.argv[2]
if (!storeId) {
  console.error('Usage: node scripts/seed-settings.mjs <store-slug>')
  process.exit(1)
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SECRET_KEY
if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY')
  process.exit(1)
}

const headers = {
  Authorization: `Bearer ${serviceKey}`,
  apikey: serviceKey,
  'Content-Type': 'application/json',
}

async function upsertIgnore(table, body, onConflict) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${table}?on_conflict=${onConflict}`, {
    method: 'POST',
    headers: { ...headers, Prefer: 'resolution=ignore-duplicates,return=minimal' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`POST ${table} failed (${res.status}): ${text}`)
  }
}

// Load store seed data (for display_name + domain)
const seedPath = resolve(__dirname, '..', 'supabase', 'seeds', `${storeId}.json`)
let seedData
try {
  seedData = JSON.parse(readFileSync(seedPath, 'utf-8'))
} catch {
  console.error(`Seed file not found: ${seedPath}`)
  process.exit(1)
}

// Load default settings
const defaultSettings = JSON.parse(
  readFileSync(resolve(__dirname, '..', 'supabase', 'seeds', 'default-settings.json'), 'utf-8')
)

// 1. Ensure store row exists
console.log(`[${storeId}] Ensuring store row...`)
await upsertIgnore('stores', {
  id: storeId,
  display_name: seedData.display_name,
  domain: seedData.domain,
}, 'id')

// 2. Ensure store_settings row with defaults (ignore if already exists)
console.log(`[${storeId}] Ensuring store settings...`)
await upsertIgnore('store_settings', {
  store_id: storeId,
  settings: defaultSettings,
}, 'store_id')

console.log(`[${storeId}] Done.`)
