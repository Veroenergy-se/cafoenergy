import { useState } from 'react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { ChevronDown } from 'lucide-react'

type Verdict = 'myth' | 'fact' | 'nuanced'

interface MythData {
  verdict: Verdict
  claim: string
  science: string
  source: string
}

const myths: MythData[] = [
  {
    verdict: 'myth',
    claim: 'Caffeine is bad for you',
    science:
      "This is the big one. Decades of research point the other way: moderate caffeine consumption is associated with <strong>reduced risk of type 2 diabetes, Parkinson's disease, and liver conditions</strong>. The FDA considers up to 400mg per day safe for healthy adults. The issue has never been caffeine itself — it's high-sugar, high-dose drinks that package it in the worst possible way. Clean caffeine, sensible dose, real food: that's the formula.",
    source: 'Poole et al., BMJ, 2017',
  },
  {
    verdict: 'fact',
    claim: 'It makes hard workouts feel easier',
    science:
      "Caffeine works by blocking adenosine receptors — adenosine is the chemical that builds up in your brain and signals fatigue. <strong>Blocking it reduces your perceived rate of exertion (RPE)</strong>, which means the same effort genuinely feels easier. High-intensity intervals, long runs, heavy sets — all of them feel more manageable. This isn't a placebo. It's one of the most replicated findings in sports science.",
    source: 'Grgic et al., British Journal of Sports Medicine, 2020',
  },
  {
    verdict: 'fact',
    claim: 'It boosts fat burning during exercise',
    science:
      "Caffeine increases the release of free fatty acids into the bloodstream, encouraging your body to use fat for fuel. This <strong>spares muscle glycogen stores for later in your session</strong>, which translates directly to better endurance. It's one of the reasons endurance athletes have used caffeine as a legal performance tool for decades.",
    source: 'Spriet, Sports Medicine, 2014',
  },
  {
    verdict: 'fact',
    claim: 'It can speed up post-workout recovery',
    science:
      "When caffeine is consumed alongside carbohydrates after intense training, research shows it can <strong>accelerate muscle glycogen replenishment by up to 66%</strong> compared to carbohydrates alone. Glycogen is your muscle's primary fuel — refilling it faster means recovering faster. Pair that with the 14g of protein in a CAFO bar and you've got a serious recovery window covered.",
    source: 'Pedersen et al., Journal of Applied Physiology, 2008',
  },
  {
    verdict: 'fact',
    claim: 'It sharpens focus during study sessions',
    science:
      "Caffeine improves the three things that matter most when you're studying: <strong>sustained attention, processing speed, and working memory</strong>. Research shows it reduces errors on tasks requiring concentration and improves recall speed — not by making you smarter, but by letting you perform closer to your actual ceiling. The sweet spot for most people is 80–100mg: enough to sharpen focus without the restless overthinking that higher doses cause. One CAFO bar lands right there.",
    source: 'Einöther & Giesbrecht, Psychopharmacology, 2013',
  },
  {
    verdict: 'fact',
    claim: 'It fights the afternoon energy dip — properly',
    science:
      "The post-lunch slump is real: adenosine levels rise, core body temperature dips slightly, and <strong>cognitive performance measurably drops between 1pm and 3pm</strong> for most people. Caffeine works by blocking the adenosine that causes that dip — which is why a mid-afternoon bar is one of the most effective uses of it. At 90mg you extend your productive work window by 2–3 hours without disrupting sleep, as long as you take it before 3pm.",
    source: 'Hilditch & McHill, Sleep Medicine Reviews, 2018',
  },
]

const verdictConfig: Record<Verdict, { border: string; badge: string; label: string }> = {
  myth:    { border: 'border-l-red-400',  badge: 'bg-red-50 text-red-600 border border-red-200',      label: 'Myth' },
  fact:    { border: 'border-l-forest',   badge: 'bg-green-50 text-green-700 border border-green-200', label: 'Fact' },
  nuanced: { border: 'border-l-gold',     badge: 'bg-amber-50 text-amber-700 border border-amber-200', label: 'Nuanced' },
}

