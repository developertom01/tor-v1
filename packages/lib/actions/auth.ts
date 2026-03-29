'use server'

import { createClient } from '../supabase/server'
import { supabaseAdmin } from '../supabase/admin'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { logger } from '../logger'
import { getStoreId } from '../store-id'
import { encrypt, decrypt } from '../crypto'
import bcrypt from 'bcryptjs'
import { sendWelcomeEmail, sendNewStoreNotificationEmail, sendPasswordResetEmail } from '../email'

export async function signInWithGoogle(formData: FormData) {
  const supabase = await createClient()
  const redirectTo = formData.get('redirectTo') as string | null
  const callbackUrl = redirectTo
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`
    : `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: callbackUrl,
    },
  })

  if (error) {
    logger.error({ error }, 'Google OAuth sign-in failed')
    throw error
  }

  logger.info({ redirectTo }, 'Google OAuth sign-in initiated')
  redirect(data.url)
}

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const firstName = (formData.get('first_name') as string).trim()
  const lastName = (formData.get('last_name') as string).trim()
  const email = (formData.get('email') as string).trim()
  const password = formData.get('password') as string
  const redirectTo = formData.get('redirect_to') as string | null
  const storeId = getStoreId()
  const fullName = `${firstName} ${lastName}`

  // Check if auth.users row already exists for this email
  const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
  const existingUser = existingUsers?.users.find(u => u.email === email)

  if (existingUser) {
    // User exists in auth.users (signed up on another store).
    // Check if they already have a profile on this store.
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', existingUser.id)
      .eq('store_id', storeId)
      .single()

    if (existingProfile) {
      return { error: 'An account with this email already exists. Please sign in.' }
    }

    // New store for this user — create profile + per-store hashed password
    const hashed = await bcrypt.hash(password, 12)
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: existingUser.id,
      email,
      full_name: fullName,
      store_id: storeId,
      hashed_password: hashed,
    })

    if (profileError) {
      logger.error({ error: profileError, email, storeId }, 'Failed to create profile for existing user on new store')
      return { error: 'Failed to create account. Please try again.' }
    }

    // Sign them in using global password
    const { data: creds } = await supabaseAdmin
      .from('user_credentials')
      .select('encrypted_password')
      .eq('user_id', existingUser.id)
      .single()

    if (!creds) {
      logger.error({ email }, 'No global credentials found for existing user')
      return { error: 'Failed to sign in. Please try again.' }
    }

    const globalPassword = decrypt(creds.encrypted_password)
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: globalPassword })

    if (signInError) {
      logger.error({ error: signInError, email }, 'Failed to sign in existing user after store registration')
      return { error: 'Account created but sign-in failed. Please sign in manually.' }
    }

    await sendNewStoreNotificationEmail({ fullName, email, storeName: process.env.NEXT_PUBLIC_STORE_NAME || 'Store' })
    logger.info({ email, storeId }, 'Existing user registered on new store')
    redirect(redirectTo || '/')
  }

  // Brand new user — create auth.users row
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        store_id: storeId,
      },
    },
  })

  if (error) {
    logger.error({ error, email }, 'Email sign-up failed')
    return { error: error.message }
  }

  if (!data.user) {
    return { error: 'Sign-up failed. Please try again.' }
  }

  // Store global encrypted password (used for all future Supabase sign-ins)
  const hashed = await bcrypt.hash(password, 12)
  await supabaseAdmin.from('user_credentials').insert({
    user_id: data.user.id,
    encrypted_password: encrypt(password),
  })

  // Store per-store hashed password in profile
  // Profile row was created by handle_new_user trigger — update it with hashed_password
  await supabaseAdmin
    .from('profiles')
    .update({ hashed_password: hashed })
    .eq('id', data.user.id)
    .eq('store_id', storeId)

  await sendWelcomeEmail({ fullName, email })
  logger.info({ email, storeId }, 'New user signed up')
  redirect(redirectTo || '/')
}

