#!/usr/bin/env node
/**
 * Backfill per-store auth for existing users.
 *
 * For each existing auth.users row:
 *   - Creates a user_credentials row with a new random encrypted global password
 *   - Updates the Supabase auth password to match
 *   - Sets profiles.hashed_password for all email-based profiles (NULL for Google OAuth users)
 *
 * After running this script, ALL existing users must reset their password via
 * the "Forgot password" flow — their old password no longer works.
 *
 * Usage:
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SECRET_KEY=... AUTH_ENCRYPTION_KEY=... \
 *   node scripts/backfill-auth.mjs
 *
 * Generate AUTH_ENCRYPTION_KEY:
 *   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */

import { createCipheriv, randomBytes } from 'crypto'
import { createDecipheriv } from 'crypto'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SECRET_KEY
const encryptionKey = process.env.AUTH_ENCRYPTION_KEY

if (!supabaseUrl || !serviceKey || !encryptionKey) {
  console.error('Missing env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, AUTH_ENCRYPTION_KEY')
  process.exit(1)
}

const keyBuf = Buffer.from(encryptionKey, 'hex')
if (keyBuf.length !== 32) {
  console.error('AUTH_ENCRYPTION_KEY must be 32 bytes (64 hex chars)')
  process.exit(1)
}

function encrypt(plaintext) {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', keyBuf, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return [iv.toString('hex'), tag.toString('hex'), encrypted.toString('hex')].join(':')
}

const headers = {
  Authorization: `Bearer ${serviceKey}`,
  apikey: serviceKey,
  'Content-Type': 'application/json',
}

async function supabaseApi(path, method = 'GET', body) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    method,
    headers: { ...headers, Prefer: 'return=representation' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${method} ${path} failed (${res.status}): ${text}`)
  }
  return res.status === 204 ? null : res.json()
}

async function supabaseAuthAdmin(path, method = 'GET', body) {
  const res = await fetch(`${supabaseUrl}/auth/v1/admin/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`AUTH ${method} ${path} failed (${res.status}): ${text}`)
  }
  return res.json()
}

// 1. List all auth users
console.log('Fetching all auth users...')
const { users } = await supabaseAuthAdmin('users?per_page=1000')
console.log(`Found ${users.length} users`)

let done = 0
let skipped = 0

for (const user of users) {
  const isGoogleUser = user.app_metadata?.provider === 'google' ||
    user.identities?.some(i => i.provider === 'google' && !i.identity_data?.sub?.includes('@'))

  // Generate a new random global password for Supabase
  const globalPassword = randomBytes(32).toString('hex')
  const encryptedPassword = encrypt(globalPassword)

  // Update Supabase auth password
  try {
    await supabaseAuthAdmin(`users/${user.id}`, 'PUT', { password: globalPassword })
  } catch (err) {
    console.error(`  ✗ Failed to update auth password for ${user.email}: ${err.message}`)
    skipped++
    continue
  }

  // Upsert user_credentials
  try {
    await supabaseApi(
      'user_credentials?on_conflict=user_id',
      'POST',
      { user_id: user.id, encrypted_password: encryptedPassword }
    )
  } catch (err) {
    console.error(`  ✗ Failed to upsert user_credentials for ${user.email}: ${err.message}`)
    skipped++
    continue
  }

  // For email-based users: mark hashed_password as NULL (they must reset password)
  // For Google users: hashed_password stays NULL (already correct)
  if (!isGoogleUser) {
    try {
      await supabaseApi(
        `profiles?user_id=eq.${user.id}`,
        'PATCH',
        { hashed_password: null }
      )
    } catch (err) {
      console.warn(`  ⚠ Could not clear hashed_password for ${user.email}: ${err.message}`)
    }
  }

  console.log(`  ✓ ${user.email} (${isGoogleUser ? 'Google' : 'email'})`)
  done++
}

console.log(`\nDone: ${done} migrated, ${skipped} skipped`)
console.log('\n⚠️  All existing email/password users must reset their password via "Forgot password".')
console.log('   Their old passwords no longer work — global password has been rotated.')
