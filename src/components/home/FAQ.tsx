import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  questionKey: string
  answerKey: string
}

const faqs: FAQItem[] = [
  { questionKey: 'faq.q1', answerKey: 'faq.a1' },
  { questionKey: 'faq.q2', answerKey: 'faq.a2' },
  { questionKey: 'faq.q3', answerKey: 'faq.a3' },
  { questionKey: 'faq.q4', answerKey: 'faq.a4' },
  { questionKey: 'faq.q5', answerKey: 'faq.a5' },
  { questionKey: 'faq.q6', answerKey: 'faq.a6' },
]

function FAQAccordion({ questionKey, answerKey }: FAQItem) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-near-black/5 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <span className="text-lg font-semibold font-accent text-near-black pr-8 group-hover:text-gold transition-colors">
          {t(questionKey)}
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
              {t(answerKey)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const { t } = useTranslation()

  return (
    <section className="py-24 bg-cream">
      <div className="w-full max-w-3xl mx-auto px-6 lg:px-12">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-6xl sm:text-7xl lg:text-8xl font-heading text-near-black">{t('faq.title')}</h2>
        </AnimatedSection>
        <AnimatedSection>
          <div className="bg-white rounded-3xl p-8 lg:p-10 border border-near-black/5">
            {faqs.map((faq) => (
              <FAQAccordion key={faq.questionKey} {...faq} />
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
