import { getProducts } from '@tor/lib/actions/products'
import type { ProductWithMedia } from '@tor/lib/types'
import HeroSection from './_components/HeroSection'
import CategoriesSection from './_components/CategoriesSection'
import FeaturedProductsSection from './_components/FeaturedProductsSection'
import ValuesSection from './_components/ValuesSection'
import TestimonialsSection from './_components/TestimonialsSection'
import CtaSection from './_components/CtaSection'

export default async function HomePage() {
  let featuredProducts: ProductWithMedia[] = []
  try {
    const result = await getProducts({ featured: true, limit: 8 })
    featuredProducts = result.products
  } catch {
    // DB not set up yet — show empty state
  }

  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProductsSection products={featuredProducts} />
      <ValuesSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  )
}
