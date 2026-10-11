import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SITE } from '@/lib/constants'
import MoarLogo from '@/components/shared/MoarLogo'

const linkClass = 'text-fg/70 hover:text-accent transition-colors'

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
        { to: '/shipping-returns', label: t('footer.shipping') },
      ],
    },
    {
      title: t('footer.legal'),
      links: [
        { to: '/terms', label: t('footer.terms') },
        { to: '/privacy-policy', label: t('footer.privacy') },
        { to: '/cookies', label: t('footer.cookies') },
      ],
    },
  ]

  return (
    <footer data-tone="brown" className="text-fg overflow-hidden">
      <div className="page-container pt-16 lg:pt-20">
        <div className="grid gap-12 grid-cols-2 md:grid-cols-[minmax(0,1.2fr)_repeat(4,minmax(0,0.6fr))]">
          <p className="col-span-2 md:col-span-1 font-display uppercase text-4xl sm:text-5xl leading-[0.9]">
            {t('footer.lineA')}<br />
            <span className="text-accent">{t('footer.lineB')}</span>
          </p>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h4 className="font-accent text-xs uppercase tracking-[0.2em] font-semibold text-accent">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.to}><Link to={l.to} className={linkClass}>{l.label}</Link></li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h4 className="font-accent text-xs uppercase tracking-[0.2em] font-semibold text-accent">{t('footer.social')}</h4>
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
        <MoarLogo className="block w-full text-accent" />
      </div>

      <div className="page-container mt-6 pb-8 flex flex-wrap justify-between gap-3 text-sm text-fg/40">
        <span>
          {t('footer.copyright', { year: new Date().getFullYear(), company: SITE.company.name })}
          {SITE.company.orgNumber && ` · ${t('footer.orgNumber')} ${SITE.company.orgNumber}`}
          {SITE.company.address && ` · ${SITE.company.address}`}
        </span>
        <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="hover:text-fg transition-colors">
          {t('footer.backToTop')} ↑
        </a>
      </div>
    </footer>
  )
}
