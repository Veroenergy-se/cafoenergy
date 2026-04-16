import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import AnimatedSection from '@/components/shared/AnimatedSection'

const moments = [
  {
    tag: 'The Sprint',
    headline: '12 hours. Four subjects. Go.',
    body: "The night before it counts. CAFO doesn't make you smarter — it just makes sure energy isn't the reason you fall short.",
    slot: 'Pre-exam',
  },
  {
    tag: 'The Session',
    headline: "The gym is empty. You're not done yet.",
    body: '90mg and 14g protein before you perform. Not an energy drink. Not a protein shake. Both, in one bar.',
    slot: '6am track',
  },
  {
    tag: 'The Push',
    headline: 'When everyone else has checked out.',
    body: "No crash at 3pm. No jitters after two. Just the same clean focus you started the day with — still there when you need it most.",
    slot: 'Deep work',
  },
]

export default function Community() {
  const { t } = useTranslation()

  return (
    <>
      <Helmet>
        <title>Community — CAFO Energy</title>
        <meta name="description" content="CAFO is for the ones who show up. Students, athletes, builders — people who refuse to coast." />
      </Helmet>

      {/* Hero */}
      <section className="bg-near-black pt-32 pb-0">
        <div className="page-container">
          <AnimatedSection>
            <p className="text-[10px] font-accent font-bold text-white/25 tracking-[0.2em] uppercase mb-8">
              {t('community.subtitle')}
            </p>
            <h1 className="text-7xl sm:text-8xl lg:text-[9rem] xl:text-[11rem] font-heading text-white leading-[0.9] mb-8">
              THIS IS<br />FOR THE<br /><span className="text-gold">2AM CROWD.</span>
            </h1>
            <p className="text-white/35 font-accent text-lg max-w-sm leading-relaxed pb-16 border-b border-white/[0.07]">
              The exam-night bar. The early-morning bar. The one more hour bar.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Photo grid — seamless dark */}
      <section className="bg-near-black pt-14 pb-24">
        <div className="page-container">
          <AnimatedSection delay={0.1}>
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-20">
              {moments.map((m) => (
                <div
                  key={m.slot}
                  className="relative aspect-[2/3] rounded-2xl sm:rounded-3xl overflow-hidden bg-white/[0.03] border border-white/[0.06]"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white/[0.05] font-heading text-4xl sm:text-6xl lg:text-7xl select-none rotate-[-8deg]">
                      CAFO
                    </span>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="text-[9px] sm:text-[10px] font-accent font-bold text-white/30 uppercase tracking-widest bg-white/[0.07] px-2.5 py-1 rounded-full border border-white/[0.08]">
                      {m.slot}
                    </span>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 px-4 pb-4 pt-16 bg-gradient-to-t from-near-black/80 to-transparent">
                    <p className="text-[11px] sm:text-xs font-accent text-white/45 leading-snug">{m.tag}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Editorial stat strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden">
              {[
                { n: '90mg', l: 'Natural caffeine. Every bar.' },
                { n: '14g', l: 'Protein. No excuses.' },
                { n: '3', l: 'Founders. Brothers.' },
                { n: '1', l: 'Flavour. Perfected.' },
              ].map((s) => (
                <div key={s.l} className="bg-near-black px-6 py-8 text-center">
                  <div className="text-4xl sm:text-5xl font-heading text-white leading-none">{s.n}</div>
                  <div className="text-[10px] font-accent text-white/22 mt-2 leading-snug">{s.l}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* "Not for everyone" statement */}
      <section className="py-24 bg-warm-white">
        <div className="page-container">
          <AnimatedSection>
            <div className="grid sm:grid-cols-2 gap-12 sm:gap-20 items-start max-w-5xl mx-auto">
              <div>
                <p className="text-[10px] font-accent font-bold text-near-black/25 tracking-[0.18em] uppercase mb-5">
                  Who we're built for
                </p>
                <h2 className="text-5xl sm:text-6xl lg:text-7xl font-heading text-near-black leading-[0.92]">
                  Not for<br />everyone.
                </h2>
              </div>
              <div className="flex flex-col justify-center gap-6 pt-2 sm:pt-14">
                <p className="text-near-black/60 font-accent leading-relaxed">
                  CAFO is for people who check ingredient labels. Who know that jitter-free focus is real. Who are tired of choosing between a candy-flavoured spike and a €5 coffee that wears off in an hour.
                </p>
                <p className="text-near-black/60 font-accent leading-relaxed">
                  If you want a bar that tastes like dessert and gives you wings for 20 minutes — this isn't it. If you want clean, sustained focus built around actual science — you're exactly who we made this for.
                </p>
                <div className="h-px bg-near-black/8" />
                <p className="text-sm font-accent text-near-black/35 italic">
                  50+ universities. 25 countries. One formula.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Moments */}
      <section className="py-24 bg-cream">
        <div className="page-container">
          <AnimatedSection>
            <p className="text-[10px] font-accent font-bold text-near-black/25 tracking-[0.18em] uppercase mb-3">
              The moments
            </p>
            <h2 className="text-4xl sm:text-5xl font-heading text-near-black mb-14 max-w-xs leading-tight">
              For the days that don't stop.
            </h2>
          </AnimatedSection>

          <div className="grid sm:grid-cols-3 gap-4">
            {moments.map((m, i) => (
              <AnimatedSection key={m.tag} delay={i * 0.1}>
                <div className="group bg-white rounded-3xl overflow-hidden border border-near-black/[0.06] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  <div className="aspect-[4/3] bg-gradient-to-br from-near-black/[0.04] to-near-black/[0.10] relative flex items-center justify-center overflow-hidden">
                    <span className="text-near-black/[0.06] font-heading text-6xl select-none">CAFO</span>
                    <span className="absolute top-4 left-4 text-[10px] font-accent font-bold text-near-black/30 uppercase tracking-widest bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-near-black/[0.07]">
                      {m.slot}
                    </span>
                  </div>
                  <div className="p-7 flex-1 flex flex-col">
                    <p className="text-[10px] font-accent font-bold text-gold uppercase tracking-widest mb-2">{m.tag}</p>
                    <h3 className="text-xl font-heading text-near-black mb-3 leading-snug">{m.headline}</h3>
                    <p className="text-sm text-near-black/45 font-accent leading-relaxed flex-1">{m.body}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Full-bleed manifesto */}
      <section className="bg-near-black py-28">
        <div className="page-container">
          <AnimatedSection>
            <div className="max-w-4xl">
              <p className="text-[10px] font-accent font-bold text-white/20 tracking-[0.18em] uppercase mb-8">
                Why we built this
              </p>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-heading text-white leading-[1.1]">
                "We got tired of reading ingredient labels that read like a chemistry exam.
                So we made a bar with{' '}
                <span className="text-gold">five things you can pronounce</span>
                {' '}and one job: keep you sharp."
              </p>
              <p className="mt-8 text-white/25 font-accent text-sm">
                — Viktor, Oscar & Linus · Founders, CAFO Energy
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-forest text-white text-center">
        <div className="page-container">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto">
              <p className="text-[10px] font-accent font-bold text-white/40 tracking-[0.18em] uppercase mb-6">
                {t('community.subtitle')}
              </p>
              <h2 className="text-5xl sm:text-6xl font-heading mb-4">{t('community.joinTitle')}</h2>
              <p className="text-white/50 font-accent text-lg max-w-sm mx-auto leading-relaxed mb-10">
                {t('community.joinDesc')}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://instagram.com/cafoenergy"
                  className="inline-flex px-8 py-4 bg-white text-forest font-semibold font-accent rounded-full hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300"
                >
                  Follow @cafoenergy
                </a>
                <a
                  href="/shop"
                  className="inline-flex px-8 py-4 bg-transparent text-white/70 font-semibold font-accent rounded-full border border-white/25 hover:bg-white/10 hover:text-white transition-all duration-300"
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
