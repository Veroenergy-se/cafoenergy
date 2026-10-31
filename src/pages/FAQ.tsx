import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE } from '@/lib/constants'

// FAQ: the buying questions, in three groups. The science page answers the rest.

type Item = { q: string; a: string }
type Group = { title: string; items: Item[] }

const TONES = ['cream', 'brown', 'orange'] as const

function Question({ q, a }: Item) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b-[1.5px] border-fg/25">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-6 py-5 md:py-6 text-left group"
      >
        <span className="font-display uppercase leading-[1.05] text-[clamp(1rem,2vw,1.6rem)] group-hover:text-accent transition-colors">{q}</span>
        <span
          aria-hidden="true"
          className={`shrink-0 font-display text-2xl leading-none text-accent transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-6 font-accent text-[clamp(15px,1.3vw,18px)] leading-relaxed max-w-[60ch] opacity-85">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const { t } = useTranslation()
  const threshold = `${SITE.freeShippingThreshold.sek} kr`
  const groups = t('faq.groups', { returnObjects: true, threshold }) as Group[]

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: groups.flatMap((g) =>
      g.items.map((it) => ({ '@type': 'Question', name: it.q, acceptedAnswer: { '@type': 'Answer', text: it.a } })),
    ),
  }

  return (
    <>
      <Helmet>
        <title>{t('faq.metaTitle')}</title>
        <meta name="description" content={t('faq.metaDescription')} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <section data-tone="cream" className="text-fg pt-36 pb-16 lg:pt-44 lg:pb-20">
        <div className="page-container">
          <p className="font-accent text-xs uppercase tracking-[0.2em] font-semibold text-accent">{t('faq.eyebrow')}</p>
          <h1 className="mt-5 font-display uppercase leading-[0.9] text-[clamp(1.7rem,7.6vw,8.4rem)]">
            {t('faq.titleA')}<br /><span className="text-accent">{t('faq.titleB')}</span>
          </h1>
          <p className="mt-8 max-w-[40ch] font-accent text-[clamp(16px,1.5vw,20px)] leading-relaxed">
            {t('faq.lede').split(t('faq.scienceLink'))[0]}
            <Link to="/how-it-works" className="underline underline-offset-4 decoration-2 hover:text-accent">{t('faq.scienceLink')}</Link>
            {t('faq.lede').split(t('faq.scienceLink'))[1]}
          </p>
        </div>
      </section>

      {groups.map((g, i) => (
        <section key={g.title} data-tone={TONES[i % TONES.length]} className="text-fg py-16 lg:py-24">
          <div className="page-container grid md:grid-cols-[0.7fr_1.3fr] gap-6 md:gap-16">
            <div className="md:sticky md:top-32 self-start">
              <b className="block font-display text-accent leading-none text-[clamp(2.4rem,6vw,5rem)]">{String(i + 1).padStart(2, '0')}</b>
              <h2 className="mt-3 font-display uppercase leading-[0.95] text-[clamp(1.4rem,3vw,2.6rem)]">{g.title}</h2>
            </div>
            <div className="border-t-[3px] border-fg">
              {g.items.map((it) => <Question key={it.q} {...it} />)}
            </div>
          </div>
        </section>
      ))}

      <section data-tone="cream" className="text-fg py-24 lg:py-32 text-center">
        <div className="page-container">
          <h2 className="font-display uppercase leading-[0.92] text-[clamp(1.6rem,6.6vw,6.4rem)]">
            {t('faq.ctaTitleA')} <span className="text-accent">{t('faq.ctaTitleB')}</span>
          </h2>
          <p className="mt-6 font-accent text-[clamp(16px,1.5vw,20px)]">{t('faq.ctaBody')}</p>
          <Link to="/contact" className="mt-9 inline-block bg-brown text-off-white px-7 py-5 font-accent text-sm uppercase tracking-[0.14em] font-semibold hover:-translate-y-0.5 transition-transform">
            {t('faq.ctaButton')} →
          </Link>
        </div>
      </section>
    </>
  )
}
