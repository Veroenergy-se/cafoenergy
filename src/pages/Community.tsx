import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import AnimatedSection from '@/components/shared/AnimatedSection'

const ticker = 'SHOW UP\u00a0·\u00a0GO ALL IN\u00a0·\u00a0NO SHORTCUTS\u00a0·\u00a0CAFO ENERGY\u00a0·\u00a0'

export default function Community() {
  const { t } = useTranslation()

  return (
    <>
      <Helmet>
        <title>Community — CAFO Energy</title>
        <meta name="description" content="Join the CAFO Energy community. Built for students, athletes, and professionals who refuse to settle." />
      </Helmet>

      {/* Hero — consistent dark header */}
      <section className="bg-near-black py-32 text-center">
        <AnimatedSection>
          <h1 className="text-8xl sm:text-9xl lg:text-[10rem] font-heading text-white">{t('community.title')}</h1>
          <p className="mt-4 text-white/50 font-accent text-lg max-w-xl mx-auto">{t('community.subtitle')}</p>
        </AnimatedSection>
      </section>

      {/* Split 1 — brand story: text left, colour panel right */}
      <section className="bg-cream">
        <div className="grid sm:grid-cols-2">

          <div className="flex flex-col justify-end px-10 py-20 sm:px-14 lg:px-20 xl:px-28 min-h-[55vh]">
            <AnimatedSection direction="left">
              <p className="text-[10px] font-accent font-bold text-near-black/30 uppercase tracking-widest mb-5">
                Our story
              </p>
              <h2 className="text-3xl sm:text-4xl font-heading text-near-black mb-5 leading-tight">
                Built to go further.
              </h2>
              <p className="text-near-black/55 font-accent leading-relaxed mb-4 max-w-sm text-sm">
                CAFO started with one question: why does performance food taste like chalk? Three founders, one kitchen, one flavour we refused to compromise on.
              </p>
              <p className="text-near-black/55 font-accent leading-relaxed max-w-sm text-sm">
                90mg caffeine. 14g plant protein. Zero added sugar. Everything there for a reason — nothing that isn't.
              </p>
            </AnimatedSection>
          </div>

          <div className="bg-near-black min-h-[50vh] sm:min-h-0 flex items-center justify-center overflow-hidden">
            <span className="font-heading text-white/[0.04] select-none leading-none" style={{ fontSize: 'clamp(8rem, 18vw, 22rem)' }}>
              CAFO
            </span>
          </div>

        </div>
      </section>

      {/* Breakout quote — full-width centred moment */}
      <section className="bg-cream py-36 sm:py-48 px-8 text-center">
        <AnimatedSection direction="scale">
          <p className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading text-near-black max-w-4xl mx-auto leading-tight">
            The alarm goes off.<br />You go anyway.
          </p>
        </AnimatedSection>
      </section>

      {/* Split 2 — values: gold panel left, text right */}
      <section className="bg-cream">
        <div className="grid sm:grid-cols-2">

          <div className="bg-gold min-h-[50vh] sm:min-h-0 flex items-center justify-center overflow-hidden order-last sm:order-first">
            <span className="font-heading text-near-black/[0.06] select-none leading-none" style={{ fontSize: 'clamp(8rem, 18vw, 22rem)' }}>
              GO
            </span>
          </div>

          <div className="flex flex-col justify-center px-10 py-20 sm:px-14 lg:px-20 xl:px-28 min-h-[55vh]">
            <AnimatedSection direction="right">
              <p className="text-[10px] font-accent font-bold text-near-black/30 uppercase tracking-widest mb-5">
                What we stand for
              </p>
              <h2 className="text-3xl sm:text-4xl font-heading text-near-black mb-10 leading-tight">
                Always go for it.
              </h2>
              <div className="space-y-8">
                {[
                  { title: 'Show up.', body: 'Whatever the day asks — be ready for it. That starts with what you put in your body.' },
                  { title: 'Go all in.', body: 'Half-effort gets half-results. CAFO is for people who commit.' },
                  { title: 'No shortcuts.', body: "Clean ingredients, real fuel. We didn't cut corners on the formula — and neither should you." },
                ].map(v => (
                  <div key={v.title}>
                    <h3 className="text-lg font-heading text-near-black mb-1">{v.title}</h3>
                    <p className="text-sm text-near-black/45 font-accent leading-relaxed max-w-xs">{v.body}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>

        </div>
      </section>

      {/* Marquee ticker */}
      <div className="bg-near-black py-4 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="text-[11px] font-accent font-bold text-white/25 uppercase tracking-[0.2em] shrink-0 px-1">
              {ticker}
            </span>
          ))}
        </div>
      </div>

      {/* Stats — clean horizontal strip */}
      <section className="bg-cream py-28">
        <div className="page-container">
          <AnimatedSection>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 text-center">
              {[
                { n: '3', l: 'Founders' },
                { n: 'Sweden', l: 'Where it started' },
                { n: '1', l: 'Flavour — perfected' },
                { n: 'Day\u00a01', l: 'Founding community' },
              ].map(s => (
                <div key={s.l}>
                  <div className="text-4xl sm:text-5xl font-heading text-near-black leading-none">{s.n}</div>
                  <div className="text-[10px] font-accent text-near-black/30 uppercase tracking-widest mt-3">{s.l}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Split 3 — CTA: forest panel left, text right */}
      <section className="bg-cream">
        <div className="grid sm:grid-cols-2">

          <div className="bg-forest min-h-[50vh] sm:min-h-0 flex items-center justify-center overflow-hidden">
            <span className="font-heading text-white/[0.05] select-none leading-none" style={{ fontSize: 'clamp(6rem, 15vw, 18rem)' }}>
              CAFO
            </span>
          </div>

          <div className="flex flex-col justify-center px-10 py-20 sm:px-14 lg:px-20 xl:px-28 min-h-[55vh]">
            <AnimatedSection direction="right">
              <p className="text-[10px] font-accent font-bold text-near-black/30 uppercase tracking-widest mb-5">
                Ready?
              </p>
              <h2 className="text-3xl sm:text-4xl font-heading text-near-black mb-4 leading-tight">
                Join the people<br />who don&apos;t wait.
              </h2>
              <p className="text-near-black/45 font-accent leading-relaxed mb-8 max-w-xs text-sm">
                Follow us on Instagram or grab your first box. Either way — you already made the first move.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://instagram.com/cafoenergy"
                  className="inline-flex items-center justify-center px-7 py-3.5 bg-near-black text-white font-semibold font-accent rounded-full hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 text-sm"
                >
                  Follow @cafoenergy
                </a>
                <a
                  href="/shop"
                  className="inline-flex items-center justify-center px-7 py-3.5 border border-near-black/20 text-near-black font-semibold font-accent rounded-full hover:bg-near-black/5 transition-all duration-200 text-sm"
                >
                  Shop the bar
                </a>
              </div>
            </AnimatedSection>
          </div>

        </div>
      </section>
    </>
  )
}
