#!/usr/bin/env node
import { execSync } from 'child_process'
import bcrypt from 'bcryptjs'

const supabaseUrl = process.env.TF_VAR_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.TF_VAR_SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY
const env = process.env.DOPPLER_CONFIG ?? 'dev'

if (!supabaseUrl || !serviceKey) {
  console.error('Missing env vars: TF_VAR_SUPABASE_URL, TF_VAR_SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const stores = ['hairfordays']

const headers = {
  Authorization: `Bearer ${serviceKey}`,
  apikey: serviceKey,
  'Content-Type': 'application/json',
}

for (const store of stores) {
  console.log(`\nProcessing ${store}/${env}...`)

  let adminPassword, storeId
  try {
    adminPassword = execSync(
      `doppler secrets get ADMIN_PASSWORD --plain --project ${store} --config ${env}`,
      { encoding: 'utf8' }
    ).trim()
    storeId = execSync(
      `doppler secrets get NEXT_PUBLIC_STORE_ID --plain --project ${store} --config ${env}`,
      { encoding: 'utf8' }
    ).trim()
  } catch (err) {
    console.error(`  ✗ Could not fetch secrets for ${store}/${env}: ${err.message}`)
    continue
  }

  // Check what admins exist for this store
  const checkRes = await fetch(
    `${supabaseUrl}/rest/v1/profiles?role=eq.admin&store_id=eq.${storeId}&select=id,email,hashed_password`,
    { headers }
  )
  const admins = await checkRes.json()
  console.log(`  Found ${admins.length} admin(s):`, admins.map(a => `${a.email} (hashed_password: ${a.hashed_password ? 'set' : 'null'})`))

  const nullAdmins = admins.filter(a => !a.hashed_password)
  if (nullAdmins.length === 0) {
    console.log(`  ✓ All admins already have hashed_password set`)
    continue
  }

  const hashed = await bcrypt.hash(adminPassword, 12)

  const res = await fetch(
    `${supabaseUrl}/rest/v1/profiles?role=eq.admin&store_id=eq.${storeId}&hashed_password=is.null`,
    {
      method: 'PATCH',
      headers: { ...headers, Prefer: 'return=representation' },
      body: JSON.stringify({ hashed_password: hashed }),
    }
  )

  if (!res.ok) {
    console.error(`  ✗ Failed: ${await res.text()}`)
    continue
  }

  const updated = await res.json()
  console.log(`  ✓ Updated ${updated.length} admin(s) in ${storeId}`)
}
