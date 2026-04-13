import { useTranslation } from 'react-i18next'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { BookOpen, Briefcase, Plane, Star } from 'lucide-react'

export default function Testimonials() {
  const { t } = useTranslation()

  const cards = [
    { key: 'study', icon: BookOpen, gradient: 'from-blue-500/10 to-blue-600/5' },
    { key: 'work', icon: Briefcase, gradient: 'from-gold/10 to-amber-500/5' },
    { key: 'travel', icon: Plane, gradient: 'from-forest/10 to-green-500/5' },
    { key: 'firstImpressions', icon: Star, gradient: 'from-purple-500/10 to-purple-600/5' },
  ]

  return (
    <section className="py-24 bg-warm-white">
      <div className="page-container">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-6xl sm:text-7xl lg:text-8xl font-heading text-near-black">
            {t('testimonials.title')}
          </h2>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => {
            const Icon = card.icon
            return (
              <AnimatedSection key={card.key} delay={i * 0.1}>
                <div className={`group bg-gradient-to-br ${card.gradient} rounded-3xl p-8 border border-near-black/5 hover:border-near-black/10 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 h-full`}>
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 text-near-black" />
                  </div>
                  <h3 className="text-lg font-semibold font-accent text-near-black mb-3">
                    {t(`testimonials.${card.key}.title`)}
                  </h3>
                  <p className="text-sm text-near-black/50 leading-relaxed">
                    {t(`testimonials.${card.key}.description`)}
                  </p>
                </div>
              </AnimatedSection>
            )
          })}
        </div>
      </div>
    </section>
  )
}
