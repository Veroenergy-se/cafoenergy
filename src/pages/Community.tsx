import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { Leaf, Brain, Zap } from 'lucide-react'

const moments = [
  {
    tag: 'Study',
    title: 'When the deadline is tonight.',
    desc: 'Hours of deep focus without the jitters. Clean caffeine that keeps you locked in, not wired.',
  },
  {
    tag: 'Train',
    title: 'Before you perform.',
    desc: '90mg of green tea caffeine and 14g protein. Real fuel for real effort.',
  },
  {
    tag: 'Create',
    title: 'When ideas need to flow.',
    desc: 'No crash, no anxiety. Just clear thinking and sustained energy for the long session.',
  },
]

const values = [
  {
    icon: Leaf,
    title: 'Clean fuel only.',
    desc: 'No artificial stimulants. No added sugar. Every ingredient is there because it earns its place.',
  },
  {
    icon: Brain,
    title: 'Real focus, not jitters.',
    desc: 'Green tea caffeine and L-theanine — the combination that enhances attention without the edge.',
  },
  {
    icon: Zap,
    title: 'Zero compromise.',
    desc: "We won't water down the formula to hit a price point. You deserve the full thing.",
  },
]

const photoLabels = ['At the library', 'In the gym', 'At the desk']

export default function Community() {
  const { t } = useTranslation()

  return (
    <>
      <Helmet>
        <title>Community — CAFO Energy</title>
        <meta name="description" content="Join the CAFO Energy community. Built for students, athletes, and professionals who refuse to settle for junk energy." />
      </Helmet>

      {/* Hero */}
      <section className="bg-near-black pt-32 pb-0 text-center">
        <div className="page-container">
          <AnimatedSection>
            <span className="inline-block text-[10px] font-accent font-bold text-white/30 tracking-widest uppercase border border-white/10 rounded-full px-4 py-1.5 mb-8">
              {t('community.subtitle')}
            </span>
            <h1 className="text-8xl sm:text-9xl lg:text-[10rem] font-heading text-white leading-none">
              {t('community.title')}
            </h1>
            <p className="mt-6 text-white/35 font-accent text-xl max-w-md mx-auto leading-relaxed">
              For the ones who refuse to coast.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Photo grid — seamless from hero */}
      <section className="bg-near-black pt-16 pb-24">
        <div className="page-container">
          <AnimatedSection delay={0.15}>
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-20">
              {photoLabels.map((label) => (
                <div
                  key={label}
                  className="relative aspect-[2/3] rounded-2xl sm:rounded-3xl overflow-hidden bg-white/[0.03] border border-white/[0.07]"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white/[0.06] font-heading text-5xl sm:text-7xl select-none">CAFO</span>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 px-4 pb-4 pt-12 bg-gradient-to-t from-near-black/60 to-transparent">
                    <span className="text-[9px] sm:text-[10px] font-accent font-bold text-white/40 uppercase tracking-widest">
                      {label}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats strip */}
            <div className="border-t border-white/[0.07] pt-12 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
              {[
                { n: '50+', l: 'Universities' },
                { n: '25', l: 'Countries' },
                { n: '∞', l: 'Focus sessions' },
                { n: '0', l: 'Compromises made' },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-5xl sm:text-6xl font-heading text-white leading-none">{s.n}</div>
                  <div className="text-[10px] font-accent text-white/20 uppercase tracking-widest mt-2.5">{s.l}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Moments */}
      <section className="py-24 bg-warm-white">
        <div className="page-container">
          <AnimatedSection>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
              <div>
                <p className="text-[10px] font-accent font-bold text-near-black/25 tracking-[0.16em] uppercase mb-3">
                  Where you'll find us
                </p>
                <h2 className="text-4xl sm:text-5xl font-heading text-near-black leading-tight">
                  For the days<br />that don't stop.
                </h2>
              </div>
              <p className="text-sm text-near-black/40 font-accent max-w-xs leading-relaxed sm:text-right">
                CAFO was built for the specific moments when ordinary energy just doesn't cut it.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
            {moments.map((m, i) => (
              <AnimatedSection key={m.tag} delay={i * 0.1}>
                <div className="group rounded-3xl overflow-hidden border border-near-black/[0.06] bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  <div className="aspect-[4/3] bg-gradient-to-br from-near-black/[0.05] to-near-black/[0.09] relative flex items-center justify-center overflow-hidden">
                    <span className="text-near-black/[0.07] font-heading text-6xl select-none">CAFO</span>
                    <span className="absolute top-4 left-4 text-[10px] font-accent font-bold text-near-black/35 uppercase tracking-widest bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-near-black/[0.06]">
                      {m.tag}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-heading text-near-black mb-2">{m.title}</h3>
                    <p className="text-sm text-near-black/45 font-accent leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-cream">
        <div className="page-container">
          <AnimatedSection>
            <p className="text-[10px] font-accent font-bold text-near-black/25 tracking-[0.16em] uppercase mb-3 text-center">
              What we stand for
            </p>
            <h2 className="text-4xl sm:text-5xl font-heading text-near-black mb-14 text-center">
              No shortcuts.
            </h2>
          </AnimatedSection>

          <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
            {values.map((v, i) => {
              const Icon = v.icon
              return (
                <AnimatedSection key={v.title} delay={i * 0.1}>
                  <div className="bg-white rounded-3xl p-8 border border-near-black/[0.06] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 h-full flex flex-col">
                    <div className="w-10 h-10 rounded-xl bg-near-black/[0.05] flex items-center justify-center mb-5">
                      <Icon className="w-5 h-5 text-near-black/40" />
                    </div>
                    <h3 className="text-xl font-heading text-near-black mb-3">{v.title}</h3>
                    <p className="text-sm text-near-black/45 font-accent leading-relaxed">{v.desc}</p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* Full-bleed manifesto strip */}
      <section className="py-20 bg-near-black">
        <div className="page-container">
          <AnimatedSection>
            <blockquote className="text-center max-w-3xl mx-auto">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-heading text-white leading-tight">
                "We're not for everyone. We're for the ones who{' '}
                <span className="text-gold">show up</span>."
              </p>
              <footer className="mt-6 text-[11px] font-accent text-white/25 uppercase tracking-widest">
                — The CAFO Team
              </footer>
            </blockquote>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-forest text-white text-center">
        <div className="page-container">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto">
              <h2 className="text-5xl sm:text-6xl font-heading">{t('community.joinTitle')}</h2>
              <p className="mt-4 text-white/55 font-accent text-lg max-w-sm mx-auto leading-relaxed">
                {t('community.joinDesc')}
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://instagram.com/cafoenergy"
                  className="inline-flex px-8 py-4 bg-white text-forest font-semibold font-accent rounded-full hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300"
                >
                  Follow on Instagram
                </a>
                <a
                  href="mailto:hello@cafoenergy.se"
                  className="inline-flex px-8 py-4 bg-transparent text-white/70 font-semibold font-accent rounded-full border border-white/25 hover:bg-white/10 hover:text-white transition-all duration-300"
                >
                  Get in touch
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
