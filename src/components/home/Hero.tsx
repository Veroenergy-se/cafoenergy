import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

export default function Hero() {
  const { t } = useTranslation()

  return (
    <section className="relative flex items-center justify-center -mt-20 pt-36 sm:pt-40 lg:pt-44 pb-20 min-h-[100svh] bg-off-white overflow-hidden">

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.h1
            className="mt-8 sm:mt-12 font-monument font-black text-brown leading-none tracking-tight whitespace-nowrap text-2xl sm:text-4xl md:text-5xl lg:text-7xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {t('hero.titleLine1')} {t('hero.titleLine2')}
          </motion.h1>
          <motion.div
            className="mt-40 lg:mt-56 flex flex-col items-center gap-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <a
              href="#waitlist"
              className="inline-flex items-center px-16 py-5 bg-caforange text-off-white font-heading tracking-widest text-2xl uppercase border-2 border-caforange hover:bg-brown hover:text-off-white hover:border-brown hover:-translate-y-0.5 hover:shadow-xl transition-all duration-500 ease-in-out"
            >
              {t('hero.joinWaitlist')}
            </a>
            <Link
              to="/how-it-works"
              className="inline-flex items-center px-16 py-5 text-caforange font-heading tracking-widest text-2xl uppercase border-2 border-caforange hover:bg-caforange hover:text-off-white hover:-translate-y-0.5 transition-all duration-300"
            >
              {t('hero.learnMore')}
            </Link>
            <div className="flex items-center gap-6 sm:gap-12 mt-6">
              <div>
                <span className="block text-2xl sm:text-3xl font-heading text-caforange leading-none">90mg</span>
                <span className="block text-[10px] sm:text-xs font-accent text-brown/60 uppercase tracking-widest mt-1">Caffeine</span>
              </div>
              <div className="w-px h-8 sm:h-10 bg-brown/15" />
              <div>
                <span className="block text-2xl sm:text-3xl font-heading text-caforange leading-none">14g</span>
                <span className="block text-[10px] sm:text-xs font-accent text-brown/60 uppercase tracking-widest mt-1">Protein</span>
              </div>
              <div className="w-px h-8 sm:h-10 bg-brown/15" />
              <div>
                <span className="block text-2xl sm:text-3xl font-heading text-caforange leading-none">Zero</span>
                <span className="block text-[10px] sm:text-xs font-accent text-brown/60 uppercase tracking-widest mt-1">Nonsense</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
