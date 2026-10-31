import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

// Our story: told in chapters by the three of us. Colours fade between sections.

const ease = [0.2, 0.8, 0.2, 1] as const

function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`font-accent text-xs uppercase tracking-[0.2em] font-semibold text-accent ${className}`}>{children}</p>
}

// ---------- Opening ----------
function Opening() {
  const { t } = useTranslation()
  return (
    <section data-tone="cream" className="text-fg min-h-screen grid items-center pt-32 pb-20">
      <div className="page-container grid md:grid-cols-[1fr_1.1fr] gap-12 md:gap-20 items-center">
        <motion.figure
          className="relative m-0 bg-[#fffaf2] p-3.5 pb-5 shadow-[0_24px_50px_rgba(45,29,23,0.25)]"
          initial={{ opacity: 0, rotate: -8, y: 30 }}
          animate={{ opacity: 1, rotate: -3, y: 0 }}
          transition={{ duration: 0.9, ease }}
        >
          <i className="absolute left-1/2 -top-3.5 w-28 h-7 -translate-x-1/2 rotate-2 bg-caforange/55" aria-hidden="true" />
          <img src="/images/founders.jpg" alt={t('about.opening.alt')} className="w-full aspect-[4/3] object-cover" />
        </motion.figure>
        <div>
          <h1 className="font-display uppercase leading-[0.95] text-[clamp(2.2rem,5.6vw,5.4rem)]">
            {t('about.opening.titleA')} <span className="text-accent">{t('about.opening.titleB')}</span>
          </h1>
          <p className="mt-6 font-accent text-[clamp(17px,1.5vw,20px)] leading-relaxed max-w-[38ch]">{t('about.opening.body')}</p>
          <p className="mt-6 font-display uppercase text-accent text-[clamp(0.9rem,1.3vw,1.1rem)]">{t('about.names')}</p>
        </div>
      </div>
    </section>
  )
}

// ---------- Chapters: the big number follows the chapter you're reading ----------
type Chapter = { label: string; titleA: string; titleB: string; body: string }

function Visual({ i }: { i: number }) {
  const { t } = useTranslation()
  if (i === 0) {
    return (
      <div className="mt-8 max-w-[400px] aspect-[4/5] overflow-hidden rotate-2">
        <img src="/images/team-1.jpg" alt="" loading="lazy" className="w-full h-full object-cover" />
      </div>
    )
  }
  if (i === 2) {
    const versions = 7
    return (
      <div className="mt-8 flex flex-wrap gap-2.5" aria-label={t('about.versions', { count: versions })}>
        {Array.from({ length: versions }, (_, v) => {
          const last = v === versions - 1
          return (
            <motion.span
              key={v}
              className={`font-display text-[13px] px-3 py-3 border-[3px] ${last ? 'bg-accent border-accent text-brown' : 'border-fg opacity-35 line-through'}`}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: last ? 1 : 0.35, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: v * 0.12, ease }}
            >
              V{v + 1}
            </motion.span>
          )
        })}
      </div>
    )
  }
  if (i === 3) {
    return (
      <img
        src="/images/moar-bar.webp"
        alt=""
        loading="lazy"
        className="mt-10 w-[min(460px,100%)] drop-shadow-[0_26px_26px_rgba(0,0,0,0.35)]"
      />
    )
  }
  return null
}

