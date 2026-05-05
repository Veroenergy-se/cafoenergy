import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { ChevronDown } from 'lucide-react'

type Verdict = 'myth' | 'fact' | 'nuanced'

interface MythData {
  verdict: Verdict
  claim: string
  science: string
  stats?: { n: string; l: string }[]
  bars?: { label: string; val: number; color: string }[]
  source: string
}

const myths: MythData[] = [
  {
    verdict: 'nuanced',
    claim: 'Caffeine will wreck your sleep',
    science:
      "Timing matters far more than total dose. Caffeine's half-life is 5–7 hours, meaning <strong>half is still active 5–7 hours after you consume it</strong>. A 90mg bar at 2pm leaves only ~11mg in your system by midnight — well below the threshold that disrupts sleep. The problem isn't caffeine; it's late-afternoon energy drinks at 160–300mg. Keep it to before 3pm and sleep quality is unaffected for most people.",
    stats: [
      { n: '5–7h', l: 'Caffeine half-life' },
      { n: '~11mg', l: 'Active by midnight (90mg at 2pm)' },
      { n: '3pm', l: 'Recommended cutoff' },
    ],
    source: 'Drake et al., Journal of Clinical Sleep Medicine, 2013',
  },
  {
    verdict: 'myth',
    claim: 'Caffeine is addictive like drugs',
    science:
      "Caffeine does create <strong>physical dependence</strong> — stopping suddenly causes headaches for 1–2 days. But addiction involves compulsive use despite harm, loss of control, and social consequences. Caffeine doesn't meet that clinical bar. The American Psychiatric Association lists it as a substance producing dependence, not addiction — a meaningful distinction.",
    stats: [
      { n: '1–2 days', l: 'Withdrawal window' },
      { n: '0', l: 'Social harm studies' },
      { n: 'Dependence', l: 'Not addiction' },
    ],
    source: 'American Psychiatric Association DSM-5, 2013',
  },
  {
    verdict: 'fact',
    claim: 'Caffeine improves athletic performance',
    science:
      "Caffeine blocks adenosine receptors, reducing perceived effort during exercise. Meta-analyses show an average <strong>3–4% improvement in endurance performance</strong> and measurable gains in strength and power. It's one of the few legal performance enhancers consistently backed by research — which is exactly why we built CAFO around it.",
    bars: [
      { label: 'Endurance improvement', val: 82, color: '#1a4d2e' },
      { label: 'Strength gain evidence', val: 68, color: '#f59e0b' },
      { label: 'Mental performance lift', val: 91, color: '#22c55e' },
    ],
    source: 'Grgic et al., British Journal of Sports Medicine, 2020',
  },
  {
    verdict: 'myth',
    claim: 'More caffeine means sharper focus',
    science:
      'The relationship between caffeine and cognitive performance is an <strong>inverted U-curve</strong> — focus improves up to a point, then declines. Above roughly 3mg/kg body weight, anxiety, jitteriness, and reduced precision kick in and actually impair performance. At 90mg, a CAFO bar hits the sweet spot for most people: meaningful alertness without the overstimulation that comes with double espressos or 200mg+ energy drinks.',
    bars: [
      { label: 'Focus at 90mg (1 CAFO bar)', val: 88, color: '#22c55e' },
      { label: 'Focus at 200mg', val: 72, color: '#f59e0b' },
      { label: 'Focus at 400mg+', val: 41, color: '#ef4444' },
      { label: 'Anxiety at 400mg+', val: 76, color: '#ef4444' },
    ],
    source: 'Nehlig, Neuroscience & Biobehavioral Reviews, 2018',
  },
  {
    verdict: 'nuanced',
    claim: 'Caffeine causes anxiety and crashes',
    science:
      'Partially true — but dose and timing are everything. At <strong>low-to-moderate doses (90–200mg)</strong>, most people experience improved alertness and mood. Anxiety becomes an issue above ~400mg or in people with genetic sensitivity. Crashes happen when caffeine is paired with sugar — not protein and fiber. Each CAFO bar pairs 90mg of natural caffeine with 14g protein and 5g fiber specifically to avoid this.',
    bars: [
      { label: 'Anxiety risk at 90mg', val: 8, color: '#22c55e' },
      { label: 'Anxiety risk at 400mg+', val: 71, color: '#ef4444' },
      { label: 'Crash risk with sugar', val: 85, color: '#ef4444' },
      { label: 'Crash risk with protein + fiber', val: 12, color: '#1a4d2e' },
    ],
    source: 'Nehlig, Neuroscience & Biobehavioral Reviews, 2018',
  },
  {
    verdict: 'fact',
    claim: 'Natural and synthetic caffeine are chemically identical',
    science:
      'Molecularly, caffeine is caffeine — the natural version from green tea plants and the synthetic version are <strong>chemically identical (C₈H₁₀N₄O₂)</strong>. The difference is what comes with it. Natural caffeine arrives alongside antioxidants and trace cofactors that may smooth the onset. CAFO uses green tea caffeine for exactly this reason.',
    stats: [
      { n: '100%', l: 'Same molecule' },
      { n: 'Green tea', l: "CAFO's source" },
      { n: 'Smoother', l: 'Onset reported' },
    ],
    source: 'Temple et al., Nutrients, 2017',
  },
]

