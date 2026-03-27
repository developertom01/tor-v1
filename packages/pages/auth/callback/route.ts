import { createClient } from '@tor/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirectTo = searchParams.get('redirect')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to the original page (e.g. /checkout) or home
  const destination = redirectTo && redirectTo.startsWith('/') ? redirectTo : '/'
  return NextResponse.redirect(`${origin}${destination}`)
}
