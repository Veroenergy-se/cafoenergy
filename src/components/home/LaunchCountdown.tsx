import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SITE } from '../../lib/constants'

const LAUNCH = new Date(SITE.launchDate).getTime()

function remaining() {
  const ms = Math.max(0, LAUNCH - Date.now())
  return {
    days: Math.floor(ms / 864e5),
    hours: Math.floor(ms / 36e5) % 24,
    minutes: Math.floor(ms / 6e4) % 60,
    seconds: Math.floor(ms / 1e3) % 60,
    done: ms === 0,
  }
}

// Days / hours / minutes / seconds until first sales. Hides itself once launched.
export default function LaunchCountdown({ className = '' }: { className?: string }) {
  const { t } = useTranslation()
  const [left, setLeft] = useState(remaining)

  useEffect(() => {
    const id = setInterval(() => setLeft(remaining()), 1000)
    return () => clearInterval(id)
  }, [])

  if (left.done) return null

  const units = ['days', 'hours', 'minutes', 'seconds'] as const
  return (
    <div role="timer" aria-label={t('waitlist.countdown.label')} className={`flex gap-2 sm:gap-3 ${className}`}>
      {units.map(u => (
        <div key={u} className="flex-1 sm:flex-none sm:min-w-[84px] bg-brown text-off-white px-2 pt-3 pb-2.5 text-center">
          <span className="block font-display text-2xl sm:text-4xl leading-none tabular-nums">
            {String(left[u]).padStart(2, '0')}
          </span>
          <span className="mt-1.5 block font-accent text-[10px] uppercase tracking-[0.16em] font-semibold text-off-white/70">
            {t(`waitlist.countdown.${u}`)}
          </span>
        </div>
      ))}
    </div>
  )
}
