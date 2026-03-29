#!/usr/bin/env node
/**
 * Seeds user_credentials + profiles.hashed_password for a newly provisioned admin.
 * Run as part of post-provision CI step.
 *
 * Required env vars (from store Doppler config):
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, AUTH_ENCRYPTION_KEY,
 *   ADMIN_EMAIL, ADMIN_PASSWORD, NEXT_PUBLIC_STORE_ID
 */

import { createCipheriv, randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SECRET_KEY
const encryptionKey = process.env.AUTH_ENCRYPTION_KEY
const adminEmail = process.env.ADMIN_EMAIL
const adminPassword = process.env.ADMIN_PASSWORD
const storeId = process.env.NEXT_PUBLIC_STORE_ID

if (!supabaseUrl || !serviceKey || !encryptionKey || !adminEmail || !adminPassword || !storeId) {
  console.error('Missing required env vars')
  process.exit(1)
}

const keyBuf = Buffer.from(encryptionKey, 'hex')
const headers = {
  Authorization: `Bearer ${serviceKey}`,
  apikey: serviceKey,
  'Content-Type': 'application/json',
}

function encrypt(plaintext) {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', keyBuf, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return [iv.toString('hex'), tag.toString('hex'), encrypted.toString('hex')].join(':')
}

// 1. Find admin user by email
const usersRes = await fetch(`${supabaseUrl}/auth/v1/admin/users?per_page=1000`, { headers })
const { users } = await usersRes.json()
const admin = users?.find(u => u.email === adminEmail)

if (!admin) {
  console.error(`Admin user not found: ${adminEmail}`)
  process.exit(1)
}

const globalPassword = randomBytes(32).toString('hex')

// 2. Update Supabase auth password to global random password
const authRes = await fetch(`${supabaseUrl}/auth/v1/admin/users/${admin.id}`, {
  method: 'PUT',
  headers,
  body: JSON.stringify({ password: globalPassword }),
})
if (!authRes.ok) {
  console.error('Failed to update auth password:', await authRes.text())
  process.exit(1)
}

// 3. Upsert user_credentials
const credsRes = await fetch(`${supabaseUrl}/rest/v1/user_credentials?on_conflict=user_id`, {
  method: 'POST',
  headers: { ...headers, Prefer: 'resolution=merge-duplicates,return=minimal' },
  body: JSON.stringify({ user_id: admin.id, encrypted_password: encrypt(globalPassword) }),
})
if (!credsRes.ok) {
  console.error('Failed to upsert user_credentials:', await credsRes.text())
  process.exit(1)
}

// 4. Set hashed_password + email_verified on profile
const hashed = await bcrypt.hash(adminPassword, 12)
const profileRes = await fetch(
  `${supabaseUrl}/rest/v1/profiles?id=eq.${admin.id}&store_id=eq.${storeId}`,
  {
    method: 'PATCH',
    headers: { ...headers, Prefer: 'return=minimal' },
    body: JSON.stringify({ hashed_password: hashed, email_verified: true }),
  }
)
if (!profileRes.ok) {
  console.error('Failed to update profile:', await profileRes.text())
  process.exit(1)
}

console.log(`✓ Admin credentials seeded for ${adminEmail} in store ${storeId}`)
