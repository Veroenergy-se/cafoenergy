import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  const { t } = useTranslation()

  return (
    <section className="relative min-h-[100svh] flex items-center bg-warm-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-gradient-to-br from-gold/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-forest/5 to-transparent rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center py-8 lg:py-12">
        {/* Text */}
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
          <motion.p
            className="mt-4 lg:mt-6 text-sm sm:text-base lg:text-lg text-near-black/60 max-w-md leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {t('hero.subtitle')}
          </motion.p>
          <motion.div
            className="mt-5 lg:mt-6 flex flex-row gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 sm:px-10 sm:py-5 bg-gradient-to-r from-gold to-gold-light text-near-black font-bold font-accent rounded-full hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/20 transition-all duration-300 text-sm sm:text-lg"
            >
              {t('hero.cta')}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 px-6 py-3 sm:px-10 sm:py-5 text-near-black font-bold font-accent rounded-full border-2 border-near-black/15 hover:border-near-black/40 hover:-translate-y-0.5 transition-all duration-300 text-sm sm:text-lg"
            >
              {t('hero.learnMore')}
            </Link>
          </motion.div>
        </motion.div>

        {/* Product Visual — hidden on mobile, shown on lg+ */}
        <motion.div
          className="hidden lg:flex relative items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="relative w-80 h-[480px]">
            <div className="absolute inset-0 bg-gradient-to-br from-forest to-forest/80 rounded-3xl shadow-2xl shadow-forest/20 flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="text-center text-white">
                <span className="text-6xl font-heading tracking-wider">CAFO</span>
                <div className="mt-2 w-16 h-0.5 bg-gold mx-auto" />
                <p className="mt-3 text-sm font-accent text-white/70 uppercase tracking-widest">Energy Bar</p>
              </div>
            </div>
            <motion.div
              className="absolute -top-4 -right-4 bg-white rounded-2xl px-4 py-3 shadow-lg"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="text-sm font-semibold text-forest">90mg ☕</span>
            </motion.div>
            <motion.div
              className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-4 py-3 shadow-lg"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="text-sm font-semibold text-near-black">0g Sugar</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
