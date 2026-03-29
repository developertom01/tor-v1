import { Star } from 'lucide-react'
import Animate from '@tor/ui/Animate'

const testimonials = [
  {
    name: 'Efua M.',
    location: 'Kumasi',
    text: "The wide-leg joggers are everything. So comfortable and the fit is perfect. I wear them everywhere — to the gym, out with friends, everywhere.",
    rating: 5,
  },
  {
    name: 'Abena T.',
    location: 'Accra',
    text: "Got the spandex 2-piece set and I absolutely love it. The quality is top-tier and it fits like a glove. Fast delivery too — came in 2 days.",
    rating: 5,
  },
  {
    name: 'Yaa K.',
    location: 'Tema',
    text: "Asse's Threads is my go-to for fashion in Ghana now. The seamless bodysuit is so flattering and the fabric is incredibly soft. Will order again.",
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
            Worn with
            <span className="gold-text"> confidence.</span>
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
