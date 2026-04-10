import AnimatedSection from '@/components/shared/AnimatedSection'

const rows = [
  { label: 'PROTEIN',    cafo: '10g',   energy: '3g',   },
  { label: 'SUGAR',      cafo: '0g',    energy: '12g',  },
  { label: 'NET CARBS',  cafo: '8g',    energy: '15g',  },
  { label: 'CAFFEINE',   cafo: '90mg',  energy: '160mg' },
  { label: 'GRAIN FREE', cafo: 'check', energy: 'cross' },
]

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
          {/* Table */}
          <div className="w-full border border-white/10 overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-3">
              <div className="bg-white py-5 px-6 flex items-center">
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-near-black/50">What's Inside</span>
              </div>
              <div className="bg-near-black py-5 px-6 flex items-center justify-center">
                <span className="text-2xl lg:text-3xl font-heading text-white tracking-widest">VERO</span>
              </div>
              <div className="bg-white py-5 px-6 flex items-center justify-center">
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-near-black/50">Energy Drinks</span>
              </div>
            </div>

            {/* Data rows */}
            {rows.map((row) => (
              <div key={row.label} className="grid grid-cols-3 border-t border-near-black/10">
                <div className="bg-white py-6 px-6 flex items-center">
                  <span className="text-xs font-semibold tracking-[0.18em] uppercase text-near-black/70">{row.label}</span>
                </div>
                <div className="bg-near-black py-6 px-6 flex items-center justify-center">
                  {row.cafo === 'check' ? (
                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-forest fill-none stroke-[#4ade80] stroke-[2.5]" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <span className="text-2xl lg:text-3xl font-heading font-bold text-white">{row.cafo}</span>
                  )}
                </div>
                <div className="bg-white py-6 px-6 flex items-center justify-center">
                  {row.energy === 'cross' ? (
                    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-none stroke-red-500 stroke-[2.5]" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  ) : (
                    <span className="text-xl lg:text-2xl font-semibold text-near-black/70">{row.energy}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-white/40 italic">
            *Nutritional values are targets and may vary. Energy drink values are typical averages.
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
