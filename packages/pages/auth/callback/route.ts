import { createClient } from '@tor/lib/supabase/server'
import { supabaseAdmin } from '@tor/lib/supabase/admin'
import { getStoreId } from '@tor/lib/store-id'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirectTo = searchParams.get('redirect')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)

    // Ensure a profile exists for this store (OAuth users may not have one yet)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const storeId = getStoreId()
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id, role')
        .eq('id', user.id)
        .eq('store_id', storeId)
        .single()

      if (!profile) {
        // Google OAuth user signing into a new store — create profile without hashed_password
        await supabaseAdmin.from('profiles').insert({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
          store_id: storeId,
          hashed_password: null,
        })
      } else if (!redirectTo && profile.role === 'admin') {
        return NextResponse.redirect(`${origin}/admin`)
      }
    }
  }

  // Redirect to the original page (e.g. /checkout) or home
  const destination = redirectTo && redirectTo.startsWith('/') ? redirectTo : '/'
  return NextResponse.redirect(`${origin}${destination}`)
}
