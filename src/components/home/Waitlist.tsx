import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AnimatedSection from '@/components/shared/AnimatedSection'

export default function Waitlist() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

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
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="waitlist" className="bg-caforange py-24 lg:py-32">
      <div className="page-container text-center">
        <AnimatedSection className="w-full">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading text-off-white leading-tight tracking-tight mb-4">
            {t('waitlist.title')}
          </h2>
          <p className="text-off-white/90 font-accent text-lg mb-12">
            {t('waitlist.subtitle')}
          </p>

          {status === 'success' ? (
            <div className="inline-block rounded-2xl border-2 border-off-white/30 px-10 py-5">
              <p className="text-off-white font-heading text-3xl tracking-wide">{t('waitlist.success')}</p>
              <p className="text-off-white/60 font-accent text-sm mt-1">{t('waitlist.successSub')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-0 max-w-xl mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full sm:flex-1 px-6 py-4 bg-off-white/10 border-2 border-off-white/30 text-off-white placeholder-off-white/50 font-accent text-base focus:outline-none focus:border-off-white/70 transition-colors sm:border-r-0"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full sm:w-auto px-10 py-4 bg-brown text-off-white font-heading text-xl tracking-widest uppercase hover:bg-brown/90 transition-colors disabled:opacity-50 border-2 border-brown"
              >
                {status === 'loading' ? '...' : t('waitlist.cta')}
              </button>
            </form>
          )}

          {status === 'error' && (
            <p className="mt-4 text-red-400 font-accent text-sm">{t('waitlist.error')}</p>
          )}
        </AnimatedSection>
      </div>
    </section>
  )
}
