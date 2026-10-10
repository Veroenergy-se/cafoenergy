import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

const rows: { key: string; moar: string; bar: string; energy: string; coffee: string }[] = [
  { key: 'caffeine', moar: '90mg', bar: '0mg',  energy: '180mg', coffee: '95mg' },
  { key: 'protein',  moar: '14g',  bar: '20g',  energy: '0g',    coffee: '0g' },
  { key: 'sugar',    moar: '2g',   bar: '1.5g', energy: '27g',   coffee: '0g' },
  { key: 'carbs',    moar: '21g',  bar: '15g',  energy: '28g',   coffee: '0g' },
  { key: 'fiber',    moar: '3g',   bar: '3g',   energy: '0g',    coffee: '0g' },
]

const others = ['bar', 'energy', 'coffee'] as const

const ease = [0.25, 0.46, 0.45, 0.94] as const

export default function NutritionComparison() {
  const { t } = useTranslation()

  return (
    <section className="bg-brown text-off-white py-20 lg:py-28">
      <div className="page-container">
        <div className="max-w-4xl mx-auto">
          <p className="font-accent text-xs uppercase tracking-[0.2em] font-semibold text-caforange">
            {t('nutrition.eyebrow')}
          </p>
          <h2 className="mt-3 font-display uppercase text-5xl sm:text-6xl lg:text-7xl leading-[0.9]">
            {t('nutrition.winsTitle')}
          </h2>

          <div className="mt-10 lg:mt-14 overflow-x-auto">
            <table className="w-full min-w-[300px] border-separate border-spacing-0 text-left">
              <thead>
                <tr>
                  <th scope="col" className="w-[22%] pb-4 align-bottom" aria-label={t('nutrition.whatsInside')} />
                  <th scope="col" className="w-[21%] bg-caforange rounded-t-2xl px-1 sm:px-3 pt-5 pb-4 text-center align-bottom">
                    <span className="block font-display uppercase text-2xl sm:text-3xl leading-none">MOAR</span>
                    <span className="mt-1 block font-accent text-[10px] sm:text-xs font-normal opacity-80">{t('nutrition.per.moar')}</span>
                  </th>
                  {others.map((c) => (
                    <th key={c} scope="col" className="w-[19%] px-1 sm:px-3 pb-4 text-center align-bottom">
                      <span className="block font-accent font-semibold text-[10px] sm:text-sm uppercase tracking-[0.06em] sm:tracking-[0.12em] leading-tight">{t(`nutrition.vs.${c}`)}</span>
                      <span className="mt-1 block font-accent text-[9px] sm:text-xs font-normal text-off-white/50 leading-tight">{t(`nutrition.per.${c}`)}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const last = i === rows.length - 1
                  return (
                    <motion.tr
                      key={row.key}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.5, delay: i * 0.07, ease }}
                    >
                      <th scope="row" className="py-4 sm:py-5 pr-2 border-t border-off-white/15 font-accent font-semibold text-[10px] sm:text-sm uppercase tracking-[0.08em] sm:tracking-[0.12em] text-off-white/70">
                        {t(`nutrition.rows.${row.key}`)}
                      </th>
                      <td className={`py-4 sm:py-5 bg-caforange border-t border-brown/15 text-center font-display text-[1.7rem] sm:text-4xl leading-none ${last ? 'rounded-b-2xl' : ''}`}>
                        {row.moar}
                      </td>
                      {others.map((c) => (
                        <td key={c} className="py-4 sm:py-5 border-t border-off-white/15 text-center font-accent font-semibold text-sm sm:text-xl text-off-white/60 tabular-nums">
                          {row[c]}
                        </td>
                      ))}
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-xs leading-relaxed text-off-white/45 max-w-2xl">
            {t('nutrition.footnote')}
          </p>
        </div>
      </div>
    </section>
  )
}
