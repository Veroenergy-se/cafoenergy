import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

export default function Hero() {
  const { t } = useTranslation()

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-end bg-warm-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full pb-20 lg:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.h1
            className="text-[4.5rem] sm:text-8xl lg:text-[10rem] xl:text-[12rem] font-heading text-near-black leading-[0.85] tracking-tight"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {t('hero.title')}
          </motion.h1>
          <motion.div
            className="mt-8 lg:mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              to="/shop"
              className="inline-flex items-center px-14 py-4 bg-near-black text-white font-heading tracking-widest text-xl uppercase hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300"
            >
              {t('hero.cta')}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
