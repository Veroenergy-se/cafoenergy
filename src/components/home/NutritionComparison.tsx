import AnimatedSection from '@/components/shared/AnimatedSection'

const rows = [
  { label: 'PROTEIN',    cafo: '10g',   energy: '3g'    },
  { label: 'SUGAR',      cafo: '0g',    energy: '12g'   },
  { label: 'NET CARBS',  cafo: '8g',    energy: '15g'   },
  { label: 'CAFFEINE',   cafo: '90mg',  energy: '160mg' },
  { label: 'GRAIN FREE', cafo: 'check', energy: 'cross' },
]

const ROW_H = 'h-[108px]'
const EXTEND_H = 'h-[80px]'

const noiseTexture = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`

export default function NutritionComparison() {
  return (
    <section className="bg-forest relative py-20 lg:py-28 overflow-hidden">
      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.07] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: noiseTexture, backgroundRepeat: 'repeat', backgroundSize: '200px 200px' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection className="w-full">
          <h2 className="w-full text-center text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-heading text-white leading-[0.9] tracking-tight mb-16 lg:mb-20">
            WHY CAFO WINS. EVERY TIME.
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.15} className="w-full">
          <div className="grid grid-cols-3 w-full">

            {/* Left column */}
            <div className={`flex flex-col bg-white border-2 border-black border-r-0 mt-[80px] mb-[80px]`}>
              <div className={`${ROW_H} flex items-center justify-center px-6 border-b-2 border-black`}>
                <span className="text-xs sm:text-sm font-black tracking-[0.18em] uppercase text-black text-center">What's Inside</span>
              </div>
              {rows.map((row) => (
                <div key={row.label} className={`${ROW_H} flex items-center justify-center px-6 border-b-2 last:border-b-0 border-black/20`}>
                  <span className="text-sm sm:text-base font-black tracking-[0.12em] uppercase text-black text-center">{row.label}</span>
                </div>
              ))}
            </div>

            {/* Center column — black, extends above & below */}
            <div className="flex flex-col bg-near-black">
              <div className={EXTEND_H} />
              <div className={`${ROW_H} flex items-center justify-center px-4 border-b border-white/10`}>
                <span className="text-4xl sm:text-5xl font-heading font-black text-white tracking-widest">CAFO</span>
              </div>
              {rows.map((row) => (
                <div key={row.label} className={`${ROW_H} flex items-center justify-center px-4 border-b last:border-b-0 border-white/10`}>
                  {row.cafo === 'check' ? (
                    <svg viewBox="0 0 24 24" className="w-10 h-10 fill-none stroke-[#4ade80] stroke-[3]" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <span className="text-3xl sm:text-4xl font-black text-white">{row.cafo}</span>
                  )}
                </div>
              ))}
              <div className={EXTEND_H} />
            </div>

            {/* Right column */}
            <div className={`flex flex-col bg-white border-2 border-black border-l-0 mt-[80px] mb-[80px]`}>
              <div className={`${ROW_H} flex items-center justify-center px-6 border-b-2 border-black`}>
                <span className="text-xs sm:text-sm font-black tracking-[0.18em] uppercase text-black text-center">Energy Drinks</span>
              </div>
              {rows.map((row) => (
                <div key={row.label} className={`${ROW_H} flex items-center justify-center px-6 border-b-2 last:border-b-0 border-black/20`}>
                  {row.energy === 'cross' ? (
                    <svg viewBox="0 0 24 24" className="w-9 h-9 fill-none stroke-red-500 stroke-[3]" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  ) : (
                    <span className="text-2xl sm:text-3xl font-black text-black">{row.energy}</span>
                  )}
                </div>
              ))}
            </div>

          </div>

          <p className="mt-8 text-center text-xs text-white/50 italic">
            *Nutritional values are targets and may vary. Energy drink values are typical averages.
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
