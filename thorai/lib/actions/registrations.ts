'use server'

import { createClient } from '@/lib/supabase/server'
import { createStoreRegistrationTicket } from '@/lib/linear'
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

  // 1. Save registration to Supabase
  const { data: registration, error } = await supabase
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
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  // 2. Create Linear ticket in the website builder team
  try {
    const ticket = await createStoreRegistrationTicket({
      ownerName: data.ownerName,
      businessName: data.businessName,
      category: data.category,
      locationCountry: data.locationCountry,
      locationCity: data.locationCity,
      whatsapp: data.whatsapp,
      colorPalette: data.colorPalette,
      paymentMethods: data.paymentMethods,
      userEmail: user.email ?? '',
    })

    // 3. Store the ticket ID + URL back on the registration row
    await supabase
      .from('store_registrations')
      .update({ linear_ticket_id: ticket.identifier })
      .eq('id', registration.id)
  } catch (linearError) {
    // Linear failure does not block the user — registration is already saved
    console.error('Linear ticket creation failed:', linearError)
  }
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
