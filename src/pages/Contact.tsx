import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { SITE } from '@/lib/constants'

// Contact: a big email link, a short form that opens the visitor's email app, and socials.

const field =
  'w-full bg-transparent border-[3px] border-fg px-4 py-3.5 font-accent text-base text-fg placeholder:text-fg/40 focus:outline-none focus:border-accent transition-colors'

export default function Contact() {
  const { t } = useTranslation()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const subject = 'Contact from MOAR Bar website'
    const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSubmitted(true)
  }

  const socials = [
    { label: 'Instagram', href: SITE.social.instagram },
    { label: 'TikTok', href: SITE.social.tiktok },
  ]

  return (
    <>
      <Helmet>
        <title>{t('contact.metaTitle')}</title>
        <meta name="description" content={t('contact.metaDescription')} />
      </Helmet>

      <section data-tone="cream" className="text-fg pt-36 pb-20 lg:pt-44 lg:pb-28">
        <div className="page-container">
          <p className="font-accent text-xs uppercase tracking-[0.2em] font-semibold text-accent">{t('contact.eyebrow')}</p>
          <h1 className="mt-5 font-display uppercase leading-[0.9] text-[clamp(3.4rem,13vw,12rem)]">
            {t('contact.titleA')} <span className="text-accent">{t('contact.titleB')}</span>
          </h1>
          <p className="mt-8 max-w-[44ch] font-accent text-[clamp(16px,1.5vw,20px)] leading-relaxed">{t('contact.lede')}</p>
          <p className="mt-12 font-accent text-xs uppercase tracking-[0.2em] font-semibold">{t('contact.emailLabel')}</p>
          <a
            href={`mailto:${SITE.email}`}
            className="mt-3 inline-block font-display uppercase text-[clamp(1rem,3.4vw,2.8rem)] leading-tight [overflow-wrap:anywhere] border-b-[3px] border-accent hover:text-accent transition-colors"
          >
            {SITE.email}
          </a>
        </div>
      </section>

      <section data-tone="brown" className="text-fg py-20 lg:py-28">
        <div className="page-container grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20">
          <div>
            <h2 className="font-display uppercase leading-[0.95] text-[clamp(2rem,5vw,4.4rem)]">
              {t('contact.formTitleA')} <span className="text-accent">{t('contact.formTitleB')}</span>
            </h2>
            <p className="mt-10 font-accent text-xs uppercase tracking-[0.2em] font-semibold">{t('contact.follow')}</p>
            <div className="mt-4 flex flex-col gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display uppercase text-[clamp(1.4rem,3vw,2.4rem)] leading-none hover:text-accent transition-colors w-fit"
                >
                  {s.label} ↗
                </a>
              ))}
            </div>
            <p className="mt-10 font-accent text-[15px] opacity-80">
              {t('contact.faqLine')}{' '}
              <Link to="/faq" className="underline underline-offset-4 decoration-2 hover:text-accent">{t('contact.faqLink')}</Link>.
            </p>
          </div>

          {submitted ? (
            <div className="border-[3px] border-fg p-10 self-start">
              <p className="font-display uppercase text-accent text-[clamp(2rem,4vw,3.4rem)] leading-none">{t('contact.sentTitle')}</p>
              <p className="mt-5 font-accent text-[17px] leading-relaxed max-w-[40ch]">{t('contact.sentBody')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-5">
              <label className="grid gap-2">
                <span className="font-accent text-xs uppercase tracking-[0.18em] font-semibold">{t('contact.name')}</span>
                <input name="name" type="text" required autoComplete="name" placeholder={t('contact.namePh')} className={field} />
              </label>
              <label className="grid gap-2">
                <span className="font-accent text-xs uppercase tracking-[0.18em] font-semibold">{t('contact.email')}</span>
                <input name="email" type="email" required autoComplete="email" placeholder={t('contact.emailPh')} className={field} />
              </label>
              <label className="grid gap-2">
                <span className="font-accent text-xs uppercase tracking-[0.18em] font-semibold">{t('contact.message')}</span>
                <textarea name="message" required rows={6} placeholder={t('contact.messagePh')} className={`${field} resize-none`} />
              </label>
              <button
                type="submit"
                className="justify-self-start bg-caforange text-brown px-7 py-5 font-accent text-sm uppercase tracking-[0.14em] font-semibold hover:-translate-y-0.5 transition-transform"
              >
                {t('contact.send')} →
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
