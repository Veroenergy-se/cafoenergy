import { useTranslation } from 'react-i18next'
import AnimatedSection from '@/components/shared/AnimatedSection'

type Verdict = 'good' | 'bad' | undefined

const rows: { key: string; cafo: string; coffee: string; energy: string; v: { cafo?: Verdict; coffee?: Verdict; energy?: Verdict } }[] = [
  { key: 'protein',  cafo: '14g',  coffee: '0g',   energy: '0g',    v: { cafo: 'good' } },
  { key: 'sugar',    cafo: '2g',   coffee: '0g',   energy: '27g',   v: { cafo: 'good', coffee: 'good', energy: 'bad' } },
  { key: 'carbs',    cafo: '21g',  coffee: '0g',   energy: '28g',   v: {} },
  { key: 'caffeine', cafo: '80mg', coffee: '95mg', energy: '180mg', v: { cafo: 'good', energy: 'bad' } },
  { key: 'fiber',    cafo: '3g',   coffee: '0g',   energy: '0g',    v: { cafo: 'good' } },
]

function Dot({ v }: { v: Verdict }) {
  if (!v) return null
  return (
    <span
      className={`w-1.5 h-1.5 rounded-full shrink-0 ${v === 'good' ? 'bg-green-500' : 'bg-red-500'}`}
      aria-hidden="true"
    />
  )
}

const ROW_H = 'h-[62px] sm:h-[64px]'
const EXTEND_H = 'h-[31px] sm:h-[32px]'

const noiseTexture = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`

export default function NutritionComparison() {
  const { t } = useTranslation()

  return (
    <section className="bg-forest relative py-20 lg:py-28 overflow-hidden">
      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.07] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: noiseTexture, backgroundRepeat: 'repeat', backgroundSize: '200px 200px' }}
      />

      <div className="relative z-10 page-container">
        <AnimatedSection className="w-full">
          <h2 className="w-full text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading text-white leading-tight tracking-tight mb-10 lg:mb-12">
            {t('nutrition.winsTitle')}
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.15} className="w-full max-w-2xl mx-auto">
          <div className="grid grid-cols-4 w-full text-[0.6rem] sm:text-xs">

            {/* Labels column */}
            <div className="flex flex-col bg-white border-2 border-brown border-r-0 rounded-tl-xl rounded-bl-xl overflow-hidden mt-[28px] mb-[28px] sm:mt-[32px] sm:mb-[32px]">
              <div className={`${ROW_H} flex items-center justify-center px-2 border-b-2 border-brown`}>
                <span className="font-black tracking-[0.1em] uppercase text-brown text-center leading-tight">{t('nutrition.whatsInside')}</span>
              </div>
              {rows.map((row) => (
                <div key={row.key} className={`${ROW_H} flex items-center justify-center px-1.5 border-b-2 last:border-b-0 border-brown/20`}>
                  <span className="w-full min-w-0 font-black tracking-normal sm:tracking-[0.06em] uppercase text-brown text-center leading-tight break-words">{t(`nutrition.rows.${row.key}`)}</span>
                </div>
              ))}
            </div>

            {/* CAFO column — orange, extends above & below */}
            <div className="flex flex-col bg-caforange">
              <div className={EXTEND_H} />
              <div className={`${ROW_H} flex items-center justify-center px-1 border-b border-white/15`}>
                <span className="text-lg sm:text-xl font-heading font-black text-off-white tracking-widest">CAFO</span>
              </div>
              {rows.map((row) => (
                <div key={row.key} className={`${ROW_H} flex items-center justify-center gap-1 px-1 border-b last:border-b-0 border-white/15`}>
                  <span className="text-base sm:text-lg font-black text-off-white">{row.cafo}</span>
                  <Dot v={row.v.cafo} />
                </div>
              ))}
              <div className={EXTEND_H} />
            </div>

            {/* Energy drinks column */}
            <div className="flex flex-col bg-white border-y-2 border-brown mt-[28px] mb-[28px] sm:mt-[32px] sm:mb-[32px]">
              <div className={`${ROW_H} flex items-center justify-center px-1.5 border-b-2 border-brown`}>
                <span className="w-full min-w-0 font-black tracking-normal sm:tracking-[0.06em] uppercase text-brown text-center leading-tight break-words">{t('nutrition.vsEnergy')}</span>
              </div>
              {rows.map((row) => (
                <div key={row.key} className={`${ROW_H} flex items-center justify-center gap-1 px-2 border-b-2 last:border-b-0 border-brown/20`}>
                  <span className="text-sm sm:text-base font-black text-brown">{row.energy}</span>
                  <Dot v={row.v.energy} />
                </div>
              ))}
            </div>

            {/* Coffee column */}
            <div className="flex flex-col bg-white border-2 border-brown border-l-0 rounded-tr-xl rounded-br-xl overflow-hidden mt-[28px] mb-[28px] sm:mt-[32px] sm:mb-[32px]">
              <div className={`${ROW_H} flex items-center justify-center px-1 border-b-2 border-brown`}>
                <span className="font-black tracking-[0.06em] uppercase text-brown text-center leading-tight">{t('nutrition.vsCoffee')}</span>
              </div>
              {rows.map((row) => (
                <div key={row.key} className={`${ROW_H} flex items-center justify-center gap-1 px-1 border-b-2 last:border-b-0 border-brown/20`}>
                  <span className="text-sm sm:text-base font-black text-brown">{row.coffee}</span>
                  <Dot v={row.v.coffee} />
                </div>
              ))}
            </div>

          </div>

          <p className="mt-6 text-center text-[11px] text-white/50 italic">
            {t('nutrition.footnote')}
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
