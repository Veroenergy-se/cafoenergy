import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

export default function Hero() {
  const { t } = useTranslation()

  return (
    <section className="relative flex items-start pt-16 sm:pt-20 lg:pt-24 pb-20 min-h-[85svh] bg-warm-white overflow-hidden">
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.h1
            className="font-heading text-near-black leading-[0.88] tracking-tight"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span className="block text-[4.5rem] sm:text-8xl lg:text-[10rem] xl:text-[12rem]">
              {t('hero.titleLine1')}
            </span>
            <span className="block text-[4.5rem] sm:text-8xl lg:text-[10rem] xl:text-[12rem]">
              {t('hero.titleLine2')}
            </span>
          </motion.h1>
          <motion.div
            className="mt-8 lg:mt-10 flex flex-col items-start gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <a
              href="#waitlist"
              className="inline-flex items-center px-14 py-4 bg-near-black text-white font-heading tracking-widest text-xl uppercase border-2 border-near-black hover:bg-white hover:text-near-black hover:-translate-y-0.5 hover:shadow-xl transition-all duration-500 ease-in-out"
            >
              {t('hero.joinWaitlist')}
            </a>
            <Link
              to="/how-it-works"
              className="inline-flex items-center px-14 py-4 text-near-black font-heading tracking-widest text-xl uppercase border-2 border-near-black hover:-translate-y-0.5 transition-all duration-300"
            >
              {t('hero.learnMore')}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
