#!/usr/bin/env node
/**
 * Seed a store with products for dev environments.
 *
 * Usage: node scripts/seed-store.mjs <store-slug>
 *
 * Requires env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY
 *
 * - Ensures the store row + settings exist
 * - Deletes all existing products for the store, then re-inserts from supabase/seeds/<store>.json
 * - Creates product_media for each product
 *
 * Always re-seeds so category changes in the seed file take effect on re-run.
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const storeId = process.argv[2]
if (!storeId) {
  console.error('Usage: node scripts/seed-store.mjs <store-slug>')
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
  Prefer: 'resolution=merge-duplicates,return=minimal',
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

async function api(path, method, body, customHeaders) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    method,
    headers: customHeaders ?? headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${method} ${path} failed (${res.status}): ${text}`)
  }
  return res
}


// Load seed data
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

// 1. Ensure store exists
console.log(`Ensuring store: ${storeId}`)
await upsertIgnore('stores', {
  id: storeId,
  display_name: seedData.display_name,
  domain: seedData.domain,
}, 'id')

// 2. Ensure store settings row with defaults (ignore if already exists)
await upsertIgnore('store_settings', {
  store_id: storeId,
  settings: defaultSettings,
}, 'store_id')

// 3. Delete all existing products for this store (cascades to product_media via FK)
await api(`products?store_id=eq.${storeId}`, 'DELETE')

// 4. Insert products + media
let inserted = 0
for (const product of seedData.products) {
  // Insert product
  const res = await fetch(`${supabaseUrl}/rest/v1/products`, {
    method: 'POST',
    headers: {
      ...headers,
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      compare_at_price: product.compare_at_price || null,
      category: product.category,
      in_stock: product.in_stock,
      stock_quantity: product.stock_quantity,
      featured: product.featured,
      store_id: storeId,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error(`Failed to insert ${product.slug}: ${text}`)
    continue
  }

  const [created] = await res.json()

  // Insert media
  if (product.image_url) {
    await api('product_media', 'POST', {
      product_id: created.id,
      url: product.image_url,
      type: 'image',
      is_primary: true,
      sort_order: 0,
    })
  }

  inserted++
}

console.log(`Seeded ${inserted} products for ${storeId}`)
