import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'

const STORAGE_KEY = 'cafo-waitlist-popup'
const SHOW_DELAY_MS = 4000
const DISMISS_COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

type StoredState = { status: 'dismissed' | 'submitted'; ts: number }

export default function WaitlistPopup() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    const stored: StoredState | null = raw ? JSON.parse(raw) : null

    // Submitted visitors never see it again; dismissed visitors get asked
    // again after the cooldown window in case they change their mind.
    const shouldShow =
      !stored ||
      (stored.status === 'dismissed' && Date.now() - stored.ts > DISMISS_COOLDOWN_MS)

    if (shouldShow) {
      const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS)
      return () => clearTimeout(timer)
    }
  }, [])

  function close(reason: 'dismissed' | 'submitted') {
    const state: StoredState = { status: reason, ts: Date.now() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    setVisible(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')

    try {
      const res = await fetch('https://app.loops.so/api/newsletter-form/cmnxezmsk03cm0iymzrn4dore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `userGroup=&mailingLists=&email=${encodeURIComponent(email)}`,
      })

      if (res.ok) {
        setStatus('success')
        setTimeout(() => close('submitted'), 2000)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-near-black/70 backdrop-blur-sm"
            onClick={() => close('dismissed')}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            className="relative w-full max-w-md bg-near-black border-2 border-white/10 p-8 sm:p-10 text-center"
          >
            <button
              onClick={() => close('dismissed')}
              aria-label={t('waitlistPopup.close')}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors"
            >
              ✕
            </button>

            <p className="font-accent text-gold text-xs tracking-[0.2em] uppercase mb-3">
              {t('waitlistPopup.eyebrow')}
            </p>
            <h2 className="text-4xl sm:text-5xl font-heading text-white leading-[0.95] tracking-tight mb-3">
              {t('waitlistPopup.title')}
            </h2>

            {status === 'success' ? (
              <div className="mt-6 border-2 border-white/20 px-6 py-5">
                <p className="text-white font-heading text-2xl tracking-wide">
                  {t('waitlistPopup.success')}
                </p>
                <p className="text-white/50 font-accent text-sm mt-1">
                  {t('waitlistPopup.successSub')}
                </p>
              </div>
            ) : (
              <>
                <p className="text-white/60 font-accent text-sm mb-6">
                  {t('waitlistPopup.subtitle')}
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={t('waitlistPopup.placeholder')}
                    className="w-full px-5 py-3.5 bg-white/5 border-2 border-white/20 text-white placeholder-white/30 font-accent text-base focus:outline-none focus:border-gold transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full px-8 py-3.5 bg-gold text-near-black font-heading text-lg tracking-widest uppercase hover:bg-gold-light transition-colors disabled:opacity-50"
                  >
                    {status === 'loading' ? '...' : t('waitlistPopup.cta')}
                  </button>
                </form>
                {status === 'error' && (
                  <p className="mt-3 text-red-400 font-accent text-sm">{t('waitlistPopup.error')}</p>
                )}
                <button
                  onClick={() => close('dismissed')}
                  className="mt-4 text-white/40 hover:text-white/70 font-accent text-sm underline underline-offset-4 transition-colors"
                >
                  {t('waitlistPopup.dismiss')}
                </button>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
