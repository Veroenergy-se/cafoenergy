import { useTranslation } from 'react-i18next'
import AnimatedSection from '@/components/shared/AnimatedSection'

export default function SocialProof() {
  const { t } = useTranslation()

  const stats = [
    { key: 'socialProof.caffeine', icon: '⚡' },
    { key: 'socialProof.protein', icon: '💪' },
    { key: 'socialProof.sugar', icon: '🍃' },
    { key: 'socialProof.ltheanine', icon: '🧠' },
  ]

  return (
    <section className="bg-[#141414] py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection>
          <p className="text-center text-5xl sm:text-7xl lg:text-8xl xl:text-[5.5rem] font-heading text-[#F2EDE6] tracking-wide leading-tight mb-12">
            {t('socialProof.tagline')}
          </p>
        </AnimatedSection>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <AnimatedSection key={stat.key} delay={i * 0.1} direction="scale">
              <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/5 hover:border-gold/20 hover:bg-white/10 transition-all duration-300">
                <span className="text-2xl mb-2 block">{stat.icon}</span>
                <span className="text-sm font-semibold text-white/80 font-accent">{t(stat.key)}</span>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
