import { Star } from 'lucide-react'
import Animate from '@tor/ui/Animate'

const testimonials = [
  {
    name: 'Adwoa B.',
    location: 'Accra',
    text: "I've tried so many wig shops in Accra but Hair For Days is on a different level. The quality is unmatched and my wig stayed flawless for months!",
    rating: 5,
  },
  {
    name: 'Nana A.',
    location: 'Kumasi',
    text: "Ordered a lace front wig and it arrived the next day. The hairline is so natural — I've been getting compliments everywhere I go.",
    rating: 5,
  },
  {
    name: 'Maame O.',
    location: 'Tema',
    text: "They helped me pick the right shade and the wig looks absolutely stunning on me. Best hair purchase I've ever made in Ghana.",
    rating: 5,
  },
]

export default function TestimonialsSection() {
  return (
    <section className="bg-brand-50 py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Animate animation="fade-up" className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="block w-8 h-px bg-gold-500" />
            <span className="text-gold-600 text-xs font-medium tracking-[0.2em] uppercase">Testimonials</span>
            <span className="block w-8 h-px bg-gold-500" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-brand-900">
            Loved across
            <span className="gold-text"> Ghana.</span>
          </h2>
        </Animate>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((review, i) => (
            <Animate key={i} animation="fade-up" delay={i * 120}>
              <div className="bg-white border border-brand-100 rounded-2xl p-8">
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <p className="text-brand-700 leading-relaxed mb-8 text-sm md:text-base">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-brand-100">
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                    <span className="text-brand-600 text-xs font-bold">{review.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-brand-900 text-sm">{review.name}</p>
                    <p className="text-brand-400 text-xs">{review.location}</p>
                  </div>
                </div>
              </div>
            </Animate>
          ))}
        </div>
      </div>
    </section>
  )
}
