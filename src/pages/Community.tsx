import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { Users, Globe, Brain, Shield } from 'lucide-react'

export default function Community() {
  const { t } = useTranslation()

  const stats = [
    { key: 'community.stats.focus', icon: Brain, value: '∞' },
    { key: 'community.stats.universities', icon: Users, value: '50+' },
    { key: 'community.stats.compromise', icon: Shield, value: '0' },
    { key: 'community.stats.countries', icon: Globe, value: '25+' },
  ]

  return (
    <>
      <Helmet>
        <title>Community — CAFO Energy</title>
        <meta name="description" content="Join the CAFO Energy community. 50+ universities, 25+ countries, zero compromise on clean energy." />
      </Helmet>

      {/* Hero */}
      <section className="bg-near-black py-32 text-center">
        <AnimatedSection>
          <h1 className="text-8xl sm:text-9xl lg:text-[10rem] font-heading text-white">{t('community.title')}</h1>
          <p className="mt-4 text-white/50 font-accent text-lg">{t('community.subtitle')}</p>
        </AnimatedSection>
      </section>

      {/* Stats */}
      <section className="py-24 bg-warm-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <AnimatedSection key={stat.key} delay={i * 0.1}>
                  <div className="text-center p-8 bg-white rounded-3xl border border-near-black/5 hover:border-gold/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-7 h-7 text-gold" />
                    </div>
                    <span className="text-4xl font-heading text-near-black block mb-2">{stat.value}</span>
                    <p className="text-sm font-accent text-near-black/50">{t(stat.key)}</p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* Community showcase */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <AnimatedSection className="text-center">
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-3 gap-4 mb-12">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square bg-gradient-to-br from-near-black/5 to-near-black/10 rounded-3xl flex items-center justify-center">
                    <span className="text-near-black/20 font-heading text-2xl">CAFO</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-24 bg-near-black text-white text-center">
        <AnimatedSection>
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="text-6xl sm:text-7xl lg:text-8xl font-heading">{t('community.joinTitle')}</h2>
            <p className="mt-6 text-white/50 text-lg leading-relaxed">{t('community.joinDesc')}</p>
            <a
              href={`mailto:hello@cafoenergy.se?subject=Join the Movement`}
              className="mt-8 inline-flex px-8 py-4 bg-gradient-to-r from-gold to-gold-light text-near-black font-semibold font-accent rounded-full hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/20 transition-all duration-300"
            >
              {t('community.joinCta')}
            </a>
          </div>
        </AnimatedSection>
      </section>
    </>
  )
}
