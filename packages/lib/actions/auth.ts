'use server'

import { createClient } from '../supabase/server'
import { supabaseAdmin } from '../supabase/admin'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { logger } from '../logger'

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

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: `${firstName} ${lastName}`,
      },
    },
  })

  if (error) {
    logger.error({ error, email }, 'Email sign-up failed')
    return { error: error.message }
  }

  logger.info({ email }, 'Email sign-up successful')
  redirect(redirectTo || '/')
}

export async function signInWithEmail(formData: FormData) {
  const supabase = await createClient()

  const email = (formData.get('email') as string).trim()
  const password = formData.get('password') as string
  const redirectTo = formData.get('redirect_to') as string | null

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    logger.error({ error, email }, 'Email sign-in failed')
    return { error: error.message }
  }

  logger.info({ email }, 'Email sign-in successful')
  redirect(redirectTo || '/')
}

export async function requestPasswordReset(email: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?redirect=/auth/reset-password`,
  })

  if (error) {
    logger.error({ error, email }, 'Password reset request failed')
    return { error: error.message }
  }

  logger.info({ email }, 'Password reset email sent')
  return { success: true }
}

export async function updatePassword(newPassword: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({ password: newPassword })

  if (error) {
    logger.error({ error }, 'Password update failed')
    return { error: error.message }
  }

  logger.info('Password updated successfully')
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

  if (error) {
    logger.error({ error, userId }, 'Failed to remove admin')
    return { error: 'Failed to update role.' }
  }

  logger.info({ userId, removedBy: caller.email }, 'Admin removed')
  revalidatePath('/admin/settings')
  return { success: true }
}
