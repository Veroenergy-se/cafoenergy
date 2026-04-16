import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import AnimatedSection from '@/components/shared/AnimatedSection'

const moments = [
  {
    slot: 'Study',
    headline: 'When the deadline is tonight.',
    body: 'Hours of deep focus, no crash. Built for exam night.',
  },
  {
    slot: 'Train',
    headline: 'Before you perform.',
    body: '90mg caffeine and 14g protein. Real fuel, real effort.',
  },
  {
    slot: 'Work',
    headline: 'The 3pm wall, sorted.',
    body: 'No sugar spike. No jitters. Just clean energy through the long push.',
  },
]

export default function Community() {
  const { t } = useTranslation()

  return (
    <>
      <Helmet>
        <title>Community — CAFO Energy</title>
        <meta name="description" content="Join the CAFO Energy community. Built for students, athletes, and professionals who refuse to settle." />
      </Helmet>

      {/* Hero — consistent with all other pages */}
      <section className="bg-near-black py-32 text-center">
        <AnimatedSection>
          <h1 className="text-8xl sm:text-9xl lg:text-[10rem] font-heading text-white">{t('community.title')}</h1>
          <p className="mt-4 text-white/50 font-accent text-lg max-w-xl mx-auto">{t('community.subtitle')}</p>
        </AnimatedSection>
      </section>

      {/* Photo grid + stats */}
      <section className="py-24 bg-warm-white">
        <div className="page-container">
          <AnimatedSection>
            <div className="grid grid-cols-3 gap-4 mb-16">
              {['At the library', 'In the gym', 'On the go'].map((label) => (
                <div
                  key={label}
                  className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-near-black/[0.05] border border-near-black/[0.07]"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-near-black/[0.07] font-heading text-5xl sm:text-7xl select-none">CAFO</span>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 px-5 pb-5 pt-16 bg-gradient-to-t from-near-black/30 to-transparent">
                    <span className="text-[10px] font-accent font-bold text-near-black/40 uppercase tracking-widest">{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center border-t border-near-black/[0.07] pt-14">
              {[
                { n: '50+', l: 'Universities' },
                { n: '25', l: 'Countries' },
                { n: '90mg', l: 'Per bar, every time' },
                { n: '0g', l: 'Added sugar' },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-4xl sm:text-5xl font-heading text-near-black leading-none">{s.n}</div>
                  <div className="text-[10px] font-accent text-near-black/30 uppercase tracking-widest mt-2">{s.l}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Moments */}
      <section className="py-24 bg-cream">
        <div className="page-container">
          <AnimatedSection>
            <p className="text-[10px] font-accent font-bold text-near-black/25 tracking-[0.18em] uppercase mb-3">
              Where you'll find us
            </p>
            <h2 className="text-4xl sm:text-5xl font-heading text-near-black mb-14 leading-tight">
              For the days<br />that don't stop.
            </h2>
          </AnimatedSection>

          <div className="grid sm:grid-cols-3 gap-5">
            {moments.map((m, i) => (
              <AnimatedSection key={m.slot} delay={i * 0.1}>
                <div className="bg-white rounded-3xl overflow-hidden border border-near-black/[0.06] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 h-full flex flex-col">
                  <div className="aspect-[4/3] bg-gradient-to-br from-near-black/[0.04] to-near-black/[0.09] relative flex items-center justify-center">
                    <span className="text-near-black/[0.07] font-heading text-6xl select-none">CAFO</span>
                    <span className="absolute top-4 left-4 text-[10px] font-accent font-bold text-near-black/30 uppercase tracking-widest bg-white/80 px-3 py-1.5 rounded-full border border-near-black/[0.07]">
                      {m.slot}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-heading text-near-black mb-2">{m.headline}</h3>
                    <p className="text-sm text-near-black/45 font-accent leading-relaxed">{m.body}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — consistent with HowItWorks */}
      <section className="py-24 bg-forest text-white text-center">
        <div className="page-container">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto">
              <h2 className="text-5xl font-heading">{t('community.joinTitle')}</h2>
              <p className="mt-4 text-white/60 text-lg">{t('community.joinDesc')}</p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://instagram.com/cafoenergy"
                  className="inline-flex px-8 py-4 bg-white text-forest font-semibold font-accent rounded-full hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                >
                  Follow @cafoenergy
                </a>
                <a
                  href="/shop"
                  className="inline-flex px-8 py-4 border border-white/30 text-white/80 font-semibold font-accent rounded-full hover:bg-white/10 hover:text-white transition-all duration-300"
                >
                  Shop the bar
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