function MythCard({ m, index }: { m: MythData; index: number }) {
  const [open, setOpen] = useState(false)
  const cfg = verdictConfig[m.verdict]

  return (
    <AnimatedSection delay={index * 0.07}>
      <div className={`border-l-4 ${cfg.border} bg-white border border-near-black/[0.06] overflow-hidden transition-shadow duration-200 ${open ? 'shadow-md' : 'hover:shadow-sm'}`}>
        <button
          className="w-full flex items-center gap-4 px-6 py-5 text-left"
          onClick={() => setOpen(!open)}
        >
          <span className={`shrink-0 px-3 py-1 text-[10px] font-bold font-accent uppercase tracking-widest ${cfg.badge}`}>
            {cfg.label}
          </span>
          <span className="flex-1 text-base sm:text-lg font-heading text-near-black leading-snug">{m.claim}</span>
          <ChevronDown className={`w-5 h-5 text-near-black/25 transition-transform duration-300 shrink-0 ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="px-6 pb-6">
            <div className="h-px bg-near-black/5 mb-5" />
            <p
              className="text-sm text-near-black/60 leading-relaxed mb-4 [&_strong]:font-semibold [&_strong]:text-near-black"
              dangerouslySetInnerHTML={{ __html: m.science }}
            />
            <p className="text-[10px] text-near-black/25 font-accent">Source: {m.source}</p>
          </div>
        )}
      </div>
    </AnimatedSection>
  )
}

function DoseSection() {
  return (
    <section className="bg-near-black py-20 sm:py-28">
      <div className="page-container">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <p className="text-[10px] font-accent font-bold text-white/25 tracking-[0.18em] uppercase mb-5">
              The 90mg sweet spot
            </p>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-heading text-white leading-tight mb-6">
              Enough to perform.<br />
              <span className="text-gold">Safe enough to stack.</span>
            </h2>
            <p className="text-white/40 font-accent text-base leading-relaxed max-w-lg mx-auto mb-16">
              The FDA recommends staying under 400mg per day. At 90mg per bar, you can have one in the morning, one at lunch, and one before your workout — and still have 130mg to spare.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-3 gap-px bg-white/10">
            {[
              { time: 'Morning',      mg: '90mg',  note: 'Wake up sharp' },
              { time: 'Midday',       mg: '180mg', note: 'Stay in it' },
              { time: 'Pre-workout',  mg: '270mg', note: '130mg to spare' },
            ].map((s, i) => (
              <AnimatedSection key={s.time} delay={i * 0.1}>
                <div className="bg-near-black px-6 py-10 flex flex-col items-center">
                  <p className="text-[10px] font-accent text-white/25 uppercase tracking-widest mb-4">{s.time}</p>
                  <p className="text-4xl sm:text-5xl font-heading text-gold mb-2">{s.mg}</p>
                  <p className="text-xs font-accent text-white/35">{s.note}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.3}>
            <p className="text-white/20 font-accent text-xs mt-8">
              3 bars across the day · 270mg total · well within the 400mg daily limit
            </p>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}

export default function CaffeineMyths() {
  return (
    <>
      {/* Dark header */}
      <section className="bg-near-black py-16 sm:py-20 lg:py-24">
        <div className="page-container">
          <AnimatedSection>
            <div className="text-center">
              <span className="inline-block text-[10px] font-accent font-bold text-white/40 tracking-widest uppercase border border-white/10 px-4 py-1.5 mb-6">
                Backed by science
              </span>
              <h2 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-heading text-white mb-4 leading-tight">
                Caffeine isn't the villain.<br />
                <span className="text-gold">Misinformation is.</span>
              </h2>
              <p className="text-white/40 text-base leading-relaxed max-w-md mx-auto mb-10">
                Most people have been told the wrong things about caffeine their whole lives. Here's what the research actually says.
              </p>
              <div className="flex justify-center gap-8 sm:gap-14">
                {[
                  { n: '70+', l: 'peer-reviewed studies' },
                  { n: '400mg', l: 'safe daily limit (FDA)' },
                  { n: '90mg', l: 'per CAFO bar' },
                ].map(s => (
                  <div key={s.l} className="text-center">
                    <div className="text-2xl font-heading text-gold">{s.n}</div>
                    <div className="text-[10px] text-white/30 mt-1 font-accent tracking-wide">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Myth cards */}
      <section className="py-20 bg-warm-white">
        <div className="page-container max-w-4xl mx-auto">
          <p className="text-[10px] font-accent font-bold text-near-black/30 tracking-[0.16em] uppercase mb-6 text-center">
            Click to see the science
          </p>
          <div className="flex flex-col gap-3">
            {myths.map((m, i) => (
              <MythCard key={m.claim} m={m} index={i} />
            ))}
          </div>
        </div>
      </section>

      <DoseSection />
    </>
  )
}
