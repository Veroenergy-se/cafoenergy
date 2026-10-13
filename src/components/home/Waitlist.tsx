import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import LaunchCountdown from './LaunchCountdown'

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
    <section id="waitlist" data-tone="orange" className="text-fg py-20 lg:py-28 scroll-mt-20">
      <div className="page-container grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end">
        <div>
          <p className="font-accent text-xs uppercase tracking-[0.2em] font-semibold">{t('waitlist.eyebrow')}</p>
          <h2 className="mt-4 font-display uppercase leading-[0.92] text-[clamp(1.4rem,5.4vw,5rem)] break-words">
            {t('waitlist.titleA')} <span className="text-accent">{t('waitlist.titleB')}</span>
          </h2>
        </div>

        <div className="lg:pb-3">
          <p className="max-w-md text-lg leading-relaxed">{t('waitlist.subtitle')}</p>

          {status === 'success' ? (
            <div className="mt-8 border-t-2 border-fg pt-5">
              <p className="font-display uppercase text-2xl leading-tight">{t('waitlist.success')}</p>
              <p className="mt-2 text-fg/70">{t('waitlist.successSub')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex items-stretch border-b-2 border-fg">
              <label htmlFor="waitlist-email" className="sr-only">Email</label>
              <input
                id="waitlist-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="min-w-0 flex-1 bg-transparent py-4 text-xl sm:text-2xl placeholder-fg/45 focus:outline-none"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="shrink-0 inline-flex items-center gap-2 px-5 sm:px-7 my-2 bg-brown text-off-white font-accent font-semibold text-sm uppercase tracking-[0.14em] hover:bg-off-white hover:text-brown transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? '…' : t('waitlist.cta')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {status === 'error' ? (
            <p className="mt-3 text-sm font-semibold">{t('waitlist.error')}</p>
          ) : (
            status !== 'success' && <p className="mt-3 text-sm text-fg/65">{t('waitlist.fineprint')}</p>
          )}

          <LaunchCountdown className="mt-8" />
        </div>
      </div>
    </section>
  )
}
