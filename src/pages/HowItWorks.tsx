import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import AnimatedSection from '@/components/shared/AnimatedSection'
import CaffeineMyths from '@/components/home/CaffeineMyths'
import { Leaf, Brain, Dumbbell, BarChart3 } from 'lucide-react'

export default function HowItWorks() {
  const { t } = useTranslation()

  const cards = [
    { titleKey: 'howItWorks.caffeineTitle', textKey: 'howItWorks.caffeineText', icon: Leaf, color: 'forest', stat: '90mg', statLabel: 'Green Tea Caffeine' },
    { titleKey: 'howItWorks.ltheanineTitle', textKey: 'howItWorks.ltheanineText', icon: Brain, color: 'gold', stat: 'Calm', statLabel: 'Focused Alertness' },
    { titleKey: 'howItWorks.proteinTitle', textKey: 'howItWorks.proteinText', icon: Dumbbell, color: 'forest', stat: '14g', statLabel: 'Plant Protein' },
    { titleKey: 'howItWorks.lowGiTitle', textKey: 'howItWorks.lowGiText', icon: BarChart3, color: 'gold', stat: 'Low', statLabel: 'Glycemic Index' },
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
        <div className="page-container">
          <div className="max-w-4xl mx-auto space-y-6">
            {cards.map((card, i) => {
              const Icon = card.icon
              const isEven = i % 2 === 0
              const isForest = card.color === 'forest'
              return (
                <AnimatedSection key={card.titleKey} direction={isEven ? 'left' : 'right'}>
                  <div className={`flex flex-col sm:flex-row gap-0 rounded-3xl overflow-hidden border border-near-black/5 bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${!isEven ? 'sm:flex-row-reverse' : ''}`}>
                    {/* Accent panel */}
                    <div className={`flex-shrink-0 sm:w-52 flex flex-col items-center justify-center gap-3 px-8 py-8 sm:py-10 ${
                      isForest ? 'bg-forest/[0.06]' : 'bg-gold/[0.06]'
                    }`}>
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        isForest ? 'bg-forest/15' : 'bg-gold/15'
                      }`}>
                        <Icon className={`w-6 h-6 ${isForest ? 'text-forest' : 'text-gold'}`} />
                      </div>
                      <div className="text-center">
                        <div className={`text-4xl font-heading leading-none ${isForest ? 'text-forest' : 'text-gold'}`}>
                          {card.stat}
                        </div>
                        <div className="text-[10px] font-accent text-near-black/35 uppercase tracking-wider mt-1.5">
                          {card.statLabel}
                        </div>
                      </div>
                    </div>

                    {/* Text panel */}
                    <div className="flex-1 px-8 py-8 sm:py-10 flex flex-col justify-center">
                      <div className="text-[10px] font-accent text-near-black/20 uppercase tracking-widest mb-2">
                        0{i + 1}
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-heading text-near-black mb-3">
                        {t(card.titleKey)}
                      </h2>
                      <p className="text-near-black/55 leading-relaxed">
                        {t(card.textKey)}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* Caffeine myths + dose calculator */}
      <CaffeineMyths />

      {/* CTA */}
      <section className="py-24 bg-forest text-white text-center">
        <div className="page-container">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto">
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
        </div>
      </section>
    </>
  )
}