function Chapters() {
  const { t } = useTranslation()
  const chapters = t('about.chapters', { returnObjects: true }) as Chapter[]
  const refs = useRef<(HTMLDivElement | null)[]>([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      let i = 0
      refs.current.forEach((el, j) => {
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.6) i = j
      })
      setActive(i)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const total = chapters.length + 1 // the last chapter is launch day, further down
  return (
    <section data-tone="brown" className="text-fg py-24 lg:py-32">
      <div className="page-container grid md:grid-cols-[0.8fr_1.2fr] md:gap-20">
        <div className="sticky top-0 md:top-[18vh] self-start z-[3] bg-tone md:bg-transparent -mx-6 px-6 md:mx-0 pt-20 pb-3 md:p-0 flex md:block items-baseline gap-4">
          <b className="block font-display leading-[0.8] text-accent text-[3.4rem] md:text-[clamp(6rem,15vw,15rem)] tabular-nums">
            {String(active + 1).padStart(2, '0')}
          </b>
          <span className="flex-1 min-w-0 md:block md:mt-5 font-accent text-xs uppercase tracking-[0.18em] font-semibold">
            {chapters[active]?.label}
          </span>
          <div className="flex gap-1.5 md:mt-6" aria-hidden="true">
            {Array.from({ length: total }, (_, j) => (
              <i key={j} className={`h-[5px] w-4 md:w-7 transition-colors duration-300 ${j <= active ? 'bg-accent' : 'bg-fg/25'}`} />
            ))}
          </div>
        </div>
        <div className="grid gap-24 md:gap-[22vh] mt-6 md:mt-0">
          {chapters.map((c, i) => (
            <div key={c.label} ref={(el) => { refs.current[i] = el }}>
              <h2 className="font-display uppercase leading-[0.95] text-[clamp(1.8rem,4vw,3.6rem)]">
                {c.titleA} <span className="text-accent">{c.titleB}</span>
              </h2>
              <p className="mt-5 font-accent text-[clamp(16px,1.4vw,19px)] leading-relaxed max-w-[44ch] opacity-90">{c.body}</p>
              <Visual i={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------- Rules ----------
function Rules() {
  const { t } = useTranslation()
  const rules = t('about.rules.items', { returnObjects: true }) as { title: string; body: string }[]
  return (
    <section data-tone="orange" className="text-fg py-24 lg:py-32">
      <div className="page-container">
        <h2 className="font-display uppercase leading-[0.92] text-[clamp(2.2rem,6vw,5.6rem)]">
          {t('about.rules.titleA')}<br />{t('about.rules.titleB')}
        </h2>
        <div className="mt-12">
          {rules.map((r, i) => (
            <motion.div
              key={r.title}
              className="grid sm:grid-cols-[auto_minmax(0,1fr)] gap-3 sm:gap-10 items-baseline py-[clamp(22px,3vw,40px)] border-t-[3px] last:border-b-[3px] border-fg"
              initial={{ opacity: 0.25, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-25% 0px' }}
              transition={{ duration: 0.6, ease }}
            >
              <b className="font-display text-[clamp(1rem,1.6vw,1.3rem)] opacity-80">{String(i + 1).padStart(2, '0')}</b>
              <div>
                <h3 className="font-display uppercase leading-[0.98] text-[clamp(1.5rem,4.4vw,4rem)]">{r.title}</h3>
                <p className="mt-3.5 font-accent text-[clamp(15px,1.3vw,18px)] leading-relaxed max-w-[46ch]">{r.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------- A note from us ----------
function Note() {
  const { t } = useTranslation()
  const lines = t('about.note.lines', { returnObjects: true }) as string[]
  return (
    <section data-tone="brown" className="text-fg py-24 lg:py-32">
      <div className="page-container">
        <Eyebrow className="text-center">{t('about.note.eyebrow')}</Eyebrow>
        <motion.div
          className="mt-8 max-w-[760px] mx-auto bg-[#fffaf2] text-brown p-[clamp(28px,5vw,70px)] shadow-[0_30px_60px_rgba(0,0,0,0.25)]"
          initial={{ opacity: 0, y: 40, rotate: 1 }}
          whileInView={{ opacity: 1, y: 0, rotate: -1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease }}
        >
          {lines.map((l) => (
            <p key={l} className="font-accent text-[clamp(17px,1.5vw,20px)] leading-[1.65] mb-[18px]">{l}</p>
          ))}
          <p className="mt-8 font-display uppercase text-caforange text-[clamp(1.1rem,2.2vw,1.8rem)] leading-tight">— {t('about.names')}</p>
        </motion.div>
      </div>
    </section>
  )
}

// ---------- Chapter 05: launch day ----------
function LaunchDay() {
  const { t } = useTranslation()
  return (
    <section data-tone="cream" className="text-fg py-24 lg:py-32">
      <div className="page-container grid md:grid-cols-[0.8fr_1.2fr] gap-6 md:gap-20 items-start">
        <div className="flex md:block items-baseline gap-4">
          <b className="block font-display leading-[0.8] text-accent text-[3.4rem] md:text-[clamp(6rem,15vw,15rem)]">05</b>
          <span className="md:block md:mt-5 font-accent text-xs uppercase tracking-[0.18em] font-semibold">{t('about.launch.label')}</span>
        </div>
        <div>
          <h2 className="font-display uppercase leading-[0.95] text-[clamp(1.8rem,4vw,3.6rem)]">
            {t('about.launch.titleA')} <span className="text-accent">{t('about.launch.titleB')}</span>
          </h2>
          <p className="mt-5 font-accent text-[clamp(16px,1.4vw,19px)] leading-relaxed max-w-[44ch]">{t('about.launch.body')}</p>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link to="/shop" className="inline-block bg-brown text-off-white px-7 py-5 font-accent text-sm uppercase tracking-[0.14em] font-semibold hover:-translate-y-0.5 transition-transform">
              {t('about.launch.shop')} →
            </Link>
            <a href="#waitlist" className="font-accent text-sm uppercase tracking-[0.14em] font-semibold border-b-2 border-current pb-1">
              {t('about.launch.waitlist')} ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function About() {
  const { t } = useTranslation()
  return (
    <>
      <Helmet>
        <title>{t('about.metaTitle')}</title>
        <meta name="description" content={t('about.metaDescription')} />
      </Helmet>
      <Opening />
      <Chapters />
      <Rules />
      <Note />
      <LaunchDay />
    </>
  )
}
