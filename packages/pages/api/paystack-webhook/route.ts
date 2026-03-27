import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { markOrderPaid } from '@tor/lib/actions/orders'
import { logger } from '@tor/lib/logger'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('x-paystack-signature')

  // Verify webhook signature
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest('hex')

  if (hash !== signature) {
    logger.warn('Paystack webhook signature verification failed')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(body)

  logger.info({ event: event.event, reference: event.data?.reference }, 'Paystack webhook received')

  if (event.event === 'charge.success') {
    const reference = event.data.reference
    try {
      await markOrderPaid(reference)
      logger.info({ reference }, 'Webhook: order marked as paid')
    } catch (err) {
      logger.error({ error: err, reference }, 'Webhook: failed to mark order as paid')
    }
  }

  return NextResponse.json({ received: true })
}
