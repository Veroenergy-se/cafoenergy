import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { Leaf, Brain, Dumbbell, BarChart3 } from 'lucide-react'

export default function HowItWorks() {
  const { t } = useTranslation()

  const sections = [
    { titleKey: 'howItWorks.caffeineTitle', textKey: 'howItWorks.caffeineText', icon: Leaf, color: 'forest' },
    { titleKey: 'howItWorks.ltheanineTitle', textKey: 'howItWorks.ltheanineText', icon: Brain, color: 'gold' },
    { titleKey: 'howItWorks.proteinTitle', textKey: 'howItWorks.proteinText', icon: Dumbbell, color: 'forest' },
    { titleKey: 'howItWorks.lowGiTitle', textKey: 'howItWorks.lowGiText', icon: BarChart3, color: 'gold' },
  ]

  return (
    <>
      <Helmet>
        <title>How It Works — CAFO Energy</title>
        <meta name="description" content="The science behind CAFO Energy. Green tea caffeine, L-theanine, plant protein — how they work together for sustained focus." />
      </Helmet>

      <section className="bg-near-black py-32 text-center">
        <AnimatedSection>
          <h1 className="text-8xl sm:text-9xl lg:text-[10rem] font-heading text-white">{t('howItWorks.title')}</h1>
          <p className="mt-4 text-white/50 font-accent text-lg max-w-xl mx-auto">{t('howItWorks.subtitle')}</p>
        </AnimatedSection>
      </section>

      <section className="py-24 bg-warm-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 space-y-16">
          {sections.map((section, i) => {
            const Icon = section.icon
            const isEven = i % 2 === 0
            return (
              <AnimatedSection key={section.titleKey} direction={isEven ? 'left' : 'right'}>
                <div className="flex gap-8 items-start">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center ${
                    section.color === 'forest' ? 'bg-forest/10' : 'bg-gold/10'
                  }`}>
                    <Icon className={`w-7 h-7 ${section.color === 'forest' ? 'text-forest' : 'text-gold'}`} />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-heading text-near-black mb-4">
                      {t(section.titleKey)}
                    </h2>
                    <p className="text-near-black/60 text-lg leading-relaxed">
                      {t(section.textKey)}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-forest text-white text-center">
        <AnimatedSection>
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="text-5xl font-heading">Ready to Focus?</h2>
            <p className="mt-4 text-white/60 text-lg">Experience clean, sustained energy with CAFO.</p>
            <a
              href="/shop"
              className="mt-8 inline-flex px-8 py-4 bg-white text-forest font-semibold font-accent rounded-full hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              Shop Now
            </a>
          </div>
        </AnimatedSection>
      </section>
    </>
  )
}
