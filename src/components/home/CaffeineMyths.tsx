import { useState, useEffect } from 'react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { ChevronDown } from 'lucide-react'

type Verdict = 'myth' | 'fact' | 'nuanced'

interface Stat { n: string; l: string }
interface Bar { label: string; val: number; color: string }

interface MythData {
  verdict: Verdict
  claim: string
  science: string
  stats?: Stat[]
  bars?: Bar[]
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

const verdictStyles: Record<Verdict, string> = {
  myth: 'bg-red-50 text-red-700 border border-red-200',
  fact: 'bg-green-50 text-green-700 border border-green-200',
  nuanced: 'bg-amber-50 text-amber-700 border border-amber-200',
}

function MythCard({ m }: { m: MythData }) {
  const [open, setOpen] = useState(false)
  const [barsLive, setBarsLive] = useState(false)

  useEffect(() => {
    if (open && m.bars) {
      const t = setTimeout(() => setBarsLive(true), 60)
      return () => clearTimeout(t)
    }
    if (!open) setBarsLive(false)
  }, [open, m.bars])

  return (
    <div
      className={`rounded-2xl border overflow-hidden bg-white transition-colors duration-200 ${
        open ? 'border-gold/40' : 'border-near-black/8 hover:border-near-black/20'
      }`}
    >
      <button
        className="w-full flex items-center gap-3 px-5 py-4 text-left"
        onClick={() => setOpen(!open)}
      >
        <span
          className={`shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-accent uppercase tracking-wider ${verdictStyles[m.verdict]}`}
        >
          {m.verdict === 'nuanced' ? 'Nuanced' : m.verdict.charAt(0).toUpperCase() + m.verdict.slice(1)}
        </span>
        <span className="flex-1 text-sm font-medium font-accent text-near-black">{m.claim}</span>
        <ChevronDown
          className={`w-4 h-4 text-near-black/30 transition-transform duration-300 shrink-0 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="px-5 pb-5">
          <div className="h-px bg-near-black/5 mb-4" />

          {/* Science text — static known content, no user input */}
          <p
            className="text-sm text-near-black/60 leading-relaxed mb-4 text-center [&_strong]:font-semibold [&_strong]:text-near-black"
            dangerouslySetInnerHTML={{ __html: m.science }}
          />

          {m.stats && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {m.stats.map((s) => (
                <div
                  key={s.l}
                  className="bg-cream rounded-xl p-3 text-center border border-near-black/5"
                >
                  <div className="text-sm font-black font-accent text-gold">{s.n}</div>
                  <div className="text-[10px] text-near-black/40 mt-0.5 font-accent leading-tight">{s.l}</div>
                </div>
              ))}
            </div>
          )}

          {m.bars && (
            <div className="space-y-3 mb-4">
              {m.bars.map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between text-[11px] font-accent text-near-black/40 mb-1.5 text-left">
                    <span>{b.label}</span>
                    <span style={{ color: b.color }} className="font-bold">{b.val}%</span>
                  </div>
                  <div className="h-1.5 bg-cream rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: barsLive ? `${b.val}%` : '0%',
                        backgroundColor: b.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-[11px] text-near-black/30 font-accent text-center">Source: {m.source}</p>
        </div>
      )}
    </div>
  )
}

type BarZone = 'effective' | 'optimal' | 'safe-max'

const zoneConfig: Record<BarZone, { card: string; badge: string; dot: string; label: string; hint: string }> = {
  effective: {
    card: 'bg-near-black/[0.03] border-near-black/8',
    badge: 'bg-near-black/8 text-near-black/50',
    dot: 'bg-near-black/25',
    label: 'Effective',
    hint: 'below your personal optimal zone — still works, just not peak',
  },
  optimal: {
    card: 'bg-forest/[0.07] border-forest/20',
    badge: 'bg-forest/15 text-forest',
    dot: 'bg-forest',
    label: 'In your zone',
    hint: 'within your optimal range for focus and performance',
  },
  'safe-max': {
    card: 'bg-amber-50 border-amber-200',
    badge: 'bg-amber-100 text-amber-700',
    dot: 'bg-amber-400',
    label: 'Safe max',
    hint: 'effective, but approaching your daily limit — fine occasionally',
  },
}

function DoseCalculator() {
  const [weight, setWeight] = useState(75)

  // EFSA 3–6 mg/kg range; hard cap at 400 mg/day (FDA)
  const low  = Math.round(weight * 3)
  const high = Math.min(Math.round(weight * 6), 400)

  const barOptions = [1, 2, 3, 4].map((n) => {
    const mg = n * 90
    const zone: BarZone = mg >= low && mg <= high ? 'optimal' : mg < low ? 'effective' : 'safe-max'
    return { n, mg, zone }
  })

  return (
    <div className="rounded-2xl border border-near-black/10 overflow-hidden">
      <div className="bg-cream px-6 py-5 border-b border-near-black/10">
        <h3 className="text-lg font-semibold font-accent text-near-black">
          How many bars is right for you?
        </h3>
        <p className="text-sm text-near-black/50 mt-0.5">
          At 90mg per bar, several a day is safe — adjust by weight to see your personal range
        </p>
      </div>

      <div className="bg-white px-6 py-5">
        {/* Weight slider */}
        <div className="flex items-center gap-4 mb-7">
          <span className="text-[11px] font-accent text-near-black/40 whitespace-nowrap uppercase tracking-wider">
            Your weight
          </span>
          <input
            type="range"
            min={45}
            max={120}
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="flex-1 h-1 rounded-full accent-gold cursor-pointer"
          />
          <span className="text-sm font-bold font-accent text-gold min-w-[52px] text-right">
            {weight} kg
          </span>
        </div>

        {/* Bar count scale — 4 cards, zones update with weight */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
          {barOptions.map(({ n, mg, zone }) => {
            const cfg = zoneConfig[zone]
            return (
              <div
                key={n}
                className={`rounded-xl border p-4 text-center transition-all duration-300 ${cfg.card}`}
              >
                <div className="text-3xl font-heading text-near-black mb-0.5">{n}</div>
                <div className="text-[11px] font-accent text-near-black/40 mb-3">
                  {n === 1 ? 'bar' : 'bars'} · {mg}mg
                </div>
                <div className={`text-[10px] font-bold font-accent uppercase tracking-wider px-2.5 py-1 rounded-full inline-block ${cfg.badge}`}>
                  {cfg.label}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-1.5 mb-5 p-4 bg-cream rounded-xl">
          <p className="text-[10px] font-bold font-accent text-near-black/30 uppercase tracking-widest mb-1">
            Your range at {weight}kg — {low}mg to {high}mg
          </p>
          {(Object.entries(zoneConfig) as [BarZone, typeof zoneConfig[BarZone]][]).map(([key, cfg]) => (
            <div key={key} className="flex items-start gap-2">
              <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${cfg.dot}`} />
              <span className="text-[11px] text-near-black/50 font-accent leading-relaxed">
                <span className="font-semibold text-near-black/70">{cfg.label}</span>
                {' — '}{cfg.hint}
              </span>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-near-black/30 font-accent">
          Based on 3–6mg/kg optimal range per European Food Safety Authority guidelines.
          Individual sensitivity varies. FDA recommended maximum is 400mg/day.
        </p>
      </div>
    </div>
  )
}

export default function CaffeineMyths() {
  return (
    <>
      {/* Full-bleed dark banner */}
      <section className="bg-near-black py-16 sm:py-20 lg:py-24">
        <div className="page-container">
          <AnimatedSection>
            <div className="text-center">
              <span className="inline-block text-[10px] font-accent font-bold text-white/40 tracking-widest uppercase border border-white/10 rounded-full px-4 py-1.5 mb-6">
                Backed by science
              </span>
              <h2 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-heading text-white mb-4 leading-tight">
                Caffeine isn't the villain.
                <br />
                <span className="text-gold">Misinformation is.</span>
              </h2>
              <p className="text-white/40 text-base leading-relaxed max-w-md mx-auto mb-10">
                Most people have been told the wrong things about caffeine for years. Here's what the
                research actually says.
              </p>
              <div className="flex justify-center gap-8 sm:gap-14">
                {[
                  { n: '70+', l: 'peer-reviewed studies' },
                  { n: '400mg', l: 'safe daily limit (FDA)' },
                  { n: '90mg', l: 'per CAFO bar' },
                ].map((s) => (
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

      {/* Myth cards + dose calculator */}
      <section className="py-20 bg-warm-white">
        <div className="page-container">
          {/* Myth accordion */}
          <AnimatedSection>
            <p className="text-[10px] font-accent font-bold text-near-black/30 tracking-[0.16em] uppercase mb-3 text-center">
              Tap each myth to see the science
            </p>
            <div className="flex flex-col gap-2 mb-12">
              {myths.map((m) => (
                <MythCard key={m.claim} m={m} />
              ))}
            </div>
          </AnimatedSection>

          {/* Dose calculator */}
          <AnimatedSection delay={0.1}>
            <p className="text-[10px] font-accent font-bold text-near-black/30 tracking-[0.16em] uppercase mb-3">
              Your personal dose
            </p>
            <DoseCalculator />
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
