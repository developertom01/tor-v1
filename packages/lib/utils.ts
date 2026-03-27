export const MAX_MEDIA_PER_PRODUCT = 5
export const MAX_MEDIA_PER_VARIANT = 5

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
  }).format(amount)
}

export function slugify(text: string): string {
  const base = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
  const short = crypto.randomUUID().slice(0, 8)
  return `${base}-${short}`
}
