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
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {cards.map((card, i) => {
              const Icon = card.icon
              return (
                <AnimatedSection key={card.titleKey} delay={i * 0.1} direction="scale">
                  <div className="bg-white rounded-3xl p-8 border border-near-black/5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        card.color === 'forest' ? 'bg-forest/10' : 'bg-gold/10'
                      }`}>
                        <Icon className={`w-5 h-5 ${card.color === 'forest' ? 'text-forest' : 'text-gold'}`} />
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-heading ${card.color === 'forest' ? 'text-forest' : 'text-gold'}`}>{card.stat}</div>
                        <div className="text-[10px] font-accent text-near-black/30 uppercase tracking-wider">{card.statLabel}</div>
                      </div>
                    </div>
                    <h2 className="text-xl font-heading text-near-black mb-3">
                      {t(card.titleKey)}
                    </h2>
                    <p className="text-near-black/55 text-sm leading-relaxed flex-1">
                      {t(card.textKey)}
                    </p>
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