export async function signInWithEmail(formData: FormData) {
  const supabase = await createClient()

  const email = (formData.get('email') as string).trim()
  const password = formData.get('password') as string
  const redirectTo = formData.get('redirect_to') as string | null
  const storeId = getStoreId()

  // 1. Check profile exists for this store
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id, hashed_password')
    .eq('email', email)
    .eq('store_id', storeId)
    .single()

  if (!profile) {
    return { error: 'No account found for this store. Please sign up first.' }
  }

  if (!profile.hashed_password) {
    // Distinguish Google OAuth users from email users who need to reset
    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(profile.id)
    const isGoogleUser = authUser.user?.identities?.some(i => i.provider === 'google')
    if (isGoogleUser) {
      return { error: 'This account uses Google sign-in. Please use the Google button.' }
    }
    return { error: 'Please reset your password to continue.' }
  }

  // 2. Verify per-store password
  const passwordMatch = await bcrypt.compare(password, profile.hashed_password)
  if (!passwordMatch) {
    logger.warn({ email, storeId }, 'Per-store password mismatch')
    return { error: 'Invalid email or password.' }
  }

  // 3. Fetch global encrypted password and sign in with Supabase
  const { data: creds } = await supabaseAdmin
    .from('user_credentials')
    .select('encrypted_password')
    .eq('user_id', profile.id)
    .single()

  if (!creds) {
    logger.error({ email, storeId }, 'No global credentials found')
    return { error: 'Sign-in failed. Please contact support.' }
  }

  const globalPassword = decrypt(creds.encrypted_password)
  const { error } = await supabase.auth.signInWithPassword({ email, password: globalPassword })

  if (error) {
    logger.error({ error, email }, 'Supabase sign-in failed after per-store password verified')
    return { error: 'Sign-in failed. Please try again.' }
  }

  logger.info({ email, storeId }, 'Email sign-in successful')
  redirect(redirectTo || '/')
}

export async function requestPasswordReset(email: string) {
  const storeId = getStoreId()

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('full_name')
    .eq('email', email)
    .eq('store_id', storeId)
    .single()

  if (!profile) {
    // Don't reveal whether account exists
    return { success: true }
  }

  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'recovery',
    email,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?redirect=/auth/reset-password`,
    },
  })

  if (error || !data.properties?.action_link) {
    logger.error({ error, email }, 'Password reset link generation failed')
    return { error: 'Failed to send reset email. Please try again.' }
  }

  await sendPasswordResetEmail({ fullName: profile.full_name, email, resetLink: data.properties.action_link })

  logger.info({ email }, 'Password reset email sent via Resend')
  return { success: true }
}

export async function updatePassword(newPassword: string) {
  const supabase = await createClient()
  const storeId = getStoreId()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  // Generate a new random global password for Supabase auth
  const { randomBytes } = await import('crypto')
  const globalPassword = randomBytes(32).toString('hex')

  // Update Supabase auth password to the new global password
  const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
    password: globalPassword,
  })
  if (authError) {
    logger.error({ error: authError }, 'Failed to update Supabase auth password')
    return { error: 'Password update failed. Please try again.' }
  }

  // Update global credentials
  const { error: credsError } = await supabaseAdmin
    .from('user_credentials')
    .upsert({ user_id: user.id, encrypted_password: encrypt(globalPassword) })
  if (credsError) {
    logger.error({ error: credsError }, 'Failed to update user_credentials')
    return { error: 'Password update failed. Please try again.' }
  }

  // Update per-store hashed password
  const hashed = await bcrypt.hash(newPassword, 12)
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({ hashed_password: hashed })
    .eq('id', user.id)
    .eq('store_id', storeId)
  if (profileError) {
    logger.error({ error: profileError }, 'Failed to update hashed_password')
    return { error: 'Password update failed. Please try again.' }
  }

  logger.info({ userId: user.id, storeId }, 'Password updated successfully')
  return { success: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  logger.info('User signed out')
  redirect('/')
}

export async function getSession() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .eq('store_id', getStoreId())
    .single()

  return data
}

export async function isAdmin() {
  const profile = await getProfile()
  return profile?.role === 'admin'
}

export async function getAdmins() {
  const { data } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, email, role')
    .eq('role', 'admin')
    .eq('store_id', getStoreId())
    .order('created_at', { ascending: true })

  return data || []
}

export async function addAdmin(email: string) {
  const caller = await getProfile()
  if (caller?.role !== 'admin') throw new Error('Unauthorized')

  const { data: profile, error: findError } = await supabaseAdmin
    .from('profiles')
    .select('id, role')
    .eq('email', email.trim().toLowerCase())
    .eq('store_id', getStoreId())
    .single()

  if (findError || !profile) {
    return { error: 'No user found with that email. They must sign up first.' }
  }

  if (profile.role === 'admin') {
    return { error: 'This user is already an admin.' }
  }

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', profile.id)
    .eq('store_id', getStoreId())

  if (error) {
    logger.error({ error, email }, 'Failed to add admin')
    return { error: 'Failed to update role.' }
  }

  logger.info({ email, promotedBy: caller.email }, 'Admin added')
  revalidatePath('/admin/settings')
  return { success: true }
}

export async function removeAdmin(userId: string) {
  const caller = await getProfile()
  if (caller?.role !== 'admin') throw new Error('Unauthorized')
  if (caller.id === userId) {
    return { error: 'You cannot remove yourself as admin.' }
  }

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ role: 'customer' })
    .eq('id', userId)
    .eq('store_id', getStoreId())

  if (error) {
    logger.error({ error, userId }, 'Failed to remove admin')
    return { error: 'Failed to update role.' }
  }

  logger.info({ userId, removedBy: caller.email }, 'Admin removed')
  revalidatePath('/admin/settings')
  return { success: true }
}
