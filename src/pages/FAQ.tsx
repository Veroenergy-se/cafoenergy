import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { ChevronDown } from 'lucide-react'

const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6']

function FAQAccordion({ qKey }: { qKey: string }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-near-black/5 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <span className="text-lg font-semibold font-accent text-near-black pr-8 group-hover:text-gold transition-colors">
          {t(`faq.${qKey}`)}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-near-black/30" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-near-black/55 leading-relaxed pr-12">
              {t(`faq.a${qKey.slice(1)}`)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const { t } = useTranslation()

  // Build structured data from translations
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqKeys.map((qKey) => ({
      '@type': 'Question',
      name: t(`faq.${qKey}`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: t(`faq.a${qKey.slice(1)}`),
      },
    })),
  }

  return (
    <>
      <Helmet>
        <title>FAQ — CAFO Energy</title>
        <meta name="description" content="Frequently asked questions about CAFO Energy bars. Learn about caffeine content, ingredients, shipping, and more." />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <section className="bg-near-black py-24 text-center">
        <AnimatedSection>
          <h1 className="text-8xl sm:text-9xl lg:text-[10rem] font-heading text-white">{t('faq.title')}</h1>
          <p className="mt-4 text-white/50 font-accent text-lg">{t('faq.subtitle')}</p>
        </AnimatedSection>
      </section>

      <section className="py-24 bg-warm-white">
        <div className="page-container">
          <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <div className="bg-white rounded-3xl p-8 lg:p-10 border border-near-black/5">
              {faqKeys.map((qKey) => (
                <FAQAccordion key={qKey} qKey={qKey} />
              ))}
            </div>
          </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-cream text-center">
        <div className="page-container">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto">
              <h2 className="text-4xl sm:text-5xl font-heading text-near-black">{t('faq.ctaTitle')}</h2>
              <p className="mt-4 text-near-black/50 text-lg">{t('faq.ctaText')}</p>
              <a
                href="/contact"
                className="mt-8 inline-flex px-8 py-4 bg-gradient-to-r from-gold to-gold-light text-near-black font-bold font-accent rounded-full hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/20 transition-all duration-300"
              >
                {t('faq.ctaButton')}
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
