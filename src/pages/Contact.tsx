import { useState, type FormEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { SITE } from '@/lib/constants'
import { Mail, Send } from 'lucide-react'

export default function Contact() {
  const { t } = useTranslation()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const subject = 'Contact from CAFO Energy website'
    const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSubmitted(true)
  }

  return (
    <>
      <Helmet>
        <title>Contact — CAFO Energy</title>
        <meta name="description" content="Get in touch with CAFO Energy. Questions, ideas, or partnerships — we'd love to hear from you." />
      </Helmet>

      <section className="bg-near-black py-32 text-center">
        <AnimatedSection>
          <h1 className="text-8xl sm:text-9xl lg:text-[10rem] font-heading text-white">{t('contact.title')}</h1>
          <p className="mt-4 text-white/50 font-accent text-lg max-w-xl mx-auto">{t('contact.subtitle')}</p>
        </AnimatedSection>
      </section>

      <section className="py-24 bg-warm-white">
        <div className="page-container">
          <div className="grid lg:grid-cols-2 gap-16">
            <AnimatedSection direction="left">
              {submitted ? (
                <div className="bg-forest/5 rounded-3xl p-12 text-center">
                  <div className="text-5xl mb-4">✓</div>
                  <h3 className="text-2xl font-heading text-near-black">Message Sent!</h3>
                  <p className="mt-2 text-near-black/50">We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium font-accent text-near-black/70 mb-2">
                      {t('contact.name')}
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="w-full px-5 py-4 bg-white border border-near-black/10 rounded-2xl text-near-black placeholder-near-black/30 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all font-body"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium font-accent text-near-black/70 mb-2">
                      {t('contact.email')}
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full px-5 py-4 bg-white border border-near-black/10 rounded-2xl text-near-black placeholder-near-black/30 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all font-body"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium font-accent text-near-black/70 mb-2">
                      {t('contact.message')}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      className="w-full px-5 py-4 bg-white border border-near-black/10 rounded-2xl text-near-black placeholder-near-black/30 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all font-body resize-none"
                      placeholder="Your message..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold to-gold-light text-near-black font-semibold font-accent rounded-full hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold/20 transition-all duration-300"
                  >
                    <Send className="w-4 h-4" />
                    {t('contact.send')}
                  </button>
                </form>
              )}
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-semibold font-accent uppercase tracking-wider text-near-black/30 mb-4">
                    {t('contact.directEmail')}
                  </h3>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="inline-flex items-center gap-3 text-lg font-medium text-near-black hover:text-gold transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    {SITE.email}
                  </a>
                </div>

                <div>
                  <h3 className="text-sm font-semibold font-accent uppercase tracking-wider text-near-black/30 mb-4">
                    {t('contact.followUs')}
                  </h3>
                  <div className="flex gap-4">
                    <a
                      href={SITE.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-near-black/5 rounded-2xl hover:bg-gold/10 hover:text-gold transition-all"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                    </a>
                    <a
                      href={SITE.social.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-near-black/5 rounded-2xl hover:bg-gold/10 hover:text-gold transition-all"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.16z"/></svg>
                    </a>
                    <a
                      href={SITE.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-near-black/5 rounded-2xl hover:bg-gold/10 hover:text-gold transition-all"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  )
}
