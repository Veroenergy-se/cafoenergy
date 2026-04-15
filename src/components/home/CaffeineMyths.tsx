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
    verdict: 'myth',
    claim: 'Caffeine dehydrates you',
    science:
      'This one comes from old studies on very high doses given to people who rarely consumed caffeine. At normal doses — including 90mg — caffeine has <strong>no meaningful diuretic effect</strong> in regular consumers. A 2003 review in the Journal of Human Nutrition found that caffeinated drinks contribute to daily fluid intake just as well as water.',
    stats: [
      { n: '90mg', l: 'No net fluid loss' },
      { n: '≥500mg', l: 'Mild diuretic effect' },
      { n: 'Regular use', l: 'Full tolerance built' },
    ],
    source: 'Maughan & Griffin, Journal of Human Nutrition and Dietetics, 2003',
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
    claim: 'Caffeine stunts growth in young people',
    science:
      'This myth originated from early observational studies that confused correlation with causation. <strong>No controlled study has shown a causal link</strong> between normal caffeine consumption and reduced bone density or height in adolescents. The myth has persisted since the 1980s without scientific backing.',
    stats: [
      { n: '0', l: 'Causal studies found' },
      { n: '1980s', l: 'Myth originated' },
      { n: 'Still', l: 'Widely believed' },
    ],
    source: 'Lloyd et al., American Journal of Clinical Nutrition, 1997',
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

const caffeineSources = [
  { name: 'Espresso', mg: 63, per: '30ml shot' },
  { name: 'Filter coffee', mg: 95, per: '200ml cup' },
  { name: 'CAFO bar', mg: 90, per: '1 bar', highlight: true },
  { name: 'Red Bull', mg: 80, per: '250ml can' },
  { name: 'Green tea', mg: 30, per: '200ml cup' },
  { name: 'Pre-workout', mg: 300, per: '1 serving' },
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
            className="text-sm text-near-black/60 leading-relaxed mb-4 [&_strong]:font-semibold [&_strong]:text-near-black"
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
                  <div className="flex justify-between text-[11px] font-accent text-near-black/40 mb-1.5">
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

          <p className="text-[11px] text-near-black/30 font-accent">Source: {m.source}</p>
        </div>
      )}
    </div>
  )
}

function DoseCalculator() {
  const [weight, setWeight] = useState(75)

  const low = Math.round(weight * 3)
  const opt = Math.round(weight * 4.5)
  // FDA limit 400mg / 90mg per bar = 4 bars max (360mg, safely under 400mg)
  const maxBars = Math.min(4, Math.floor(400 / 90))
  const optimalBars = Math.min(maxBars, Math.max(1, Math.round(opt / 90)))

  return (
    <div className="rounded-2xl border border-near-black/10 overflow-hidden">
      <div className="bg-cream px-6 py-5 border-b border-near-black/10">
        <h3 className="text-lg font-semibold font-accent text-near-black">Find your optimal dose</h3>
        <p className="text-sm text-near-black/50 mt-0.5">
          Based on body weight — the most accurate predictor of caffeine tolerance
        </p>
      </div>

      <div className="bg-white px-6 py-5">
        {/* Weight slider */}
        <div className="flex items-center gap-4 mb-6">
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

        {/* Caffeine source reference grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-5">
          {caffeineSources.map((s) => (
            <div
              key={s.name}
              className={`rounded-xl p-2.5 text-center border ${
                s.highlight
                  ? 'bg-gold/10 border-gold/30'
                  : 'bg-cream border-near-black/5'
              }`}
            >
              <div
                className={`text-[11px] font-semibold font-accent mb-0.5 ${
                  s.highlight ? 'text-gold' : 'text-near-black'
                }`}
              >
                {s.name}
              </div>
              <div className="text-[10px] text-near-black/40 font-accent">{s.mg}mg</div>
            </div>
          ))}
        </div>

        {/* Result zone */}
        <div className="rounded-xl p-4 bg-gold/10 border border-gold/25">
          <div className="font-semibold font-accent text-sm text-gold mb-1">
            {optimalBars === 1
              ? 'One bar is your sweet spot'
              : `${optimalBars} bars is your optimal daily dose`}
          </div>
          <div className="text-sm text-near-black/60 leading-relaxed">
            At {weight}kg your optimal range is {low}–{opt}mg. One CAFO bar (90mg) gives you
            a clean, focused lift equivalent to a strong coffee. Since each bar stays well under
            the daily limit, you can safely enjoy up to {maxBars} bars across the day —
            perfect for early mornings, afternoon focus, and pre-workout, all in one.
          </div>
        </div>

        <p className="text-[10px] text-near-black/30 font-accent mt-3">
          Based on 3–6mg/kg optimal range per European Food Safety Authority guidelines.
          Individual sensitivity varies. FDA recommended maximum is 400mg/day.
        </p>
      </div>
    </div>
  )
}

export default function CaffeineMyths() {
  return (
    <section className="py-24 bg-warm-white">
      <div className="page-container">
        {/* Dark hero banner */}
        <AnimatedSection>
          <div className="bg-near-black rounded-3xl p-8 sm:p-10 lg:p-12 text-center mb-12">
            <span className="inline-block text-[10px] font-accent font-bold text-white/40 tracking-widest uppercase border border-white/10 rounded-full px-4 py-1.5 mb-6">
              Backed by science
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading text-white mb-3 leading-tight">
              Caffeine isn't the villain.
              <br />
              <span className="text-gold">Misinformation is.</span>
            </h2>
            <p className="text-white/40 text-sm leading-relaxed max-w-sm mx-auto mb-8">
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

        {/* Myth accordion */}
        <AnimatedSection delay={0.1}>
          <p className="text-[10px] font-accent font-bold text-near-black/30 tracking-[0.16em] uppercase mb-3">
            Tap each myth to see the science
          </p>
          <div className="flex flex-col gap-2 mb-12">
            {myths.map((m) => (
              <MythCard key={m.claim} m={m} />
            ))}
          </div>
        </AnimatedSection>

        {/* Dose calculator */}
        <AnimatedSection delay={0.15}>
          <p className="text-[10px] font-accent font-bold text-near-black/30 tracking-[0.16em] uppercase mb-3">
            Your personal dose
          </p>
          <DoseCalculator />
        </AnimatedSection>
      </div>
    </section>
  )
}
