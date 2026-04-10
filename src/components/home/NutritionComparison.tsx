import AnimatedSection from '@/components/shared/AnimatedSection'

const rows = [
  { label: 'PROTEIN',    cafo: '10g',   energy: '3g'    },
  { label: 'SUGAR',      cafo: '0g',    energy: '12g'   },
  { label: 'NET CARBS',  cafo: '8g',    energy: '15g'   },
  { label: 'CAFFEINE',   cafo: '90mg',  energy: '160mg' },
  { label: 'GRAIN FREE', cafo: 'check', energy: 'cross' },
]

const ROW_H = 'h-[88px]'
const EXTEND_H = 'h-[72px]'

export default function NutritionComparison() {
  return (
    <section className="bg-forest py-20 lg:py-28">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        <AnimatedSection>
          <h2 className="text-center text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-heading text-white leading-[0.9] tracking-tight mb-16 lg:mb-20">
            WHY VERO WINS. EVERY TIME.
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div className="grid grid-cols-3">

            {/* Left column — white, pushed down by EXTEND_H */}
            <div className={`flex flex-col bg-white border border-near-black/20 border-r-0 mt-[72px]`}>
              <div className={`${ROW_H} flex items-center justify-center px-6 border-b border-near-black/15`}>
                <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-near-black/50 text-center">What's Inside</span>
              </div>
              {rows.map((row) => (
                <div key={row.label} className={`${ROW_H} flex items-center justify-center px-6 border-b last:border-b-0 border-near-black/10`}>
                  <span className="text-[10px] sm:text-xs font-bold tracking-[0.18em] uppercase text-near-black/70 text-center">{row.label}</span>
                </div>
              ))}
            </div>

            {/* Center column — black, extends above */}
            <div className="flex flex-col bg-near-black">
              {/* Extension above table */}
              <div className={EXTEND_H} />
              {/* VERO header */}
              <div className={`${ROW_H} flex items-center justify-center px-4 border-b border-white/10`}>
                <span className="text-3xl sm:text-4xl font-heading font-black text-white tracking-widest">VERO</span>
              </div>
              {rows.map((row) => (
                <div key={row.label} className={`${ROW_H} flex items-center justify-center px-4 border-b last:border-b-0 border-white/10`}>
                  {row.cafo === 'check' ? (
                    <svg viewBox="0 0 24 24" className="w-9 h-9 fill-none stroke-[#4ade80] stroke-[3]" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <span className="text-2xl sm:text-3xl font-black text-white">{row.cafo}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Right column — white, pushed down by EXTEND_H */}
            <div className={`flex flex-col bg-white border border-near-black/20 border-l-0 mt-[72px]`}>
              <div className={`${ROW_H} flex items-center justify-center px-6 border-b border-near-black/15`}>
                <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-near-black/50 text-center">Energy Drinks</span>
              </div>
              {rows.map((row) => (
                <div key={row.label} className={`${ROW_H} flex items-center justify-center px-6 border-b last:border-b-0 border-near-black/10`}>
                  {row.energy === 'cross' ? (
                    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-red-500 stroke-[3]" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  ) : (
                    <span className="text-xl sm:text-2xl font-bold text-near-black/70">{row.energy}</span>
                  )}
                </div>
              ))}
            </div>

          </div>

          <p className="mt-6 text-center text-xs text-white/40 italic">
            *Nutritional values are targets and may vary. Energy drink values are typical averages.
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
