import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

// Shown for any address that doesn't match a page.
export default function NotFound() {
  const { t } = useTranslation()
  return (
    <>
      <Helmet>
        <title>{t('notFound.metaTitle')}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <section data-tone="cream" className="text-fg min-h-[85vh] grid items-center pt-32 pb-20">
        <div className="page-container">
          <p className="font-accent text-xs uppercase tracking-[0.2em] font-semibold text-accent">{t('notFound.eyebrow')}</p>
          <h1 className="mt-5 font-display uppercase leading-[0.9] text-[clamp(2.4rem,10vw,10rem)]">
            {t('notFound.titleA')} <span className="text-accent">{t('notFound.titleB')}</span>
          </h1>
          <p className="mt-8 max-w-[40ch] font-accent text-[clamp(16px,1.5vw,20px)] leading-relaxed">{t('notFound.body')}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link to="/shop" className="inline-block bg-brown text-off-white px-7 py-5 font-accent text-sm uppercase tracking-[0.14em] font-semibold hover:-translate-y-0.5 transition-transform">
              {t('notFound.shop')} →
            </Link>
            <Link to="/" className="font-accent text-sm uppercase tracking-[0.14em] font-semibold border-b-2 border-current pb-1">
              {t('notFound.home')}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
