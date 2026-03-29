import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const isEn = i18n.language === 'en'

  return (
    <button
      onClick={() => i18n.changeLanguage(isEn ? 'sv' : 'en')}
      className="relative flex items-center gap-1 p-2 rounded-full text-white/70 hover:text-white transition-colors"
      aria-label={isEn ? 'Byt till svenska' : 'Switch to English'}
    >
      <motion.span
        key={i18n.language}
        initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="text-xl leading-none"
      >
        {isEn ? '🇬🇧' : '🇸🇪'}
      </motion.span>
    </button>
  )
}
