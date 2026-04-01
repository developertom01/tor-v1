import { Star } from 'lucide-react'
import Animate from '@tor/ui/Animate'

const testimonials = [
  {
    name: 'Akosua M.',
    location: 'Accra',
    text: "Finally found prescription frames that actually look stylish. The quality is unmatched and the service was incredible. I can see AND look good.",
    rating: 5,
  },
  {
    name: 'Kwame A.',
    location: 'Accra',
    text: "Got my sunglasses within two days. The UV protection is real and they turn heads everywhere I go. Amal-shades is the real deal in Ghana.",
    rating: 5,
  },
  {
    name: 'Efua T.',
    location: 'Tema',
    text: "The coloured contacts are so natural-looking. Nobody believes they're contacts! I trust Amal-shades completely for all my eyewear needs.",
    rating: 5,
  },
]

export default function TestimonialsSection() {
  return (
    <section className="bg-brand-50 py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Animate animation="fade-up" className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="block w-8 h-px bg-gold-500" />
            <span className="text-gold-600 text-xs font-medium tracking-[0.2em] uppercase">Customer Stories</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-brand-900 leading-tight">
            Seen through
            <span className="gold-text"> our lenses.</span>
          </h2>
        </Animate>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((review, i) => (
            <Animate key={i} animation="fade-up" delay={i * 120}>
              <div className="bg-white border-l-2 border-brand-200 hover:border-brand-500 rounded-r-2xl p-8 transition-all duration-300 group">
                <div className="flex gap-0.5 mb-6">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <p className="text-brand-700 leading-relaxed mb-8 text-sm md:text-base italic">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-5 border-t border-brand-100">
                  <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">{review.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-bold text-brand-900 text-sm">{review.name}</p>
                    <p className="text-brand-400 text-xs tracking-wide">{review.location}</p>
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
