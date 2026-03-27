import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProduct, getProducts } from '@tor/lib/actions/products'
import ProductDetailClient from './ProductDetailClient'
import ProductCard from '@tor/ui/ProductCard'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) return { title: 'Product Not Found' }

  const primaryImage = product.product_media?.find((m: { is_primary: boolean }) => m.is_primary)?.url || product.product_media?.[0]?.url

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} | ${process.env.NEXT_PUBLIC_STORE_NAME}`,
      description: product.description.slice(0, 160),
      images: primaryImage ? [primaryImage] : [],
      type: 'website',
    },
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) notFound()

  // Get related products
  let relatedProducts = []
  try {
    const result = await getProducts({ category: product.category, limit: 5 })
    relatedProducts = result.products
      .filter((p) => p.id !== product.id)
      .slice(0, 4)
  } catch { /* ignore */ }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <ProductDetailClient product={product} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-gray-100 pt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Product JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description,
            image: product.product_media?.filter((m: { type: string }) => m.type === 'image').map((m: { url: string }) => m.url),
            offers: {
              '@type': 'Offer',
              price: product.price,
              priceCurrency: 'GHS',
              availability: product.in_stock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            },
          }),
        }}
      />
    </div>
  )
}
