import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'

export default function CookieConsent() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [showIcon, setShowIcon] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cafo-cookie-consent')
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    } else {
      setShowIcon(true)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('cafo-cookie-consent', 'accepted')
    setVisible(false)
    setShowIcon(true)
  }

  const decline = () => {
    localStorage.setItem('cafo-cookie-consent', 'declined')
    setVisible(false)
    setShowIcon(true)
  }

  const reopen = () => {
    setShowIcon(false)
    setVisible(true)
  }

  return (
    <>
      {/* Cookie icon in corner */}
      <AnimatePresence>
        {showIcon && !visible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            onClick={reopen}
            className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-near-black text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-200"
            aria-label="Cookie settings"
          >
            <span className="text-lg">🍪</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Banner */}
      <AnimatePresence>
        {visible && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          >
            <div className="max-w-2xl mx-auto bg-near-black text-white rounded-2xl p-6 shadow-2xl flex flex-col sm:flex-row items-center gap-4">
              <span className="text-2xl flex-shrink-0">🍪</span>
              <p className="text-sm text-white/70 flex-1">{t('cookie.message')}</p>
              <div className="flex gap-3 flex-shrink-0">
                <button
                  onClick={decline}
                  className="px-5 py-2 text-sm font-medium text-white/60 hover:text-white border border-white/10 rounded-full transition-colors"
                >
                  {t('cookie.decline')}
                </button>
                <button
                  onClick={accept}
                  className="px-5 py-2 text-sm font-medium bg-gold text-near-black rounded-full hover:bg-gold-light transition-colors"
                >
                  {t('cookie.accept')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
