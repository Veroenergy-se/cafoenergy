import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { SITE } from '@/lib/constants'
import { legal, type LegalKey } from '@/content/legal'

export default function LegalPage({ doc }: { doc: LegalKey }) {
  const { i18n, t } = useTranslation()
  const d = legal[i18n.language === 'sv' ? 'sv' : 'en'][doc]
  const { company, email, freeShippingThreshold } = SITE
  const companyLine = [company.name, company.orgNumber && `${t('footer.orgNumber')} ${company.orgNumber}`, company.address]
    .filter(Boolean)
    .join(', ')
  const fill = (s: string) =>
    s
      .split('{company}').join(companyLine)
      .split('{email}').join(email)
      .split('{threshold}').join(`${freeShippingThreshold.sek} kr`)

  return (
    <>
      <Helmet>
        <title>{d.title} — MOAR Bar</title>
      </Helmet>
      <section className="bg-off-white text-brown pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="page-container">
          <div className="max-w-3xl">
            <p className="font-accent text-xs uppercase tracking-[0.2em] font-semibold text-caforange">{t('footer.legal')}</p>
            <h1 className="mt-3 font-display uppercase text-3xl sm:text-4xl lg:text-5xl leading-[0.95]">{d.title}</h1>
            <p className="mt-4 text-sm text-brown/55">{d.updated}</p>
            <div className="mt-10 space-y-4 text-lg leading-relaxed text-brown/80">
              {d.intro.map((p, i) => <p key={i}>{fill(p)}</p>)}
            </div>
            <div className="mt-12 space-y-10">
              {d.sections.map((s) => (
                <div key={s.h} className="border-t border-brown/15 pt-6">
                  <h2 className="font-display uppercase text-lg sm:text-2xl leading-tight break-words">{s.h}</h2>
                  {s.p?.map((p, i) => <p key={i} className="mt-3 leading-relaxed text-brown/80">{fill(p)}</p>)}
                  {s.list && (
                    <ul className="mt-3 space-y-2 list-disc pl-5 marker:text-caforange leading-relaxed text-brown/80">
                      {s.list.map((li, i) => <li key={i}>{fill(li)}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
