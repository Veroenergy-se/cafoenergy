import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SITE } from '@/lib/constants'
import MoarLogo from '@/components/shared/MoarLogo'

const linkClass = 'text-off-white/70 hover:text-caforange transition-colors'

export default function Footer() {
  const { t } = useTranslation()

  const columns = [
    {
      title: t('footer.explore'),
      links: [
        { to: '/shop', label: t('nav.shop') },
        { to: '/how-it-works', label: t('nav.science') },
        { to: '/community', label: t('nav.community') },
        { to: '/about', label: t('nav.about') },
      ],
    },
    {
      title: t('footer.help'),
      links: [
        { to: '/faq', label: 'FAQ' },
        { to: '/contact', label: t('nav.contact') },
        { to: '/privacy-policy', label: t('footer.privacy') },
      ],
    },
  ]

  return (
    <footer className="bg-brown text-off-white overflow-hidden">
      <div className="page-container pt-16 lg:pt-20">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,0.6fr))]">
          <p className="font-display uppercase text-4xl sm:text-5xl leading-[0.9]">
            {t('footer.lineA')}<br />
            <span className="text-caforange">{t('footer.lineB')}</span>
          </p>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h4 className="font-accent text-xs uppercase tracking-[0.2em] font-semibold text-off-white/45">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.to}><Link to={l.to} className={linkClass}>{l.label}</Link></li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h4 className="font-accent text-xs uppercase tracking-[0.2em] font-semibold text-off-white/45">{t('footer.social')}</h4>
            <ul className="mt-4 space-y-2.5">
              <li><a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" className={linkClass}>Instagram</a></li>
              <li><a href={SITE.social.tiktok} target="_blank" rel="noopener noreferrer" className={linkClass}>TikTok</a></li>
              <li><a href={`mailto:${SITE.email}`} className={`${linkClass} break-all`}>{SITE.email}</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sign-off: the wordmark, edge to edge */}
      <div className="page-container mt-16 lg:mt-24">
        <MoarLogo className="block w-full text-caforange" />
      </div>

      <div className="page-container mt-6 pb-8 flex flex-wrap justify-between gap-3 text-sm text-off-white/40">
        <span>{t('footer.copyright', { year: new Date().getFullYear() })}</span>
        <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="hover:text-off-white transition-colors">
          {t('footer.backToTop')} ↑
        </a>
      </div>
    </footer>
  )
}
