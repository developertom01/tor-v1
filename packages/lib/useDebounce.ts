import { useEffect, useRef } from 'react'

export function useDebounce(callback: () => void, delay: number, deps: unknown[]) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => callbackRef.current(), delay)
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
