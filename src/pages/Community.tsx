import { useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { motion, useInView } from 'framer-motion'
import AnimatedSection from '@/components/shared/AnimatedSection'
import CafoLogo from '@/components/shared/CafoLogo'

const ticker = 'SHOW UP\u00a0·\u00a0GO ALL IN\u00a0·\u00a0NO SHORTCUTS\u00a0·\u00a0CAFO ENERGY\u00a0·\u00a0'

function SlidePanel({ children, className, from }: { children: React.ReactNode; className: string; from: 'left' | 'right' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: from === 'left' ? -60 : 60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}

export default function Community() {
  const { t } = useTranslation()

  const values = [
    { title: t('community.values.v1.title'), body: t('community.values.v1.body') },
    { title: t('community.values.v2.title'), body: t('community.values.v2.body') },
    { title: t('community.values.v3.title'), body: t('community.values.v3.body') },
  ]

  const stats = [
    { n: '3',       l: t('community.statsNew.founders') },
    { n: 'Sweden',  l: t('community.statsNew.origin') },
    { n: '1',       l: t('community.statsNew.flavour') },
    { n: 'Day\u00a01', l: t('community.statsNew.founding') },
  ]

  return (
    <>
      <Helmet>
        <title>Community — CAFO Energy</title>
        <meta name="description" content="Join the CAFO Energy community. Built for students, athletes, and professionals who refuse to settle." />
      </Helmet>

      {/* Hero */}
      <section className="bg-near-black py-32 text-center">
        <AnimatedSection>
          <h1 className="text-8xl sm:text-9xl lg:text-[10rem] font-heading text-white">{t('community.title')}</h1>
          <p className="mt-4 text-white/50 font-accent text-lg max-w-xl mx-auto">{t('community.subtitle')}</p>
        </AnimatedSection>
      </section>

      {/* Split 1 — brand story */}
      <section className="bg-cream pt-40 sm:pt-56">
        <div className="grid sm:grid-cols-2">

          <div className="flex flex-col justify-end px-10 py-20 sm:px-14 lg:px-20 xl:px-28 min-h-[55vh]">
            <AnimatedSection direction="left">
              <p className="text-[10px] font-accent font-bold text-near-black/30 uppercase tracking-widest mb-5">
                {t('community.story.eyebrow')}
              </p>
              <h2 className="text-3xl sm:text-4xl font-heading text-near-black mb-5 leading-tight">
                {t('community.story.heading')}
              </h2>
              <p className="text-near-black/55 font-accent leading-relaxed mb-4 max-w-sm text-sm">
                {t('community.story.p1')}
              </p>
              <p className="text-near-black/55 font-accent leading-relaxed max-w-sm text-sm">
                {t('community.story.p2')}
              </p>
            </AnimatedSection>
          </div>

          <SlidePanel
            from="right"
            className="bg-near-black min-h-[50vh] sm:min-h-0 flex items-center justify-center overflow-hidden p-12"
          >
            <CafoLogo className="w-full max-w-xs opacity-10 select-none" invert />
          </SlidePanel>

        </div>
      </section>

      {/* Breakout quote */}
      <section className="bg-cream py-36 sm:py-52 px-8 text-center">
        <AnimatedSection direction="up">
          <p className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading text-near-black max-w-3xl mx-auto leading-tight">
            {t('community.quote')}
          </p>
        </AnimatedSection>
      </section>

      {/* Split 2 — values */}
      <section className="bg-cream">
        <div className="grid sm:grid-cols-2">

          <SlidePanel
            from="left"
            className="bg-gold min-h-[50vh] sm:min-h-0 flex items-center justify-center overflow-hidden order-last sm:order-first"
          >
            <span className="font-heading text-near-black/[0.06] select-none leading-none" style={{ fontSize: 'clamp(8rem, 18vw, 22rem)' }}>
              GO
            </span>
          </SlidePanel>

          <div className="flex flex-col justify-center px-10 py-20 sm:px-14 lg:px-20 xl:px-28 min-h-[55vh]">
            <AnimatedSection direction="right">
              <p className="text-[10px] font-accent font-bold text-near-black/30 uppercase tracking-widest mb-5">
                {t('community.values.eyebrow')}
              </p>
              <h2 className="text-3xl sm:text-4xl font-heading text-near-black mb-10 leading-tight">
                {t('community.values.heading')}
              </h2>
            </AnimatedSection>
            <div className="space-y-8">
              {values.map((v, i) => (
                <AnimatedSection key={v.title} delay={0.1 + i * 0.12} direction="up">
                  <h3 className="text-lg font-heading text-near-black mb-1">{v.title}</h3>
                  <p className="text-sm text-near-black/45 font-accent leading-relaxed max-w-xs">{v.body}</p>
                </AnimatedSection>
              ))}
            </div>
          </div>

        </div>
      </section>


      {/* Stats */}
      <section className="bg-cream py-28">
        <div className="page-container">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 text-center">
            {stats.map((s, i) => (
              <AnimatedSection key={s.l} delay={i * 0.1}>
                <div className="text-4xl sm:text-5xl font-heading text-near-black leading-none">{s.n}</div>
                <div className="text-[10px] font-accent text-near-black/30 uppercase tracking-widest mt-3">{s.l}</div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Split 3 — CTA */}
      <section className="bg-cream">
        <div className="grid sm:grid-cols-2">

          <SlidePanel
            from="left"
            className="bg-forest min-h-[50vh] sm:min-h-0 flex items-center justify-center overflow-hidden p-12"
          >
            <CafoLogo className="w-full max-w-xs opacity-10 select-none" invert />
          </SlidePanel>

          <div className="flex flex-col justify-center px-10 py-20 sm:px-14 lg:px-20 xl:px-28 min-h-[55vh]">
            <AnimatedSection direction="right">
              <p className="text-[10px] font-accent font-bold text-near-black/30 uppercase tracking-widest mb-5">
                {t('community.cta.eyebrow')}
              </p>
              <h2 className="text-3xl sm:text-4xl font-heading text-near-black mb-4 leading-tight">
                {t('community.cta.heading')}
              </h2>
              <p className="text-near-black/45 font-accent leading-relaxed mb-8 max-w-xs text-sm">
                {t('community.cta.body')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://instagram.com/cafoenergy"
                  className="inline-flex items-center justify-center px-7 py-3.5 bg-near-black text-white font-semibold font-accent rounded-full hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 text-sm"
                >
                  {t('community.cta.instagram')}
                </a>
                <a
                  href="/shop"
                  className="inline-flex items-center justify-center px-7 py-3.5 border border-near-black/20 text-near-black font-semibold font-accent rounded-full hover:bg-near-black/5 transition-all duration-200 text-sm"
                >
                  {t('community.cta.shop')}
                </a>
              </div>
            </AnimatedSection>
          </div>

        </div>
      </section>
    </>
  )
}
