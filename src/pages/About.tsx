import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import AnimatedSection from '@/components/shared/AnimatedSection'

export default function About() {
  const { t } = useTranslation()

  return (
    <>
      <Helmet>
        <title>Our Story — CAFO Energy</title>
        <meta name="description" content="Three brothers, one mission. Learn how CAFO Energy started and why we're building the clean energy movement." />
      </Helmet>

      {/* Hero */}
      <section className="relative bg-near-black py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-near-black to-near-black/95" />
        <AnimatedSection className="relative z-10">
          <h1 className="text-8xl sm:text-9xl lg:text-[10rem] font-heading text-white">{t('about.heroTitle')}</h1>
        </AnimatedSection>
      </section>

      {/* Founders story */}
      <section className="py-24 bg-warm-white">
        <div className="page-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
              <h2 className="text-4xl sm:text-5xl font-heading text-near-black leading-tight">
                {t('about.foundersTitle')}
              </h2>
              <p className="mt-6 text-near-black text-lg leading-relaxed">
                {t('about.foundersText')}
              </p>
            </AnimatedSection>
            <AnimatedSection direction="right">
              <div className="aspect-[4/3] overflow-hidden bg-cream">
                <img
                  src="/images/founders.jpg"
                  alt="CAFO Energy founders"
                  className="w-full h-full object-cover"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="py-24 bg-warm-white">
        <div className="page-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left" className="order-2 lg:order-1">
              <div className="aspect-[4/3] overflow-hidden bg-warm-white">
                <img
                  src="/images/product-studio.jpg"
                  alt="CAFO Energy bar"
                  className="w-full h-full object-cover"
                />
              </div>
            </AnimatedSection>
            <AnimatedSection direction="right" className="order-1 lg:order-2">
              <h2 className="text-4xl sm:text-5xl font-heading text-near-black leading-tight">
                {t('about.journeyTitle')}
              </h2>
              <p className="mt-6 text-near-black text-lg leading-relaxed">
                {t('about.journeyText')}
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-near-black text-white text-center">
        <div className="page-container">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-6xl sm:text-7xl lg:text-8xl font-heading">{t('about.missionTitle')}</h2>
              <p className="mt-8 text-white text-lg leading-relaxed">
                {t('about.missionText')}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
