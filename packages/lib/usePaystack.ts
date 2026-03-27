'use client'

import { useRef, useCallback } from 'react'

interface PaystackOptions {
  email: string
  amount: number
  reference: string
  onSuccess: () => void
  onClose: () => void
}

export function usePaystack() {
  const scriptLoaded = useRef(false)

  const loadScript = useCallback(() => {
    if (scriptLoaded.current) return Promise.resolve()
    if (document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]')) {
      scriptLoaded.current = true
      return Promise.resolve()
    }

    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://js.paystack.co/v1/inline.js'
      script.onload = () => {
        scriptLoaded.current = true
        resolve()
      }
      script.onerror = reject
      document.head.appendChild(script)
    })
  }, [])

  const pay = useCallback(async ({ email, amount, reference, onSuccess, onClose }: PaystackOptions) => {
    await loadScript()

    // @ts-expect-error Paystack inline script
    const handler = PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email,
      amount: Math.round(amount * 100),
      currency: 'GHS',
      ref: reference,
      callback: function () {
        onSuccess()
      },
      onClose: function () {
        onClose()
      },
    })
    handler.openIframe()
  }, [loadScript])

  return { pay }
}
