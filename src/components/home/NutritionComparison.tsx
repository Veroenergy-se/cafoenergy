import { useTranslation } from 'react-i18next'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { Check, X as XIcon, Minus } from 'lucide-react'

export default function NutritionComparison() {
  const { t } = useTranslation()

  const ingredients = [
    {
      titleKey: 'nutrition.caffeineTitle',
      descKey: 'nutrition.caffeineDesc',
      value: '90mg',
      icon: '⚡',
    },
    {
      titleKey: 'nutrition.proteinTitle',
      descKey: 'nutrition.proteinDesc',
      value: '10g',
      icon: '💪',
    },
    {
      titleKey: 'nutrition.sugarTitle',
      descKey: 'nutrition.sugarDesc',
      value: '0g',
      icon: '🚫',
    },
    {
      titleKey: 'nutrition.ltheanineTitle',
      descKey: 'nutrition.ltheanineDesc',
      value: '✔',
      icon: '🧠',
    },
  ]

  const comparison = [
    { label: 'Sustained Energy', cafo: true, coffee: false, energy: false },
    { label: 'No Sugar Crash', cafo: true, coffee: true, energy: false },
    { label: 'Plant Protein', cafo: true, coffee: false, energy: false },
    { label: 'L-Theanine', cafo: true, coffee: false, energy: false },
    { label: 'Portable', cafo: true, coffee: false, energy: true },
    { label: 'No Jitters', cafo: true, coffee: false, energy: false },
  ]

  return (
    <section className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-6xl sm:text-7xl lg:text-8xl font-heading text-near-black">{t('nutrition.title')}</h2>
        </AnimatedSection>

        {/* Ingredient cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {ingredients.map((item, i) => (
            <AnimatedSection key={item.titleKey} delay={i * 0.1} className="h-full">
              <div className="bg-white rounded-3xl p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-near-black/5 h-full flex flex-col items-center justify-start">
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <span className="text-3xl font-heading text-forest block mb-2">{item.value}</span>
                <h3 className="font-semibold font-accent text-near-black mb-2">{t(item.titleKey)}</h3>
                <p className="text-sm text-near-black/50 leading-relaxed">{t(item.descKey)}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Comparison table */}
        <AnimatedSection>
          <div className="bg-white rounded-3xl p-8 lg:p-12 border border-near-black/5">
            <h3 className="text-3xl font-heading text-near-black text-center mb-8">{t('nutrition.comparisonTitle')}</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-near-black/5">
                    <th className="text-left py-4 px-4 text-sm font-accent text-near-black/40 uppercase tracking-wider" />
                    <th className="py-4 px-4 text-center">
                      <span className="text-sm font-bold font-accent text-forest bg-forest/10 px-4 py-2 rounded-full">{t('nutrition.vsCafo')}</span>
                    </th>
                    <th className="py-4 px-4 text-center">
                      <span className="text-sm font-accent text-near-black/50">{t('nutrition.vsCoffee')}</span>
                    </th>
                    <th className="py-4 px-4 text-center">
                      <span className="text-sm font-accent text-near-black/50">{t('nutrition.vsEnergy')}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr key={row.label} className="border-b border-near-black/5 last:border-0">
                      <td className="py-4 px-4 text-sm font-medium text-near-black/70">{row.label}</td>
                      <td className="py-4 px-4 text-center">
                        {row.cafo ? <Check className="w-5 h-5 text-forest mx-auto" /> : <Minus className="w-5 h-5 text-near-black/20 mx-auto" />}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {row.coffee ? <Check className="w-5 h-5 text-near-black/30 mx-auto" /> : <XIcon className="w-5 h-5 text-near-black/15 mx-auto" />}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {row.energy ? <Check className="w-5 h-5 text-near-black/30 mx-auto" /> : <XIcon className="w-5 h-5 text-near-black/15 mx-auto" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
