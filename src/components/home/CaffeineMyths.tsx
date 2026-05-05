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
    claim: 'Caffeine dehydrates you',
    science:
      "This one's been scaring people away from their morning coffee for decades — and it's wrong. Yes, caffeine is a mild diuretic, but the water in your drink more than compensates. <strong>Studies show coffee hydrates you just as well as water.</strong> You'd need to consume roughly 500mg in one sitting to see any meaningful fluid loss. At 90mg, you're fine. Drink your bar, drink your water, move on.",
    source: 'Killer et al., PLOS ONE, 2014',
  },
  {
    verdict: 'myth',
    claim: 'Caffeine makes you shorter (your parents lied)',
    science:
      "A rumour so persistent it traumatised an entire generation of kids who just wanted a Coke. There is <strong>zero scientific evidence</strong> that caffeine affects height or bone growth. The myth likely started because parents needed a reason to keep kids away from coffee — reasonable parenting, terrible science. Height is almost entirely genetic. Caffeine had nothing to do with it.",
    source: 'Hallström et al., Osteoporosis International, 2006',
  },
  {
    verdict: 'nuanced',
    claim: 'Caffeine ruins your sleep',
    science:
      "Timing is everything. Caffeine has a half-life of 5–7 hours, meaning <strong>half is still active 5–7 hours after you consume it.</strong> A 90mg bar at 2pm leaves roughly 11mg circulating at midnight — well below sleep-disrupting levels. The real issue is high-dose drinks consumed late in the day. Stick to before 3pm, keep the dose sensible, and most people sleep just fine.",
    source: 'Drake et al., Journal of Clinical Sleep Medicine, 2013',
  },
  {
    verdict: 'myth',
    claim: 'Caffeine is as addictive as hard drugs',
    science:
      "Caffeine does produce physical dependence — skip it for a day and you might get a headache. But addiction is a clinical term with a high bar: compulsive use despite serious harm, loss of control, ruined relationships. <strong>Caffeine doesn't come close.</strong> The American Psychiatric Association classifies it as producing dependence, not addiction. Needing your morning coffee is a habit. Blaming it on addiction is drama.",
    source: 'American Psychiatric Association DSM-5, 2013',
  },
  {
    verdict: 'fact',
    claim: 'Caffeine is one of the best legal performance enhancers',
    science:
      "This isn't marketing — it's one of the most replicated findings in sports science. Caffeine blocks adenosine receptors, which reduces perceived effort during exercise. <strong>Meta-analyses across dozens of studies show a 3–4% average improvement in endurance and measurable gains in strength and power.</strong> It's the reason elite athletes use it before competition. It's also the reason we built CAFO around it.",
    source: 'Grgic et al., British Journal of Sports Medicine, 2020',
  },
  {
    verdict: 'nuanced',
    claim: 'More caffeine = sharper focus',
    science:
      "Up to a point, yes. After that, it actively works against you. The relationship follows an <strong>inverted U-curve</strong> — performance peaks at moderate doses and then drops as anxiety and jitteriness set in. At roughly 90mg most people hit the sweet spot: real alertness, no edge. Push past 300–400mg and you're shakier, not sharper. The goal isn't maximum caffeine — it's optimal caffeine.",
    source: 'Nehlig, Neuroscience & Biobehavioral Reviews, 2018',
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
              { time: 'Morning', mg: '90mg', note: 'Wake up sharp' },
              { time: 'Midday',  mg: '180mg', note: 'Stay in it' },
              { time: 'Pre-workout', mg: '270mg', note: '130mg to spare' },
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