const verdictConfig: Record<Verdict, { border: string; badge: string; label: string }> = {
  myth:    { border: 'border-l-red-400',   badge: 'bg-red-50 text-red-600 border border-red-200',     label: 'Myth' },
  fact:    { border: 'border-l-forest',    badge: 'bg-green-50 text-green-700 border border-green-200', label: 'Fact' },
  nuanced: { border: 'border-l-gold',      badge: 'bg-amber-50 text-amber-700 border border-amber-200', label: 'Nuanced' },
}

function MythCard({ m, index }: { m: MythData; index: number }) {
  const [open, setOpen] = useState(false)
  const [barsLive, setBarsLive] = useState(false)
  const cfg = verdictConfig[m.verdict]

  useEffect(() => {
    if (open && m.bars) {
      const t = setTimeout(() => setBarsLive(true), 60)
      return () => clearTimeout(t)
    }
    if (!open) setBarsLive(false)
  }, [open, m.bars])

  return (
    <AnimatedSection delay={index * 0.07}>
      <div className={`border-l-4 ${cfg.border} bg-white border border-near-black/[0.06] overflow-hidden transition-all duration-200 ${open ? 'shadow-md' : 'hover:shadow-sm'}`}>
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
              className="text-sm text-near-black/60 leading-relaxed mb-5 [&_strong]:font-semibold [&_strong]:text-near-black"
              dangerouslySetInnerHTML={{ __html: m.science }}
            />
            {m.stats && (
              <div className="grid grid-cols-3 gap-3 mb-5">
                {m.stats.map(s => (
                  <div key={s.l} className="bg-cream p-4 text-center border border-near-black/5">
                    <div className="text-lg font-heading text-near-black">{s.n}</div>
                    <div className="text-[10px] text-near-black/40 mt-1 font-accent leading-tight">{s.l}</div>
                  </div>
                ))}
              </div>
            )}
            {m.bars && (
              <div className="space-y-3 mb-5">
                {m.bars.map(b => (
                  <div key={b.label}>
                    <div className="flex justify-between text-[11px] font-accent text-near-black/40 mb-1.5">
                      <span>{b.label}</span>
                      <span style={{ color: b.color }} className="font-bold">{b.val}%</span>
                    </div>
                    <div className="h-1.5 bg-cream overflow-hidden">
                      <div
                        className="h-full transition-all duration-700 ease-out"
                        style={{ width: barsLive ? `${b.val}%` : '0%', backgroundColor: b.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p className="text-[10px] text-near-black/25 font-accent">Source: {m.source}</p>
          </div>
        )}
      </div>
    </AnimatedSection>
  )
}

const drinks = [
  { name: 'CAFO bar',        mg: 90,  natural: true,  cafo: true,  note: '90mg natural green tea caffeine' },
  { name: 'Espresso',        mg: 65,  natural: true,  cafo: false, note: 'No protein — no sustained energy' },
  { name: 'NOCCO (330ml)',   mg: 180, natural: false, cafo: false, note: '2× the dose, synthetic caffeine' },
  { name: 'Celsius (355ml)', mg: 200, natural: false, cafo: false, note: 'Half your daily limit in one can' },
]

const DAILY_LIMIT = 400

const daySteps = [
  { time: '7–9am',  label: 'Morning',    bar: 1, total: 90,  note: 'Wake up focused, not wired' },
  { time: '12pm',   label: 'Midday',     bar: 2, total: 180, note: 'Sustain through the afternoon' },
  { time: '3–5pm',  label: 'Pre-workout',bar: 3, total: 270, note: '130mg under the daily limit' },
]

function AnimatedBar({ pct, color, delay = 0 }: { pct: number; color: string; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <div ref={ref} className="h-full rounded-sm overflow-hidden" style={{ backgroundColor: `${color}20` }}>
      <motion.div
        className="h-full rounded-sm"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={inView ? { width: `${pct}%` } : { width: 0 }}
        transition={{ duration: 0.9, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
    </div>
  )
}

function SmartDoseSection() {
  return (
    <section className="bg-near-black py-20 sm:py-28">
      <div className="page-container">
        <AnimatedSection>
          <div className="max-w-5xl mx-auto">

            {/* Header */}
            <div className="mb-14">
              <p className="text-[10px] font-accent font-bold text-white/25 tracking-[0.18em] uppercase mb-4">
                The 90mg advantage
              </p>
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-heading text-white leading-tight mb-4">
                Not just less caffeine.<br />
                <span className="text-gold">Smarter caffeine.</span>
              </h2>
              <p className="text-white/45 font-accent text-lg max-w-xl leading-relaxed">
                At 90mg per bar you can stack multiple CAFO bars across your day and stay well within safe limits — something that's impossible with a Celsius or NOCCO.
              </p>
            </div>

            {/* Comparison bars */}
            <div className="mb-14">
              <p className="text-[10px] font-accent font-bold text-white/25 tracking-[0.18em] uppercase mb-6">
                Caffeine per serving — vs 400mg daily limit
              </p>
              <div className="space-y-4">
                {drinks.map((d, i) => {
                  const pct = (d.mg / DAILY_LIMIT) * 100
                  const color = d.cafo ? '#f59e0b' : d.mg > 150 ? '#ef4444' : '#6b7280'
                  return (
                    <div key={d.name} className="grid grid-cols-[160px_1fr_60px] sm:grid-cols-[200px_1fr_70px] items-center gap-4">
                      <div>
                        <span className={`text-sm font-heading ${d.cafo ? 'text-gold' : 'text-white/50'}`}>{d.name}</span>
                        {d.cafo && <span className="ml-2 text-[9px] font-accent font-bold text-gold/60 uppercase tracking-wider">Natural</span>}
                      </div>
                      <div className="h-7">
                        <AnimatedBar pct={pct} color={color} delay={i * 0.1} />
                      </div>
                      <span className={`text-sm font-heading text-right ${d.cafo ? 'text-gold' : 'text-white/40'}`}>{d.mg}mg</span>
                    </div>
                  )
                })}
                {/* 400mg limit line */}
                <div className="grid grid-cols-[160px_1fr_60px] sm:grid-cols-[200px_1fr_70px] items-center gap-4 pt-2">
                  <span className="text-[10px] font-accent text-white/20 uppercase tracking-wider">FDA daily limit</span>
                  <div className="border-t border-dashed border-white/20 relative">
                    <span className="absolute -top-3 right-0 text-[10px] font-accent text-white/20">400mg</span>
                  </div>
                  <span className="text-sm font-heading text-white/20 text-right">400mg</span>
                </div>
              </div>
            </div>

            {/* Stack your day */}
            <div className="mb-10">
              <p className="text-[10px] font-accent font-bold text-white/25 tracking-[0.18em] uppercase mb-6">
                Stack your day — one bar at a time
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                {daySteps.map((s, i) => (
                  <AnimatedSection key={s.label} delay={i * 0.1}>
                    <div className="border border-white/10 p-6 hover:border-gold/30 transition-colors duration-300">
                      <div className="text-[10px] font-accent text-white/25 uppercase tracking-widest mb-3">{s.time}</div>
                      <div className="text-4xl font-heading text-gold mb-1">{s.total}mg</div>
                      <div className="text-sm font-heading text-white mb-3">{s.label} — bar {s.bar}</div>
                      <div className="h-px bg-white/10 mb-3" />
                      <p className="text-xs font-accent text-white/35 leading-relaxed">{s.note}</p>
                      {/* Progress toward 400mg limit */}
                      <div className="mt-4 h-1 bg-white/10 overflow-hidden">
                        <motion.div
                          className="h-full bg-gold"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(s.total / DAILY_LIMIT) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.15 + 0.3 }}
                        />
                      </div>
                      <p className="text-[9px] font-accent text-white/20 mt-1">{s.total}mg of 400mg daily limit</p>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>

            {/* vs Celsius callout */}
            <div className="border border-white/10 bg-white/[0.03] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
              <div>
                <p className="text-white/30 text-xs font-accent uppercase tracking-widest mb-2">Compare that to</p>
                <p className="text-white font-heading text-2xl sm:text-3xl leading-tight">
                  2 Celsius = <span className="text-red-400">400mg</span><br />
                  <span className="text-white/50 text-xl">Your entire daily limit. Before lunch.</span>
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-gold font-heading text-4xl">3 bars</p>
                <p className="text-white/40 font-accent text-sm">= 270mg, still 130mg to spare</p>
              </div>
            </div>

          </div>
        </AnimatedSection>
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
                Most people have been told the wrong things about caffeine for years. Here's what the research actually says.
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
            Click each myth to see the science
          </p>
          <div className="flex flex-col gap-3">
            {myths.map((m, i) => (
              <MythCard key={m.claim} m={m} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Smart dose — replaces slider */}
      <SmartDoseSection />
    </>
  )
}
