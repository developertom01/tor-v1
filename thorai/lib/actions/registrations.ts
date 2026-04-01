'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type RegistrationData = {
  ownerName: string
  businessName: string
  category: string
  locationCountry: string
  locationCity?: string
  whatsapp?: string
  logoUrl?: string
  colorPalette?: string
  paymentMethods: string[]
}

export async function submitRegistration(data: RegistrationData) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) redirect('/auth')

  const { error } = await supabase
    .from('store_registrations')
    .insert({
      user_id: user.id,
      owner_name: data.ownerName,
      business_name: data.businessName,
      category: data.category,
      location_country: data.locationCountry,
      location_city: data.locationCity ?? null,
      whatsapp: data.whatsapp ?? null,
      logo_url: data.logoUrl ?? null,
      color_palette: data.colorPalette ?? null,
      payment_methods: data.paymentMethods,
      status: 'pending',
    })

  if (error) throw new Error(error.message)
}

export async function getMyRegistrations() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('store_registrations')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}
