import { flag } from 'flags/next'
import { vercelAdapter } from '@flags-sdk/vercel'

export const online_payment = flag<boolean>({
  key: 'online_payment',
  adapter: vercelAdapter(),
  defaultValue: false,
})
