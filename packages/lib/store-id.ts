/**
 * Returns the current store ID from the environment.
 * Every Vercel deployment sets NEXT_PUBLIC_STORE_ID to its store slug.
 */
export function getStoreId(): string {
  const storeId = process.env.NEXT_PUBLIC_STORE_ID
  if (!storeId) throw new Error('NEXT_PUBLIC_STORE_ID is not set')
  return storeId
}
